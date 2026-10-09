import {rankChunks} from '../retrieval/retrieve.mjs';
export function splitSentences(text,lang='fr'){
 if(typeof text!=='string'||text.length>30000)throw new Error('text_limit');
 const segments=[...new Intl.Segmenter(lang,{granularity:'sentence'}).segment(text)].flatMap(x=>x.segment.split(/\n+/)).map(x=>x.trim()).filter(Boolean);
 if(segments.length>200)throw new Error('sentence_limit');return segments;
}
const norm=s=>s.normalize('NFC').replace(/\s+/g,' ').trim();
export function inspectText({text,question,watch=[],lang='fr',size=3,topK=1}){
 if(![2,3].includes(size)||![1,2].includes(topK)||question.length>1000||!question.trim()||watch.length>20||watch.some(x=>x.length>300))throw new Error('input_limit');
 const sentences=splitSentences(text,lang);if(!sentences.length)throw new Error('empty');
 const chunks=[];for(let i=0;i<sentences.length;i+=size)chunks.push({chunk_id:'C'+(chunks.length+1),offset:i,facts:sentences.slice(i,i+size).map((text,j)=>({fact_id:'S'+(i+j+1),text}))});
 const ranked=rankChunks(chunks,question),selected=ranked.slice(0,topK).sort((a,b)=>a.offset-b.offset),selectedIds=new Set(selected.map(x=>x.chunk_id));
 const checks=watch.map(expression=>{const value=norm(expression);const inSource=norm(text).includes(value),inSelected=selected.some(c=>norm(c.facts.map(f=>f.text).join(' ')).includes(value));return {expression,status:!inSource?'not_in_source':inSelected?'retained':'outside_selected'};});
 return {schema_version:1,mode:'local_exact_expression_tracking',retriever:'frozen lexical v1.0.0',segmentation:'Intl.Segmenter sentence + line breaks; browser runtime dependent',lang,question,text,size,top_k:topK,sentences:sentences.length,ranked:ranked.map(c=>({...c,selected:selectedIds.has(c.chunk_id)})),checks,limits:'Exact expressions identified by the reader, not semantic condition detection, model response fidelity or Google retrieval.'};
}
