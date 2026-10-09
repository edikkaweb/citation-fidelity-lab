export const normalize=s=>String(s??'').replace(/\s+/g,' ').trim();
export function inspect(parsed,sentences){
 const ids=['F1','F2','F3','F4'];
 if(!parsed||typeof parsed.answer!=='string'||!parsed.conditions||!Array.isArray(parsed.conditions_not_available)||ids.some(id=>!parsed.conditions[id]))return {valid_shape:false,conditions:[]};
 const truth=new Set(sentences.flatMap(s=>s.condition_ids));
 const rows=ids.map(id=>{const d=parsed.conditions[id],s=sentences.find(s=>s.sentence_id===d.sentence_id),quote=normalize(d.quote),valid=Boolean(s&&s.condition_ids.includes(id)&&quote.length>=16&&normalize(s.text).includes(quote)),absent=!truth.has(id),saidMissing=d.availability==='not_available';return {condition_id:id,provided:!absent,declared:d.availability,listed_unavailable:parsed.conditions_not_available.includes(id),declaration_consistent:parsed.conditions_not_available.includes(id)===saidMissing,correct_unavailable:absent&&saidMissing,false_available:absent&&!saidMissing,false_unavailable:!absent&&saidMissing,exact_supplied_evidence:valid,sentence_id:d.sentence_id,quote:d.quote};});
 return {valid_shape:rows.every(r=>['available','not_available'].includes(r.declared))&&new Set(parsed.conditions_not_available).size===parsed.conditions_not_available.length&&parsed.conditions_not_available.every(id=>ids.includes(id)),conditions:rows};
}
