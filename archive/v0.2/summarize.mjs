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
for(const c of cases)for(const lang of ['fr','en']){
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
let md=`# Collected results / Résultats collectés — 2026-10-08\n\nRelease 0.2 · corpus/checker 0.1 frozen · GPT-6 Astra · supplied text, no tools.\n\n## Français\n\n**${data.counts.attempted} appels tentés, ${data.counts.completed} réponses complètes, ${data.counts.failed} échecs et ${data.counts.incomplete} réponses incomplètes.** Trois cas × deux variantes × deux langues × trois répétitions, un seul modèle. Coût estimé à partir des consommations retournées : **${data.estimated_cost_usd.toFixed(5)} USD hors taxes**, pour un plafond autorisé de 10 USD. Il s'agit d'un calcul, pas d'une facture.\n\nCette série ne démontre aucun gain général de fidélité ni de citation. Les trois répétitions par condition ne permettent pas d'estimer un taux stable. Les réponses proviennent de l'API OpenAI, pas de l'interface ChatGPT. Aucune recherche web ni découverte spontanée de page n'a été testée. La comparaison avec un second fournisseur reste à réaliser.\n\nDeux limites du dispositif sont visibles dans les traces :\n\n- **La détection manque des reformulations.** Dans le premier essai tarifaire FR, la réponse écrit « en exclut » et « limité à trois gabarits » ; les expressions figées du contrôleur ne les reconnaissent pas. Les statuts « non détecté » ne constituent donc pas des erreurs sémantiques établies. Les règles n'ont pas été ajustées après collecte.\n- **Des phrases identiques peuvent changer de référent lorsqu'on les déplace.** Dans le cas du délai, la variante A place « Cette catégorie » / « This category » après la catégorie B2B complète, alors que B la rattache à la refonte ciblée. Le premier essai FR A signale cette ambiguïté. L'expérience ne peut donc pas isoler un simple effet de mise en forme : la résolution du renvoi est un facteur de confusion. Le corpus original reste conservé ; une version ultérieure devra rendre ces phrases autonomes et faire l'objet d'une nouvelle collecte distincte.\n\nLes tableaux rapportent des expressions détectées, pas la vérité d'une réponse. Les quatre statuts sont conservés, sans score global. Une contradiction potentiellement niée ou citée reste indéterminée. Aucun jugement humain n'est requis pour reproduire ces contrôles ; leur portée reste limitée.\n\n## English\n\n**${data.counts.attempted} attempted calls, ${data.counts.completed} complete answers, ${data.counts.failed} failures and ${data.counts.incomplete} incomplete answers.** Three cases × two variants × two languages × three repetitions, one model. Estimated cost from returned usage: **USD ${data.estimated_cost_usd.toFixed(5)} before tax**, within the authorised USD 10 ceiling. This calculation is not a billing receipt.\n\nThis series establishes no general fidelity or citation benefit. Three repetitions per condition do not establish stable rates. These are OpenAI API outputs, not observations of the ChatGPT interface. No web retrieval or spontaneous discovery was tested. The second-provider comparison remains uncollected.\n\nThe traces expose two limitations. First, the frozen checker misses valid-looking paraphrases: the first French price answer uses “en exclut” and “limité à trois gabarits”, which its patterns do not recognise. Non-detection is not an established semantic error; rules were not tuned after collection. Second, rearranging identical sentences can change a pronoun's referent. In time variant A, “This category” follows the complete B2B category, while B places it after targeted redesign. The first French A answer flags this ambiguity. The experiment therefore cannot isolate formatting alone. A future corpus must use self-contained sentences and be collected separately; this original corpus is preserved.\n\nCounts below describe detected expressions, not answer truth. All four outcomes remain visible, with no overall score. Potentially negated or quoted conflicts remain indeterminate. No human judging is required to reproduce these checks; their limitations remain explicit.\n\n## Records / Traces\n\n[Every prompt and answer](results.json) · [Frozen plan and fingerprints](experiment.json) · [Machine-readable counts](summary.json) · [Bilingual protocol](PROTOCOL.md) · [Collector](collect.mjs) · [Recompute this report](summarize.mjs)\n\nA = distributed / dispersé ; B = grouped / rapproché.\n\nEach cell: **detected / non-detected / conflict / indeterminate**. Denominator: 3 attempted and complete answers for each cell in this collection. These counts must not be combined into a fidelity percentage.\n\nChaque cellule : **détecté / non détecté / contradiction / indéterminé**. Dénominateur : 3 réponses tentées et complètes pour chaque cellule de cette collecte. Ne pas agréger en pourcentage de fidélité.\n`;
for(const g of groups){
  md+=`\n### ${g.title} · ${g.language.toUpperCase()}\n\n| Condition | A · n=3 | B · n=3 |\n| --- | --- | --- |\n`;
  for(const c of g.controls){const cell=v=>{const n=c.variants[v].counts;return [n.present,n.not_detected,n.conflict,n.indeterminate].join(' / ');};md+=`| ${c.label} | ${cell('distributed')} | ${cell('grouped')} |\n`;}
}
md+=`\n## Integrity / Intégrité\n\nResults SHA-256: \`${summary.results_sha256}\`. Run \`node summarize.mjs\` to verify recorded prompts and recompute indicators and counts without any API call. The checker and corpus used for this series are pinned in \`experiment.json\`; results must not be silently re-scored after rule changes.\n`;
await writeFile(new URL('RESULTS.md',dir),md);
console.log(JSON.stringify({verified_records:data.runs.length,groups:groups.length,estimated_cost_usd:data.estimated_cost_usd}));
