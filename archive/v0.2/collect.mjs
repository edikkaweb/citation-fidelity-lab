// Private Node.js execution only. Never import this file in the browser.
import {readFile,writeFile,mkdir,open,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {cases,passage} from './corpus.mjs';
import {check} from './checker.mjs';

export const collectorVersion='0.2.0';
export const endpoint='https://api.openai.com/v1/responses';
export const rates={input:10,cached:1,cache_write:12.5,output:50}; // USD / 1M, Standard, <=272K context
const root=dirname(fileURLToPath(import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const instructions={
  fr:"Réponds à la question à partir du seul passage source fourni. Conserve le périmètre, les exclusions et les incertitudes associés à chaque chiffre ou affirmation. Si le passage ne permet pas de conclure, indique-le. Identifie la source par son nom ; n'invente ni preuve ni URL.",
  en:'Answer the question using only the supplied source passage. Keep the scope, exclusions and uncertainty attached to any number or claim. If the passage cannot establish an answer, say so. Identify the source by name; do not invent evidence or URLs.'
};
export function makePlan(){
  const runs=[];
  for(const c of cases)for(let repetition=1;repetition<=3;repetition++)for(const [li,lang] of ['fr','en'].entries()){
    const variants=(repetition+li)%2?['distributed','grouped']:['grouped','distributed'];
    for(const variant of variants){
      const source=passage(c,lang,variant);
      const prompt=`${instructions[lang]}\n\n${lang==='fr'?'Question':'Question'}: ${c.question[lang]}\n\nSource: ${c.sourceName}\n\n${source}`;
      const request={model:'gpt-6-astra',input:prompt,reasoning:{effort:'medium'},max_output_tokens:4000,service_tier:'default',store:false,tools:[]};
      runs.push({run_id:`openai-astra-${c.id}-${lang}-${variant}-r${repetition}`,order:runs.length+1,case_id:c.id,language:lang,variant,repetition,source_url:c.source,source_text:source,question:c.question[lang],request});
    }
  }
  return runs;
}
export function reserveUsd(request){
  // UTF-8 bytes bound text tokens conservatively; 1024 extra tokens reserve request framing.
  // Charge every input token at the higher cache-write rate; no savings assumed.
  const inputBound=Buffer.byteLength(request.input,'utf8')+1024;
  return Math.ceil((inputBound*rates.cache_write+request.max_output_tokens*rates.output)/1e6*1e6)/1e6;
}
export function usageCost(usage){
  if(!usage||!Number.isInteger(usage.input_tokens)||!Number.isInteger(usage.output_tokens))return null;
  const details=usage.input_tokens_details??{};
  const cached=details.cached_tokens??0,write=details.cache_write_tokens??0;
  if([usage.input_tokens,usage.output_tokens,cached,write].some(x=>!Number.isInteger(x)||x<0)||cached+write>usage.input_tokens)return null;
  return ((usage.input_tokens-cached-write)*rates.input+cached*rates.cached+write*rates.cache_write+usage.output_tokens*rates.output)/1e6;
}
export function canReserve(ledger,amount,budget){
  return Number.isFinite(amount)&&amount>=0&&ledger.reduce((n,r)=>n+r.reserved_usd,0)+amount<=budget;
}
export function redact(text,key=''){
  let out=String(text);if(key)out=out.split(key).join('[REDACTED]');
  return out.replace(/sk-[A-Za-z0-9_-]{12,}/g,'[REDACTED]');
}
export function observation(planned,body,httpStatus){
  const messages=(body?.output??[]).filter(x=>x.type==='message');
  const answer=messages.flatMap(m=>m.content??[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n');
  const refusal=messages.flatMap(m=>m.content??[]).filter(c=>c.type==='refusal').map(c=>c.refusal).join('\n');
  const complete=httpStatus===200&&body?.status==='completed'&&messages.length>0&&messages.every(m=>m.status==='completed')&&Boolean(answer.trim())&&answer.length<=24000;
  const error=body?.error?{type:body.error.type??null,code:body.error.code??null}:null;
  return {http_status:httpStatus,returned_model:body?.model??null,response_id:body?.id??null,service_tier:body?.service_tier??null,response_status:body?.status??null,incomplete_details:body?.incomplete_details??null,error,answer,refusal,complete,usage:body?.usage??null,estimated_cost_usd:usageCost(body?.usage),findings:check({caseId:planned.case_id,lang:planned.language,text:answer.length<=24000?answer:'',complete})};
}
async function atomicJson(path,value){const tmp=path+'.tmp';await writeFile(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});await rename(tmp,path);}
async function hashes(){const out={};for(const name of ['corpus.mjs','corpus.json','checker.mjs','PROTOCOL.md','collect.mjs'])out[name]=sha(await readFile(resolve(root,name)));return out;}
export async function freeze(target){
  const runs=makePlan();const total=runs.reduce((n,r)=>n+reserveUsd(r.request),0);
  if(total>10)throw new Error('Planned reservations exceed USD 10');
  const experiment={schema_version:1,experiment_id:'openai-astra-2026-10-08',created_at:new Date().toISOString(),collector_version:collectorVersion,provider:'OpenAI',endpoint,api_version:'v1; no dated API version exposed',surface:'responses_api_supplied_text',model:'gpt-6-astra',model_snapshot_note:'Documentation exposes this ID only; save the returned ID for every run. No consumer-interface claim.',languages:['fr','en'],cases:cases.map(c=>c.id),repetitions:3,planned_count:runs.length,budget_usd:10,pricing:{source:'https://developers.openai.com/api/docs/pricing',reviewed_at:'2026-10-08',currency:'USD',tax_included:false,per_million_tokens:rates},reserved_max_usd:Number(total.toFixed(6)),order:'Case order price/time/hosting; alternate A/B order by repetition and language; no randomisation claimed.',retry_policy:'No automatic retry. Stop on the first technical failure. Preserve every started attempt; never reuse a run ID.',second_provider:'Not collected in this series; the two-provider design remains incomplete.',hashes:await hashes(),runs};
  const handle=await open(target,'wx',0o644);await handle.writeFile(JSON.stringify(experiment,null,2)+'\n');await handle.close();return experiment;
}
export async function collect({experimentPath,outDir,keyFile,execute=false}){
  const experimentBytes=await readFile(experimentPath);const experiment=JSON.parse(experimentBytes);
  const current=await hashes();if(JSON.stringify(current)!==JSON.stringify(experiment.hashes))throw new Error('Frozen files changed; do not collect against altered material');
  if(experiment.endpoint!==endpoint||experiment.budget_usd!==10||JSON.stringify(experiment.runs)!==JSON.stringify(makePlan()))throw new Error('Unrecognised collection plan');
  if(!execute)return {planned:experiment.planned_count,reserved_max_usd:experiment.reserved_max_usd,network_calls:0};
  let key=process.env.OPENAI_API_KEY??'';
  if(keyFile)key=parseEnv(await readFile(keyFile,'utf8')).OPENAI_API_KEY??'';
  if(!key.trim())throw new Error('OPENAI_API_KEY is missing');
  await mkdir(outDir,{recursive:true,mode:0o700});
  const lock=await open(resolve(outDir,'.collection-lock'),'wx',0o600);
  await lock.writeFile('One collection per output directory; never remove to retry.\n');await lock.close();
  const ledger=[];await atomicJson(resolve(outDir,'ledger.json'),ledger);
  const result={schema_version:2,status:'collecting',experiment_id:experiment.experiment_id,experiment_sha256:sha(experimentBytes),planned_count:experiment.planned_count,runs:[],stopped_reason:null,estimated_cost_usd:0,cost_note:'Calculated from returned usage, not a billing receipt. Unknown-cost attempts retain their full reservation.',note:'Real API attempts; authored teaching examples remain separately in corpus.mjs.'};
  await atomicJson(resolve(outDir,'results.json'),result);
  for(const planned of experiment.runs){
    const reserved=reserveUsd(planned.request);
    if(!canReserve(ledger,reserved,experiment.budget_usd)){result.stopped_reason='budget_guard';break;}
    const row={run_id:planned.run_id,started_at:new Date().toISOString(),reserved_usd:reserved,state:'started'};
    ledger.push(row);await atomicJson(resolve(outDir,'ledger.json'),ledger);
    await atomicJson(resolve(outDir,planned.run_id+'.request.json'),planned);
    let body={},httpStatus=null,networkError=null;
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(planned.request),redirect:'error',signal:AbortSignal.timeout(120000)});
      httpStatus=response.status;
      const raw=redact(await response.text(),key);
      await writeFile(resolve(outDir,planned.run_id+'.response.json'),raw,{mode:0o600});
      try{body=JSON.parse(raw);}catch{networkError='invalid_json_response';}
    }catch(e){networkError=e?.name==='TimeoutError'?'timeout_unknown_billing':'transport_error_unknown_billing';}
    const record={...planned,started_at:row.started_at,ended_at:new Date().toISOString(),reserved_usd:reserved,retry_of:null,...observation(planned,body,httpStatus),network_error:networkError};
    result.runs.push(record);row.state='recorded';row.estimated_cost_usd=record.estimated_cost_usd;
    result.estimated_cost_usd=Number(result.runs.reduce((n,r)=>n+(r.estimated_cost_usd??0),0).toFixed(8));
    const technicalFailure=httpStatus!==200||Boolean(networkError)||Boolean(record.error);
    const budgetAnomaly=record.estimated_cost_usd!==null&&record.estimated_cost_usd>reserved;
    const modelChanged=record.returned_model&&record.returned_model!==experiment.model;
    if(technicalFailure||budgetAnomaly||modelChanged)result.stopped_reason=technicalFailure?'technical_failure':budgetAnomaly?'cost_exceeded_reservation':'returned_model_changed';
    await atomicJson(resolve(outDir,'ledger.json'),ledger);await atomicJson(resolve(outDir,'results.json'),result);
    console.log(JSON.stringify({order:planned.order,run_id:planned.run_id,http_status:httpStatus,complete:record.complete,error:record.error,network_error:networkError,estimated_cost_usd:record.estimated_cost_usd,total_estimated_cost_usd:result.estimated_cost_usd}));
    if(result.stopped_reason)break;
  }
  result.status=result.stopped_reason?'stopped':'collected';result.finished_at=new Date().toISOString();
  result.counts={planned:experiment.planned_count,attempted:result.runs.length,completed:result.runs.filter(r=>r.complete).length,failed:result.runs.filter(r=>r.http_status!==200||r.error||r.network_error).length,incomplete:result.runs.filter(r=>r.http_status===200&&!r.error&&!r.network_error&&!r.complete).length,not_attempted:experiment.planned_count-result.runs.length};
  result.reserved_usd=Number(ledger.reduce((n,r)=>n+r.reserved_usd,0).toFixed(6));
  await atomicJson(resolve(outDir,'results.json'),result);return {status:result.status,...result.counts,estimated_cost_usd:result.estimated_cost_usd,reserved_usd:result.reserved_usd};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const args=process.argv.slice(2);const value=name=>{const i=args.indexOf(name);return i===-1?undefined:args[i+1];};
    if(args.includes('--freeze')){const e=await freeze(resolve(value('--freeze')));console.log(JSON.stringify({planned:e.planned_count,reserved_max_usd:e.reserved_max_usd,frozen:true}));}
    else if(value('--experiment')&&value('--out'))console.log(JSON.stringify(await collect({experimentPath:resolve(value('--experiment')),outDir:resolve(value('--out')),keyFile:value('--key-file')?resolve(value('--key-file')):undefined,execute:args.includes('--execute')})));
    else throw new Error('Use --freeze FILE, or --experiment FILE --out PRIVATE_DIR [--key-file FILE] [--execute]. Dry run is the default.');
  }catch(e){console.error(redact(e.message,process.env.OPENAI_API_KEY??''));process.exitCode=1;}
}
