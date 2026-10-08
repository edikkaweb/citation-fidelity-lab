import test from 'node:test';
import assert from 'node:assert/strict';
import {makePlan,reserveUsd,canReserve,usageCost,redact,observation} from '../collect.mjs';
import {collect,freeze} from '../collect.mjs';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const plan=makePlan();
test('36 balanced independent requests, no teaching answers or tools, price first',()=>{
  assert.equal(plan.length,36);assert.equal(new Set(plan.map(r=>r.run_id)).size,36);
  assert.ok(plan.slice(0,12).every(r=>r.case_id==='price'));
  for(const c of ['price','time','hosting'])for(const l of ['fr','en'])for(const v of ['distributed','grouped'])assert.equal(plan.filter(r=>r.case_id===c&&r.language===l&&r.variant===v).length,3);
  for(const r of plan){assert.deepEqual(r.request.tools,[]);assert.equal(r.request.store,false);assert.equal(r.request.previous_response_id,undefined);assert.equal(r.request.max_output_tokens,4000);assert.equal(r.request.service_tier,'default');assert.equal(r.request.input.includes('Meaning changed'),false);assert.equal(r.request.input.includes('Le prix est garanti.'),false);}
});
test('reservations include reasoning/output limit, cache writes, framing and fit USD 10',()=>{
  const total=plan.reduce((n,r)=>n+reserveUsd(r.request),0);assert.ok(total>7.56&&total<10);
  const ledger=plan.map(r=>({reserved_usd:reserveUsd(r.request)}));
  assert.equal(canReserve([{reserved_usd:9.9}],0.2,10),false);
  assert.equal(canReserve([{reserved_usd:9}],1,10),true);
  assert.equal(canReserve(ledger,10,10),false);assert.equal(canReserve([],NaN,10),false);
});
test('usage billing includes all output tokens and validates unknown usage',()=>{
  assert.equal(usageCost({input_tokens:1000,output_tokens:4000,input_tokens_details:{cached_tokens:0,cache_write_tokens:0}}),0.21);
  assert.equal(usageCost({input_tokens:1000,output_tokens:200,input_tokens_details:{cached_tokens:200,cache_write_tokens:300}}),0.01895);
  assert.equal(usageCost(null),null);assert.equal(usageCost({input_tokens:-1,output_tokens:2}),null);
});
test('secret redaction and safe public errors',()=>{
  assert.equal(redact('bad sk-proj-abcdefghijklmnop key'), 'bad [REDACTED] key');
  assert.equal(redact('bad MYSECRET key','MYSECRET'),'bad [REDACTED] key');
  const r=observation(plan[0],{error:{code:'invalid_api_key',type:'auth',message:'SECRET'}},401);
  assert.equal(JSON.stringify(r).includes('SECRET'),false);assert.ok(r.findings.controls.every(c=>c.status==='indeterminate'));
});
test('incomplete, empty and refused responses stay indeterminate',()=>{
  for(const body of [{status:'incomplete',output:[{type:'message',status:'incomplete',content:[{type:'output_text',text:'Edikka'}]}]},{status:'completed',output:[]},{status:'completed',output:[{type:'message',status:'completed',content:[{type:'refusal',refusal:'No'}]}]}]){
    const r=observation(plan[0],body,200);assert.equal(r.complete,false);assert.ok(r.findings.controls.every(c=>c.status==='indeterminate'));
  }
  const r=observation(plan[0],{status:'completed',output:[{type:'message',status:'completed',content:[{type:'output_text',text:'Edikka'}]}]},200);assert.equal(r.complete,true);assert.equal(r.findings.semantic_fidelity,'not_certified');
});
test('dry run never requests a key; first error stops; persistent lock prevents duplicate billing',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'citation-collector-test-'));
  const originalFetch=globalThis.fetch;let calls=0;
  const key='sk-proj-test-abcdefghijklmnop';
  try{
    const experimentPath=join(dir,'experiment.json'),outDir=join(dir,'private-results'),keyFile=join(dir,'.env');
    await freeze(experimentPath);await writeFile(keyFile,`OPENAI_API_KEY=${key}\n`);
    globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({error:{code:'invalid_api_key',type:'authentication_error',message:`Rejected ${key}`}}),{status:401});};
    const dry=await collect({experimentPath,outDir,keyFile:'/nonexistent'});assert.equal(dry.network_calls,0);assert.equal(calls,0);
    const result=await collect({experimentPath,outDir,keyFile,execute:true});assert.equal(calls,1);assert.equal(result.attempted,1);assert.equal(result.failed,1);assert.equal(result.not_attempted,35);
    const publicData=await readFile(join(outDir,'results.json'),'utf8');assert.equal(publicData.includes(key),false);
    const raw=await readFile(join(outDir,plan[0].run_id+'.response.json'),'utf8');assert.equal(raw.includes(key),false);
    await assert.rejects(collect({experimentPath,outDir,keyFile,execute:true}),e=>e.code==='EEXIST');assert.equal(calls,1);
    const changed=JSON.parse(await readFile(experimentPath));changed.hashes['corpus.json']='changed';await writeFile(experimentPath,JSON.stringify(changed));
    await assert.rejects(collect({experimentPath,outDir:join(dir,'second'),keyFile,execute:true}),/Frozen files changed/);assert.equal(calls,1);
  }finally{globalThis.fetch=originalFetch;await rm(dir,{recursive:true,force:true});}
});
