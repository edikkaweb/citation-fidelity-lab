// Deterministic local retrieval simulation. This is not a search-engine emulator.
import {cases} from '../corpus.mjs';

export const retrievalVersion='1.0.0';
const stop=new Set('a an and are as at be by does for from in is it of on or that the this to with de des du en et est il la le les par pour que qui un une au aux dans ce cette ces elle elles ils ne pas se ses son sa the their its do can your from within toute tout every'.split(' '));
export function terms(text){return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').match(/[\p{L}\p{N}]+/gu)?.filter(t=>t.length>1&&!stop.has(t))??[];}
export function chunksFor(c,lang,variant,size=3){
 if(!['fr','en'].includes(lang)||!Object.hasOwn(c.order,variant)||![2,3].includes(size))throw new Error('Invalid retrieval setting');
 const ordered=c.order[variant].map(index=>({fact_id:`F${index+1}`,text:c.facts[lang][index]}));
 const chunks=[];for(let offset=0;offset<ordered.length;offset+=size)chunks.push({chunk_id:`C${chunks.length+1}`,offset,facts:ordered.slice(offset,offset+size)});
 return chunks;
}
export function rankChunks(chunks,query){
 const q=new Set(terms(query));
 return chunks.map(c=>{const words=terms(c.facts.map(f=>f.text).join(' ')),matches=[...q].filter(t=>words.includes(t));return {...c,matching_terms:matches,score:matches.length/Math.sqrt(Math.max(1,words.length))};}).sort((a,b)=>b.score-a.score||a.offset-b.offset);
}
export function retrieve(c,lang,variant,{size=3,topK=1}={}){
 if(![1,2].includes(topK))throw new Error('Unsupported topK');
 const ranked=rankChunks(chunksFor(c,lang,variant,size),c.question[lang]);
 const selected=ranked.slice(0,topK).sort((a,b)=>a.offset-b.offset);
 return {size,top_k:topK,ranked,selected_chunk_ids:selected.map(c=>c.chunk_id),facts:selected.flatMap(c=>c.facts)};
}
export const conditions={
 price:[['F1','Montant, offre et taxes','Amount, offer and tax'],['F2','Périmètre et contenus','Scope and content'],['F3','Exclusions','Exclusions'],['F4','Pas un devis automatique','Not an automatic quote']],
 time:[['F1','Durée indicative','Indicative duration'],['F2','Périmètre ciblé','Targeted scope'],['F3','Autre catégorie','Other category'],['F4','Calendrier engageant','Binding schedule']],
 hosting:[['F1','Service statique','Static hosting'],['F2','Types de fichiers','File types'],['F3','Construction préalable','Build step'],['F4','PHP non documenté','PHP not documented']]
};
export function inspectEvidence(parsed,provided){
 if(!parsed||typeof parsed.answer!=='string'||!Array.isArray(parsed.evidence))return {valid_json_shape:false,quotes:[],valid_cited_fact_ids:[],invalid_quote_count:null};
 const normal=s=>String(s).replace(/\s+/g,' ').trim();
 const quotes=parsed.evidence.map(e=>{const fact=provided.find(f=>f.fact_id===e.fact_id);const quote=normal(e.quote??'');return {fact_id:e.fact_id,quote:e.quote,provided:Boolean(fact),exact_substring:Boolean(fact&&quote.length>=16&&normal(fact.text).includes(quote))};});
 return {valid_json_shape:true,quotes,valid_cited_fact_ids:[...new Set(quotes.filter(q=>q.exact_substring).map(q=>q.fact_id))],invalid_quote_count:quotes.filter(q=>!q.exact_substring).length};
}
export function retrievalMatrix(){
 return cases.flatMap(c=>['fr','en'].flatMap(language=>['distributed','grouped'].flatMap(variant=>[2,3].flatMap(size=>[1,2].map(topK=>{
  const r=retrieve(c,language,variant,{size,topK});return {case_id:c.id,language,variant,...r,condition_availability:conditions[c.id].map(([id,fr,en])=>({fact_id:id,label:language==='fr'?fr:en,provided:r.facts.some(f=>f.fact_id===id)}))};
 })))));
}
