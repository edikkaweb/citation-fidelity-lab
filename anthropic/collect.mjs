// Private Node execution. Never imported by browser code.
import {readFile,writeFile,open,mkdir,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {makePlan as referencePlan} from '../attached/collect.mjs';
import {inspect} from '../attached/measure.mjs';

export const model='claude-sonnet-5-5',endpoint='https://api.anthropic.com/v1/messages',budgetUsd=2;
export const rates={input:2,output:10,cache_write_5m:2.5,cache_write_1h:4,cache_read:0.1};
const root=dirname(fileURLToPath(import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function redact(s,key=''){let v=String(s);if(key)v=v.split(key).join('[REDACTED]');return v.replace(/sk-[A-Za-z0-9_-]{12,}/g,'[REDACTED]');}
export function makePlan(){return referencePlan().map(r=>({...r,reference_run_id:r.run_id,run_id:'anthropic-'+r.run_id,request:{model,max_tokens:1600,thinking:{type:'adaptive'},output_config:{effort:'medium',format:{type:'json_schema',schema:r.request.text.format.schema}},messages:[{role:'user',content:r.request.input}]}}));}
export function reserveUsd(request){return Math.ceil((Buffer.byteLength(JSON.stringify(request))+1024)*rates.cache_write_1h+request.max_tokens*rates.output)/1e6;}
export function usageCost(u){
 if(!u)return null;
 const nums=[u.input_tokens,u.output_tokens,u.cache_creation_input_tokens??0,u.cache_read_input_tokens??0];
 if(nums.some(x=>!Number.isInteger(x)||x<0))return null;
 const [input,output,write,read]=nums;
 const one=u.cache_creation?.ephemeral_1h_input_tokens??0,five=u.cache_creation?.ephemeral_5m_input_tokens??write;
 if(!Number.isInteger(one)||!Number.isInteger(five)||one<0||five<0||one+five!==write)return null;
 return (input*rates.input+output*rates.output+five*rates.cache_write_5m+one*rates.cache_write_1h+read*rates.cache_read)/1e6;
}
export function canStart(ledger,amount){return Number.isFinite(amount)&&amount>=0&&ledger.reduce((s,r)=>s+(r.settled_cost_usd??r.reserved_usd),0)+amount<=budgetUsd;}
export function validShape(p){
 const ids=['F1','F2','F3','F4'];
 if(!p||typeof p.answer!=='string'||!Array.isArray(p.conditions_not_available)||!p.conditions||Object.keys(p).sort().join()!=='answer,conditions,conditions_not_available'||Object.keys(p.conditions).sort().join()!==ids.join())return false;
 if(new Set(p.conditions_not_available).size!==p.conditions_not_available.length||p.conditions_not_available.some(x=>!ids.includes(x)))return false;
 return ids.every(id=>{const d=p.conditions[id];return d&&Object.keys(d).sort().join()==='availability,quote,sentence_id'&&['available','not_available'].includes(d.availability)&&['','S1','S2','S3','S4','S5','S6'].includes(d.sentence_id)&&typeof d.quote==='string';});
}
export function observation(run,body,status,key=''){
 const raw=redact((body?.content??[]).filter(x=>x.type==='text').map(x=>x.text).join('\n'),key);let parsed=null;try{parsed=JSON.parse(raw);}catch{}
 const complete=status===200&&body?.type==='message'&&body?.stop_reason==='end_turn'&&raw.trim().length>0;
 return {http_status:status,returned_model:body?.model??null,response_id:body?.id??null,response_status:body?.stop_reason??null,complete,valid_shape:validShape(parsed),raw_output:raw,parsed_output:parsed,answer:parsed?.answer??'',measurements:inspect(parsed,run.sentences),usage:body?.usage??null,estimated_cost_usd:usageCost(body?.usage),error_type:body?.error?.type??null};
}
async function hashes(){const out={};for(const f of ['collect.mjs','PROTOCOL.md','../attached/collect.mjs','../attached/corpus.mjs','../attached/measure.mjs','../attached/summarize.mjs','../attached/experiment.json','../attached/results.json','../attached/summary.json','../retrieval/retrieve.mjs','../corpus.mjs','../corpus.json','../results.json','../retrieval/results.json','../archive/v0.2/results.json','../attached-pilot/results.json'])out[f]=sha(await readFile(resolve(root,f)));return out;}
export async function freeze(target){const runs=makePlan(),plan={schema_version:1,experiment_id:'anthropic-attached-v2-20261009',frozen_at:new Date().toISOString(),provider:'Anthropic',model,endpoint,api_version:'2023-06-01',budget_usd:budgetUsd,pricing:rates,pricing_source:'https://platform.claude.com/docs/en/about-claude/pricing',planned_count:runs.length,full_plan_worst_case_usd:runs.reduce((s,r)=>s+reserveUsd(r.request),0),hashes:await hashes(),runs};const f=await open(target,'wx');await f.writeFile(JSON.stringify(plan,null,2)+'\n');await f.close();return plan;}
async function save(p,x){await writeFile(p+'.tmp',JSON.stringify(x,null,2)+'\n',{mode:0o600});await rename(p+'.tmp',p);}
export async function collect({experimentPath,outDir,keyFile,execute=false,fetchImpl=fetch,onProgress=console.log}){
 const bytes=await readFile(experimentPath),plan=JSON.parse(bytes);
 if(JSON.stringify(plan.hashes)!==JSON.stringify(await hashes())||JSON.stringify(plan.runs)!==JSON.stringify(makePlan())||plan.endpoint!==endpoint||plan.model!==model||plan.budget_usd!==budgetUsd||JSON.stringify(plan.pricing)!==JSON.stringify(rates))throw Error('Frozen plan changed');
 if(!execute)return {planned:plan.runs.length,network_calls:0,budget_usd:budgetUsd,full_plan_worst_case_usd:plan.full_plan_worst_case_usd};
 const key=keyFile?(parseEnv(await readFile(keyFile,'utf8')).ANTHROPIC_API_KEY??''):(process.env.ANTHROPIC_API_KEY??'');if(!key.trim())throw Error('Missing Anthropic access');
 await mkdir(outDir,{recursive:true,mode:0o700});const lock=await open(resolve(outDir,'.collection-lock'),'wx',0o600);await lock.writeFile(sha(bytes));await lock.close();
 const result={schema_version:1,experiment_id:plan.experiment_id,provider:'Anthropic',model,experiment_sha256:sha(bytes),status:'collecting',started_at:new Date().toISOString(),planned_count:plan.runs.length,budget_usd:budgetUsd,estimated_cost_usd:0,unsettled_reserved_usd:0,runs:[],stopped_reason:null};const ledger=[];
 await save(resolve(outDir,'results.json'),result);
 for(const run of plan.runs){
  const reserved=reserveUsd(run.request);if(!canStart(ledger,reserved)){result.stopped_reason='budget';break;}
  const entry={run_id:run.run_id,reserved_usd:reserved,started_at:new Date().toISOString(),settled_cost_usd:null};ledger.push(entry);await save(resolve(outDir,'ledger.json'),ledger);
  let body=null,status=null,requestId=null,transport=null;
  try{const response=await fetchImpl(endpoint,{method:'POST',headers:{'x-api-key':key,'anthropic-version':'2023-06-01','Content-Type':'application/json'},body:JSON.stringify(run.request),redirect:'error',signal:AbortSignal.timeout(120000)});status=response.status;requestId=response.headers.get('request-id');body=JSON.parse(redact(await response.text(),key));}catch{transport='transport_or_json_error_unknown_billing';}
  const row={...run,request:undefined,started_at:entry.started_at,ended_at:new Date().toISOString(),request_id:requestId,...observation(run,body,status,key),transport_error:transport};
  result.runs.push(row);entry.settled_cost_usd=row.estimated_cost_usd;
  result.estimated_cost_usd=Number(ledger.reduce((s,r)=>s+(r.settled_cost_usd??0),0).toFixed(8));result.unsettled_reserved_usd=Number(ledger.filter(r=>r.settled_cost_usd===null).reduce((s,r)=>s+r.reserved_usd,0).toFixed(8));
  await save(resolve(outDir,'results.json'),result);await save(resolve(outDir,'ledger.json'),ledger);
  onProgress(JSON.stringify({done:result.runs.length,planned:plan.runs.length,complete:row.complete,shape:row.valid_shape,estimated_usd:result.estimated_cost_usd}));
  if(transport||status!==200||row.estimated_cost_usd===null||!row.complete||!row.valid_shape||row.returned_model!==model||row.estimated_cost_usd>reserved){result.stopped_reason=transport??(status!==200?'http_error':row.estimated_cost_usd===null?'unknown_usage':!row.complete?'incomplete':!row.valid_shape?'invalid_shape':row.returned_model!==model?'unexpected_model':'reservation_exceeded');break;}
 }
 result.status=result.stopped_reason?'stopped':'complete';result.ended_at=new Date().toISOString();result.counts={attempted:result.runs.length,complete:result.runs.filter(r=>r.complete&&r.valid_shape).length,incomplete:result.runs.filter(r=>r.http_status===200&&(!r.complete||!r.valid_shape)).length,failed:result.runs.filter(r=>r.http_status!==200).length,unattempted:plan.runs.length-result.runs.length};await save(resolve(outDir,'results.json'),result);return {status:result.status,...result.counts,estimated_cost_usd:result.estimated_cost_usd,unsettled_reserved_usd:result.unsettled_reserved_usd,stopped_reason:result.stopped_reason};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const a=process.argv.slice(2),v=k=>a.includes(k)?a[a.indexOf(k)+1]:undefined;try{if(v('--freeze')){const p=await freeze(resolve(v('--freeze')));console.log(JSON.stringify({frozen:true,planned:p.planned_count,worst_case:p.full_plan_worst_case_usd,cap:budgetUsd}));}else console.log(JSON.stringify(await collect({experimentPath:resolve(v('--experiment')),outDir:resolve(v('--out')),keyFile:v('--key-file'),execute:a.includes('--execute')})));}catch(e){console.error(redact(e.message,process.env.ANTHROPIC_API_KEY??''));process.exitCode=1;}}
