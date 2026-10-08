import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {cases} from '../corpus.mjs';
import {chunksFor,rankChunks,retrieve,inspectEvidence,retrievalMatrix} from '../retrieval/retrieve.mjs';
import {makePlan,freeze,collect,observe,priorSpentUsd,budgetUsd} from '../retrieval/collect.mjs';
import {reserveUsd} from '../collect.mjs';

test('every chunk preserves exact sentence provenance, with no lost or added fact',()=>{
 for(const c of cases)for(const lang of ['fr','en'])for(const variant of ['distributed','grouped'])for(const size of [2,3]){
  const chunks=chunksFor(c,lang,variant,size);assert.deepEqual(chunks.flatMap(c=>c.facts.map(f=>f.text)),c.order[variant].map(i=>c.facts[lang][i]));assert.equal(new Set(chunks.flatMap(c=>c.facts.map(f=>f.fact_id))).size,6);
 }
});
test('ranking follows the question, normalizes accents and resolves ties by source order',()=>{
 const c=[{offset:0,facts:[{text:'a rose'}]},{offset:3,facts:[{text:'durée garantie'}]}];assert.equal(rankChunks(c,'Duree')[0].offset,3);assert.equal(rankChunks(c,'unknown')[0].offset,0);
});
test('top-k retrieval does not leak unselected facts',()=>{
 for(const c of cases)for(const lang of ['fr','en'])for(const v of ['distributed','grouped']){const r=retrieve(c,lang,v);assert.equal(r.facts.length,3);assert.deepEqual(r.facts,r.ranked[0].facts);}
});
test('all sensitivity settings and paired full-text controls are present',()=>{
 assert.equal(retrievalMatrix().length,48);const p=makePlan();assert.equal(p.length,72);assert.equal(new Set(p.map(r=>r.run_id)).size,72);
 for(const r of p){assert.equal(r.source_facts.length,r.mode==='full'?6:3);assert.deepEqual(r.request.tools,[]);assert.equal(r.request.store,false);}
 assert.ok(p.reduce((s,r)=>s+reserveUsd(r.request),0)+priorSpentUsd<=budgetUsd);
});
test('an invented or unavailable citation fails, while a verbatim provided excerpt passes',()=>{
 const facts=[{fact_id:'F1',text:'This exact sentence supplies a documented condition.'}];
 assert.deepEqual(inspectEvidence({answer:'A claim',evidence:[{fact_id:'F1',quote:facts[0].text}]},facts).valid_cited_fact_ids,['F1']);
 assert.equal(inspectEvidence({answer:'A claim',evidence:[{fact_id:'F2',quote:facts[0].text},{fact_id:'F1',quote:'This is an invented quotation.'}]},facts).invalid_quote_count,2);
 assert.equal(inspectEvidence(null,facts).valid_json_shape,false);
});
test('incomplete output and invalid JSON stay distinguishable from a valid grounded answer',()=>{
 const run=makePlan()[0],body={model:'gpt-6-astra',status:'incomplete',output:[{type:'message',status:'incomplete',content:[{type:'output_text',text:'{'}]}]};const r=observe(run,body,200);assert.equal(r.complete,false);assert.equal(r.evidence_checks.valid_json_shape,false);
});
test('dry run has no credential or network dependency; a failed call stops and the lock prevents rebilling',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'citation-retrieval-test-'));try{
  const plan=join(dir,'experiment.json');await freeze(plan);let called=0;
  const dry=await collect({experimentPath:plan,outDir:join(dir,'absent'),keyFile:join(dir,'missing'),fetchImpl:()=>{called++;throw new Error('Network forbidden');}});assert.equal(dry.network_calls,0);assert.equal(called,0);
  const key=join(dir,'test.env');await writeFile(key,'OPENAI_API_KEY=test-value-not-a-real-key\n');
  const args={experimentPath:plan,outDir:join(dir,'out'),keyFile:key,execute:true,fetchImpl:async()=>{called++;return {status:401,text:async()=>JSON.stringify({error:{type:'authentication_error',code:'invalid_api_key'}})}}};
  const result=await collect(args);assert.equal(called,1);assert.equal(result.failed,1);assert.equal(result.not_attempted,71);await assert.rejects(collect(args),/EEXIST/);assert.equal(called,1);
  const recorded=JSON.parse(await readFile(join(dir,'out/results.json')));assert.equal(recorded.runs.length,1);assert.equal(recorded.stopped_reason,'technical_failure');
 }finally{await rm(dir,{recursive:true,force:true});}
});
