// Private, sequential collector. A dry run never reads a key or calls a provider.
import {readFile,writeFile,mkdir,open,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {cases} from '../corpus.mjs';
import {check} from '../checker.mjs';
import {reserveUsd,usageCost,redact,rates} from '../collect.mjs';
import {retrieve,retrievalMatrix,inspectEvidence,conditions} from './retrieve.mjs';

const root=dirname(fileURLToPath(import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
export const endpoint='https://api.openai.com/v1/responses';
export const priorSpentUsd=0.41792,budgetUsd=10;
const schema={type:'object',additionalProperties:false,properties:{answer:{type:'string'},evidence:{type:'array',items:{type:'object',additionalProperties:false,properties:{fact_id:{type:'string',enum:['F1','F2','F3','F4','F5','F6']},quote:{type:'string'}},required:['fact_id','quote']}}},required:['answer','evidence']};
const instruction={
 fr:'Réponds en français à la question en 100 mots maximum, à partir des seules phrases source fournies. Conserve le périmètre, les exclusions et les incertitudes. Si les phrases reçues ne permettent pas de conclure, dis-le ; ne complète pas avec tes connaissances. Identifie la source par son nom. Dans evidence, donne les identifiants des phrases qui soutiennent ta réponse et pour chacun un extrait copié exactement, de 16 caractères au moins. Ne cite pas une phrase absente. Réponds dans le format JSON demandé.',
 en:'Answer the question in English in at most 100 words, using only the supplied source sentences. Preserve scope, exclusions and uncertainty. If the received sentences cannot establish an answer, say so; do not add background knowledge. Identify the source by name. In evidence, give the IDs of sentences supporting your answer and an exact copied extract of at least 16 characters from each. Never cite an absent sentence. Use the requested JSON format.'
};
export function makePlan(){
 const runs=[];
 for(const c of cases)for(let repetition=1;repetition<=3;repetition++)for(const [li,language]of ['fr','en'].entries()){
  const variants=(repetition+li)%2?['distributed','grouped']:['grouped','distributed'];
  for(const [vi,variant]of variants.entries())for(const mode of (repetition+vi)%2?['retrieved','full']:['full','retrieved']){
   const retrieval=retrieve(c,language,variant);
   const facts=mode==='retrieved'?retrieval.facts:c.order[variant].map(i=>({fact_id:`F${i+1}`,text:c.facts[language][i]}));
   const source=facts.map(f=>`[${f.fact_id}] ${f.text}`).join('\n\n');
   const request={model:'gpt-6-astra',input:`${instruction[language]}\n\nQuestion: ${c.question[language]}\n\nSource: ${c.sourceName}\n\n${source}`,reasoning:{effort:'medium'},max_output_tokens:1200,service_tier:'default',store:false,tools:[],text:{format:{type:'json_schema',name:'grounded_answer',strict:true,schema}}};
   runs.push({run_id:`retrieval-v1-${c.id}-${language}-${variant}-${mode}-r${repetition}`,order:runs.length+1,case_id:c.id,language,variant,mode,repetition,source_url:c.source,source_name:c.sourceName,source_facts:facts,source_text:source,question:c.question[language],retrieval:mode==='retrieved'?retrieval:null,condition_availability:conditions[c.id].map(([id])=>({fact_id:id,provided:facts.some(f=>f.fact_id===id)})),request});
  }
 }
 return runs;
}
async function hashes(){const out={};for(const f of ['retrieve.mjs','collect.mjs','PROTOCOL.md','../corpus.mjs','../corpus.json','../checker.mjs','../collect.mjs','../results.json','../archive/v0.2/results.json'])out[f]=sha(await readFile(resolve(root,f)));return out;}
async function priorCosts(){
 const initial=JSON.parse(await readFile(resolve(root,'../archive/v0.2/results.json'))),followup=JSON.parse(await readFile(resolve(root,'../results.json')));
 if(initial.runs.length!==36||followup.runs.length!==12||[...initial.runs,...followup.runs].some(r=>r.estimated_cost_usd===null)||Math.abs(initial.estimated_cost_usd+followup.estimated_cost_usd-priorSpentUsd)>1e-8)throw new Error('Historical spending cannot be established');
}
export async function freeze(target){
 await priorCosts();const runs=makePlan(),maximum=Number(runs.reduce((s,r)=>s+reserveUsd(r.request),0).toFixed(6));
 if(maximum+priorSpentUsd>budgetUsd)throw new Error('Full frozen plan exceeds cumulative budget');
 const plan={schema_version:1,experiment_id:'fragment-retrieval-v1-20261008',frozen_at:new Date().toISOString(),provider:'OpenAI',model:'gpt-6-astra',endpoint,surface:'local_lexical_retrieval_and_full_text_control',budget_usd:budgetUsd,prior_spent_usd:priorSpentUsd,reserved_max_usd:maximum,pricing:{currency:'USD',before_tax:true,per_million_tokens:rates,source:'https://developers.openai.com/api/docs/pricing',reviewed_at:'2026-10-08'},planned_count:runs.length,repetitions:3,hashes:await hashes(),sensitivity_matrix:retrievalMatrix(),runs};
 const f=await open(target,'wx',0o644);await f.writeFile(JSON.stringify(plan,null,2)+'\n');await f.close();return plan;
}
export function observe(planned,body,status){
 const messages=(body?.output??[]).filter(x=>x.type==='message');
 const raw=messages.flatMap(m=>m.content??[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n');
 let parsed=null;try{parsed=JSON.parse(raw);}catch{}
 const complete=status===200&&body.status==='completed'&&messages.length>0&&messages.every(m=>m.status==='completed')&&Boolean(raw.trim());
 const evidence=inspectEvidence(parsed,planned.source_facts),answer=parsed?.answer??'';
 return {http_status:status,returned_model:body?.model??null,response_id:body?.id??null,response_status:body?.status??null,service_tier:body?.service_tier??null,error:body?.error?{type:body.error.type??null,code:body.error.code??null}:null,incomplete_details:body?.incomplete_details??null,raw_output:raw,answer,parsed_output:parsed,complete,evidence_checks:evidence,legacy_checker_diagnostic:check({caseId:planned.case_id,lang:planned.language,text:answer.length<=24000?answer:'',complete:complete&&evidence.valid_json_shape}),usage:body?.usage??null,estimated_cost_usd:usageCost(body?.usage)};
}
async function save(path,data){const temp=path+'.tmp';await writeFile(temp,JSON.stringify(data,null,2)+'\n',{mode:0o600});await rename(temp,path);}
export async function collect({experimentPath,outDir,keyFile,execute=false,fetchImpl=fetch}){
 const bytes=await readFile(experimentPath),plan=JSON.parse(bytes);
 if(JSON.stringify(plan.hashes)!==JSON.stringify(await hashes())||JSON.stringify(plan.runs)!==JSON.stringify(makePlan())||plan.endpoint!==endpoint||plan.prior_spent_usd!==priorSpentUsd||plan.budget_usd!==budgetUsd)throw new Error('Frozen plan or files changed');
 await priorCosts();
 const maximum=plan.runs.reduce((s,r)=>s+reserveUsd(r.request),0);
 if(maximum+priorSpentUsd>budgetUsd)throw new Error('Insufficient remaining budget');
 if(!execute)return {planned:plan.runs.length,reserved_max_usd:Number(maximum.toFixed(6)),prior_spent_usd:priorSpentUsd,network_calls:0};
 const key=keyFile?(parseEnv(await readFile(keyFile,'utf8')).OPENAI_API_KEY??''):(process.env.OPENAI_API_KEY??'');
 if(!key.trim())throw new Error('OPENAI_API_KEY missing');
 await mkdir(outDir,{recursive:true,mode:0o700});const lock=await open(resolve(outDir,'.collection-lock'),'wx',0o600);await lock.writeFile(sha(bytes));await lock.close();
 const result={schema_version:1,experiment_id:plan.experiment_id,experiment_sha256:sha(bytes),planned_count:plan.runs.length,status:'collecting',started_at:new Date().toISOString(),prior_spent_usd:priorSpentUsd,estimated_cost_usd:0,cumulative_estimated_cost_usd:priorSpentUsd,runs:[],stopped_reason:null};
 const ledger=[];
 for(const run of plan.runs){
  const reserved=reserveUsd(run.request);if(priorSpentUsd+ledger.reduce((s,r)=>s+r.reserved_usd,0)+reserved>budgetUsd){result.stopped_reason='budget_reservation';break;}
  const row={run_id:run.run_id,started_at:new Date().toISOString(),reserved_usd:reserved,state:'started'};ledger.push(row);await save(resolve(outDir,'ledger.json'),ledger);await save(resolve(outDir,run.run_id+'.request.json'),run);
  let body={},status=null,networkError=null;
  try{
   const response=await fetchImpl(endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(run.request),redirect:'error',signal:AbortSignal.timeout(120000)});status=response.status;
   const raw=redact(await response.text(),key);await writeFile(resolve(outDir,run.run_id+'.response.json'),raw,{mode:0o600});try{body=JSON.parse(raw);}catch{networkError='invalid_json_response';}
  }catch(e){networkError=e?.name==='TimeoutError'?'timeout_unknown_billing':'transport_error_unknown_billing';}
  const record={...run,started_at:row.started_at,ended_at:new Date().toISOString(),reserved_usd:reserved,retry_of:null,...observe(run,body,status),network_error:networkError};result.runs.push(record);row.state='recorded';row.estimated_cost_usd=record.estimated_cost_usd;
  result.estimated_cost_usd=Number(result.runs.reduce((s,r)=>s+(r.estimated_cost_usd??0),0).toFixed(8));result.cumulative_estimated_cost_usd=Number((priorSpentUsd+result.estimated_cost_usd).toFixed(8));
  if(status!==200||networkError||record.error)result.stopped_reason='technical_failure';else if(record.estimated_cost_usd===null)result.stopped_reason='unknown_cost';else if(record.estimated_cost_usd>reserved)result.stopped_reason='cost_exceeded_reservation';else if(record.returned_model!==plan.model)result.stopped_reason='returned_model_changed';
  await save(resolve(outDir,'ledger.json'),ledger);await save(resolve(outDir,'results.json'),result);
  console.log(JSON.stringify({order:run.order,run_id:run.run_id,complete:record.complete,valid_json:record.evidence_checks.valid_json_shape,estimated_cost_usd:record.estimated_cost_usd,cumulative_usd:result.cumulative_estimated_cost_usd,stopped_reason:result.stopped_reason}));
  if(result.stopped_reason)break;
 }
 result.status=result.stopped_reason?'stopped':'collected';result.finished_at=new Date().toISOString();result.counts={planned:plan.runs.length,attempted:result.runs.length,complete:result.runs.filter(r=>r.complete).length,incomplete:result.runs.filter(r=>r.http_status===200&&!r.complete).length,failed:result.runs.filter(r=>r.http_status!==200||r.error||r.network_error).length,not_attempted:plan.runs.length-result.runs.length};
 result.reserved_usd=Number(ledger.reduce((s,r)=>s+r.reserved_usd,0).toFixed(6));await save(resolve(outDir,'results.json'),result);return {status:result.status,...result.counts,estimated_cost_usd:result.estimated_cost_usd,cumulative_estimated_cost_usd:result.cumulative_estimated_cost_usd};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const args=process.argv.slice(2),value=k=>args.includes(k)?args[args.indexOf(k)+1]:undefined;
  if(value('--freeze')){const p=await freeze(resolve(value('--freeze')));console.log(JSON.stringify({frozen:true,planned:p.planned_count,reserved_max_usd:p.reserved_max_usd,prior_spent_usd:p.prior_spent_usd}));}
  else if(value('--experiment')&&value('--out'))console.log(JSON.stringify(await collect({experimentPath:resolve(value('--experiment')),outDir:resolve(value('--out')),keyFile:value('--key-file')?resolve(value('--key-file')):undefined,execute:args.includes('--execute')})));
  else throw new Error('Use --freeze FILE or --experiment FILE --out PRIVATE_DIR [--key-file FILE] [--execute].');
 }catch(e){console.error(redact(e.message,process.env.OPENAI_API_KEY??''));process.exitCode=1;}
}
