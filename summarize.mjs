// Recompute every published indicator from the unmodified collected answers.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {check} from './checker.mjs';
import {cases} from './corpus.mjs';
const dir=new URL('.',import.meta.url);
const bytes=await readFile(new URL('results.json',dir));
const data=JSON.parse(bytes),experiment=JSON.parse(await readFile(new URL('experiment.json',dir)));
for(const r of data.runs){
  assert.deepEqual(r.findings,check({caseId:r.case_id,lang:r.language,text:r.answer,complete:r.complete}));
  assert.deepEqual(r.request,experiment.runs.find(p=>p.run_id===r.run_id).request);
}
const groups=[];
for(const c of cases.filter(c=>experiment.cases.includes(c.id)))for(const lang of ['fr','en']){
  const rows=data.runs.filter(r=>r.case_id===c.id&&r.language===lang);
  const controls=check({caseId:c.id,lang,text:'',complete:false}).controls.map(rule=>{
    const variants={};
    for(const v of ['distributed','grouped']){
      const subset=rows.filter(r=>r.variant===v);
      const counts={present:0,not_detected:0,conflict:0,indeterminate:0};
      subset.forEach(r=>counts[r.findings.controls.find(x=>x.id===rule.id).status]++);
      variants[v]={attempted:subset.length,complete:subset.filter(r=>r.complete).length,counts};
    }
    return {id:rule.id,label:rule.label,variants};
  });
  groups.push({case_id:c.id,language:lang,title:c.title[lang],controls});
}
const summary={schema_version:1,experiment_id:data.experiment_id,results_sha256:createHash('sha256').update(bytes).digest('hex'),counts:data.counts,estimated_cost_usd:data.estimated_cost_usd,semantic_fidelity:'not_certified',groups};
await writeFile(new URL('summary.json',dir),JSON.stringify(summary,null,2)+'\n');
let md=`# Duration follow-up / Nouvelle série délai — 2026-10-08

Release 0.3 · corpus 0.2 · unchanged checker 0.1 · GPT-6 Astra · supplied text, no tools.

## Français

**${data.counts.attempted} nouveaux appels, ${data.counts.completed} réponses complètes, ${data.counts.failed} échecs, ${data.counts.incomplete} réponses incomplètes.** Deux variantes × deux langues × trois répétitions, délai uniquement. Le renvoi « Cette catégorie » est remplacé par « La refonte ciblée » ; aucun autre fait n’a été changé. Les contrôles restent identiques.

Coût calculé de cette série : **${data.estimated_cost_usd.toFixed(5)} USD HT**. Coût cumulé avec la série initiale : **${data.cumulative_estimated_cost_usd.toFixed(5)} USD HT**, pour un plafond de 10 USD. Ces calculs reposent sur les consommations retournées ; ce ne sont pas des factures.

Les [36 essais initiaux et leur rapport](archive/v0.2/RESULTS.md) restent intacts, y compris les 12 essais de délai ambigus. Ils ne sont pas fusionnés avec les nouveaux essais. Le sélecteur principal conserve les 24 réponses initiales de prix/hébergement et présente les 12 nouvelles réponses du délai, avec leur provenance exportable. L’[ancienne interface](archive/v0.2/) permet de revoir la totalité de la première série.

Les expressions reconnues sont présentées ci-dessous, sans score global. Les règles manquent des reformulations valides ; une non-détection ne constitue pas une erreur sémantique établie. La correction retire un renvoi ambigu identifié ; elle ne prouve pas à elle seule la fidélité de toutes les réponses. Aucun résultat avant/après causal n’est revendiqué, puisque le texte a changé. Trois répétitions par condition ne permettent pas une généralisation. Aucun jury ou contrôle humain obligatoire.

## English

**${data.counts.attempted} new calls, ${data.counts.completed} complete answers, ${data.counts.failed} failures, ${data.counts.incomplete} incomplete answers.** Duration only: two variants × two languages × three repetitions. “This category” was replaced with “A targeted redesign”; all other facts and the checker remain unchanged.

Calculated follow-up cost: **USD ${data.estimated_cost_usd.toFixed(5)} before tax**. Cumulative calculated cost: **USD ${data.cumulative_estimated_cost_usd.toFixed(5)} before tax**, within the USD 10 ceiling. Returned usage supports these calculations; they are not billing receipts.

The [original 36 attempts and report](archive/v0.2/RESULTS.md), including the ambiguous duration case, remain intact and separate. The main selector combines the original 24 price/hosting answers with the 12 new duration answers for inspection, with explicit exported provenance. It does not pool their statistics. The [archived interface](archive/v0.2/) retains every first-series answer.

Counts describe recognised expressions, not overall meaning. Missed paraphrases remain a limitation; non-detection is not an established semantic error. Removing the identified ambiguous reference does not certify every answer. There is no causal before/after claim because the source changed; three repetitions per condition cannot establish stable rates. No required human judging.

## Observed detector limitations / Limites constatées

Four English answers contain the duration as “4-to-7-week” or “4–7-week”; the unchanged rule expects a different spelling and marks it non-detected. One French answer explicitly negates a guarantee but triggers the conservative indeterminate state. These are visible limitations of the indicator code, not evidence that the model omitted the duration or promised delivery. The original strings remain available for inspection; rules were not tuned after collection.

Quatre réponses EN écrivent la durée sous la forme « 4-to-7-week » ou « 4–7-week », non reconnue par la règle figée. Une réponse FR nie explicitement une garantie et déclenche le statut prudent indéterminé. Ces limites du code ne prouvent ni une omission du délai ni une promesse du modèle. Les chaînes originales sont consultables ; les règles n’ont pas été ajustées après collecte.

## Scope / Portée

One model and provider only. API outputs are not consumer-interface observations. No web search, URL retrieval, spontaneous discovery or real citation lift was tested. No general formatting or fidelity benefit is established. The two-provider comparison remains outside this collection.

Un seul fournisseur et modèle. L’API ne représente pas l’interface ChatGPT. Ni recherche web, ni accès à une URL, ni découverte spontanée, ni hausse de citation mesurée. Aucun bénéfice général de mise en forme ou de fidélité établi. La comparaison entre fournisseurs reste distincte.

## Records / Traces

[12 new prompts and answers](results.json) · [Frozen plan](experiment.json) · [Counts](summary.json) · [Protocol](PROTOCOL.md) · [Collector](collect.mjs) · [Recompute](summarize.mjs) · [36 original records](archive/v0.2/results.json)

A = distributed / dispersé ; B = grouped / rapproché.

Each cell: **detected / non-detected / conflict / indeterminate**. Three attempted and complete answers per cell. No combined fidelity percentage.

Chaque cellule : **détecté / non détecté / contradiction / indéterminé**. Trois réponses tentées et complètes par cellule. Aucun pourcentage global de fidélité.
`;
for(const g of groups){
  md+=`\n### ${g.title} · ${g.language.toUpperCase()}\n\n| Condition | A · n=3 | B · n=3 |\n| --- | --- | --- |\n`;
  for(const c of g.controls){const cell=v=>{const n=c.variants[v].counts;return [n.present,n.not_detected,n.conflict,n.indeterminate].join(' / ');};md+=`| ${c.label} | ${cell('distributed')} | ${cell('grouped')} |\n`;}
}
md+=`\n## Integrity / Intégrité\n\nResults SHA-256: \`${summary.results_sha256}\`. Run \`node summarize.mjs\` to verify recorded prompts and recompute indicators and counts without any API call. The checker and corpus used for this series are pinned in \`experiment.json\`; results must not be silently re-scored after rule changes.\n`;
await writeFile(new URL('RESULTS.md',dir),md);
console.log(JSON.stringify({verified_records:data.runs.length,groups:groups.length,estimated_cost_usd:data.estimated_cost_usd}));
