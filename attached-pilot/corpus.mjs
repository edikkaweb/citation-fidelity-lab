import {cases as originals} from '../corpus.mjs';
import {retrieve,conditions} from '../retrieval/retrieve.mjs';
export {conditions};
const joined={
 price:{fr:'Selon la politique Edikka du 20 août 2026, une refonte ciblée coûte de 5 000 à 9 999 € HT pour un parcours, une landing page stratégique ou un petit site de trois gabarits au maximum avec contenus disponibles, hors multilingue et intégration métier spécifique ; cette fourchette ne constitue ni une moyenne du marché français ni un devis automatique.',en:'Under Edikka’s pricing policy dated 20 August 2026, a targeted redesign costs EUR 5,000–9,999 excluding VAT for a journey, a strategic landing page or a small site of up to three templates with available content, excluding multilingual work and bespoke business integration; this range is neither a French market average nor an automatic quotation.'},
 time:{fr:'Edikka indique 4 à 7 semaines pour une refonte ciblée d’un parcours, d’une landing page ou d’un petit site de trois gabarits au maximum avec contenus disponibles, contre 8 à 12 semaines pour la catégorie distincte des refontes B2B complètes ; ces durées restent indicatives et le calendrier engageant dépend de la proposition signée et de son périmètre.',en:'Edikka indicates 4 to 7 weeks for a targeted redesign of a journey, a landing page or a small site of up to three templates with available content, versus 8 to 12 weeks for the separate category of complete B2B redesigns; these durations are indicative and the binding schedule depends on the signed proposal and its scope.'},
 hosting:{fr:'GitHub Docs décrit GitHub Pages comme un hébergement statique de fichiers HTML, CSS et JavaScript issus d’un dépôt GitHub, éventuellement préparés par un processus de construction avant publication ; la page citée ne documente pas l’exécution d’un serveur PHP par ce service.',en:'GitHub Docs describes GitHub Pages as static hosting of HTML, CSS and JavaScript files from a GitHub repository, optionally prepared by a build process before publication; the cited page does not document this service running a PHP server.'}
};
// Prespecified edits: numeric sentences in price/time and the principal hosting claim.
// Intentional repetition is a confound: this is not an order-only intervention.
export const editedIndexes={price:[0,1],time:[0,1,2],hosting:[0]};
export const cases=originals.map(c=>({...c,order:{...c.order,attached:[...c.order.grouped]},attached:Object.fromEntries(['fr','en'].map(lang=>[lang,c.facts[lang].map((text,i)=>editedIndexes[c.id].includes(i)?joined[c.id][lang]:text)]))}));
export function supplied(c,lang,variant,mode='retrieved',settings={size:3,topK:1}){
 const model=variant==='attached'?{...c,facts:c.attached}:c;
 const result=retrieve(model,lang,variant,settings);
 const selected=mode==='full'?model.order[variant].map(i=>({fact_id:`F${i+1}`,text:model.facts[lang][i]})):result.facts;
 const sentences=selected.map(f=>({sentence_id:f.fact_id.replace('F','S'),text:f.text,condition_ids:variant==='attached'&&editedIndexes[c.id].includes(Number(f.fact_id.slice(1))-1)?['F1','F2','F3','F4']:(Number(f.fact_id.slice(1))<=4?[f.fact_id]:[])}));
 return {sentences,provided_condition_ids:[...new Set(sentences.flatMap(s=>s.condition_ids))].sort(),retrieval:mode==='retrieved'?result:null};
}
