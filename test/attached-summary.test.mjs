import test from 'node:test';import assert from 'node:assert/strict';import {summarize} from '../attached/summarize.mjs';import {makePlan} from '../attached/collect.mjs';
test('Failed runs do not enter absence denominators; adverse C retrieval remains visible',()=>{
 const p=makePlan().find(r=>r.case_id==='price'&&r.language==='fr'&&r.variant==='distributed'&&r.mode==='retrieved'),truth=new Set(p.provided_condition_ids);
 const conditions=Object.fromEntries(['F1','F2','F3','F4'].map(id=>{const s=p.sentences.find(s=>s.condition_ids.includes(id));return [id,{availability:s?'available':'not_available',sentence_id:s?.sentence_id??'',quote:s?.text??''}]}));
 const parsed={answer:'test',conditions_not_available:['F1','F2','F3','F4'].filter(id=>!truth.has(id)),conditions};
 const d={runs:[{...p,complete:true,parsed_output:parsed},{...p,run_id:'failed',complete:false,parsed_output:parsed}]},s=summarize(d);
 assert.equal(s.totals.absent_opportunities,2);assert.equal(s.totals.correct_unavailable,2);assert.equal(s.totals.invalid_available_evidence,0);assert.equal(s.groups.find(g=>g.case_id==='hosting'&&g.language==='fr'&&g.variant==='attached'&&g.mode==='retrieved').provided_condition_ids.length,1);assert.equal(s.sensitivity.length,72);
});
