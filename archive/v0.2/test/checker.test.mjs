import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,passage} from '../corpus.mjs';
import {check} from '../checker.mjs';
const control=(result,id)=>result.controls.find(r=>r.id===id);

for(const c of cases)for(const lang of ['fr','en']){
  test(`${c.id}/${lang}: paired variants retain exactly the same facts`,()=>{
    const a=passage(c,lang,'distributed').split('\n\n').sort();
    const b=passage(c,lang,'grouped').split('\n\n').sort();
    assert.deepEqual(a,b);assert.equal(a.length,new Set(a).size);
  });
  test(`${c.id}/${lang}: authored careful answer never certifies fidelity`,()=>{
    const result=check({caseId:c.id,lang,text:c.examples[lang].careful});
    assert.equal(result.semantic_fidelity,'not_certified');
    assert.ok(result.controls.every(r=>r.status==='present'),JSON.stringify(result.controls));
    assert.equal(Object.hasOwn(result,'score'),false);
  });
  test(`${c.id}/${lang}: incomplete collection cannot become an absence or pass`,()=>{
    const result=check({caseId:c.id,lang,text:c.examples[lang].careful,complete:false});
    assert.ok(result.controls.every(r=>r.status==='indeterminate'&&r.evidence.length===0));
  });
}
test('a truncated price is not the expected range',()=>{
  const r=check({caseId:'price',text:'15 000 à 99 999 € HT'});
  assert.equal(control(r,'amount').status,'not_detected');
});
test('nonbreaking spaces and accents are supported',()=>{
  const r=check({caseId:'price',text:'Edikka : 5\u202f000 à 9\u00a0999 € HT, refonte ciblée.'});
  assert.equal(control(r,'amount').status,'present');
  assert.equal(control(r,'scope').status,'present');
});
test('explicit tax conflict is visible',()=>{
  assert.equal(control(check({caseId:'price',text:'Prix 5 000 à 9 999 € TTC.'}),'tax').status,'conflict');
});
test('excluding VAT does not prove multilingual work is excluded',()=>{
  const r=check({caseId:'price',lang:'en',text:'EUR 5,000 to 9,999 excluding VAT. Multilingual work is available.'});
  assert.equal(control(r,'multilingual').status,'not_detected');
  assert.equal(control(r,'integration').status,'not_detected');
});
test('quoted or negated conflicts remain indeterminate',()=>{
  for(const text of ['Ne pas écrire « 5 000 € TTC ».','This price is not including VAT.'])
    assert.equal(control(check({caseId:'price',text}),'tax').status,'indeterminate');
});
test('an unrecognised but potentially valid paraphrase is not an error',()=>{
  assert.equal(control(check({caseId:'time',text:'Le délai est purement estimatif.'}),'indicative').status,'not_detected');
});
test('empty input is indeterminate',()=>{
  assert.ok(check({caseId:'price',text:'  '}).controls.every(r=>r.status==='indeterminate'));
});
test('invalid or oversized inputs fail explicitly',()=>{
  for(const input of [{caseId:'missing',text:'x'},{caseId:'price',text:2},{caseId:'price',lang:'de',text:'x'},{caseId:'price',text:'x',complete:'false'}])assert.throws(()=>check(input),TypeError);
  assert.throws(()=>check({caseId:'price',text:'x'.repeat(24001)}),RangeError);
});
