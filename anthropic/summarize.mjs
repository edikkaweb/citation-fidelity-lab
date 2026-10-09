import {readFile,writeFile} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import {resolve} from 'node:path';
import {summarize} from '../attached/summarize.mjs';import {validShape} from './collect.mjs';
const here=new URL('.',import.meta.url),get=async f=>JSON.parse(await readFile(new URL(f,here)));
export function compare(openai,anthropic){
 if(new Set(openai.runs.map(r=>r.run_id)).size!==openai.runs.length||new Set(anthropic.runs.map(r=>r.run_id)).size!==anthropic.runs.length)throw Error('Duplicate run ID');
 const usable=r=>r.complete&&validShape(r.parsed_output),oa=openai.runs.filter(usable),an=anthropic.runs.filter(usable);
 const oaById=new Map(oa.map(r=>[r.run_id,r]));const pairs=an.filter(r=>oaById.has(r.reference_run_id)).map(r=>({openai:oaById.get(r.reference_run_id),anthropic:r}));
 for(const p of pairs)for(const k of ['case_id','language','variant','mode','repetition','question','sentences'])if(JSON.stringify(p.openai[k])!==JSON.stringify(p.anthropic[k]))throw Error('Paired inputs differ');
 const dataset=(runs,counts,cost)=>({runs,counts,estimated_cost_usd:cost});
 const full={openai:summarize(openai),anthropic:summarize(anthropic)},paired={openai:summarize(dataset(pairs.map(p=>p.openai),{complete:pairs.length},null)),anthropic:summarize(dataset(pairs.map(p=>p.anthropic),{complete:pairs.length},null))};
 const disagreements=pairs.flatMap(p=>['F1','F2','F3','F4'].filter(id=>p.openai.parsed_output.conditions[id].availability!==p.anthropic.parsed_output.conditions[id].availability).map(id=>({reference_run_id:p.openai.run_id,condition_id:id,openai:p.openai.parsed_output.conditions[id].availability,anthropic:p.anthropic.parsed_output.conditions[id].availability})));
 return {schema_version:1,openai_experiment:openai.experiment_id,anthropic_experiment:anthropic.experiment_id,models:{openai:'gpt-6-astra',anthropic:'claude-sonnet-5-5'},all_valid_counts:{openai:oa.length,anthropic:an.length},paired_count:pairs.length,paired_condition_declaration_disagreements:disagreements.length,disagreements,all_valid:full,paired,semantic_fidelity_score:null,model_ranking:null};
}
const table=(c,paired=false)=>{const s=paired?c.paired:c.all_valid;return '| Model | Complete | Missing declared / absent | Available against coding | Missing against coding | Non-exact quotes | Sentence associations rejected |\n|---|---:|---:|---:|---:|---:|---:|\n'+['openai','anthropic'].map(k=>{const t=s[k].totals;return `| ${c.models[k]} | ${paired?c.paired_count:c.all_valid_counts[k]} | ${t.correct_unavailable}/${t.absent_opportunities} | ${t.false_available} | ${t.false_unavailable}/${t.available_opportunities} | ${t.non_exact_quotes}/${t.declared_available} | ${t.association_mismatches}/${t.declared_available} |`;}).join('\n');};
export async function build(){const oa=await get('../attached/results.json'),an=await get('results.json');if(an.status==='collecting')throw Error('Collection not finished');const c=compare(oa,an);await writeFile(new URL('summary.json',here),JSON.stringify(c,null,2)+'\n');
 const a=c.all_valid.anthropic.totals,p=c.paired,report=`# Claude / OpenAI · same inputs, separate series

[Interactive comparison](index.html) · [Frozen protocol](PROTOCOL.md) · [Plan and hashes](experiment.json) · [Transport continuation](CONTINUATION.md) · [Claude records](results.json) · [Calculated comparison](summary.json) · [Original OpenAI series](../attached/REPORT.md)

## Français

**Claude Sonnet 5.5 : ${c.all_valid_counts.anthropic} réponses complètes sur 108 prévues ; ${a.correct_unavailable}/${a.absent_opportunities} absences déclarées conformément au codage.** GPT-6 Astra avait ${c.all_valid_counts.openai} réponses complètes ; les deux séries partagent ${c.paired_count} entrées/répétitions complètes appariables.

Les mêmes questions, phrases, catégories neutres, schéma JSON, ordre et règles de mesure ont été conservés. Seul l’adaptateur fournisseur et ses paramètres changent. L’effort medium, les tokeniseurs et les sorties contraintes ne sont pas équivalents par définition. Cette réplication teste deux modèles configurés, pas deux marques entières ni leurs interfaces grand public.

### Toutes les réponses valides · dénominateurs propres à chaque série

${table(c)}

### Sous-ensemble apparié · ${c.paired_count} entrées communes

${table(c,true)}

${c.paired_condition_declaration_disagreements} déclarations de disponibilité diffèrent entre modèles sur ${c.paired_count*4} comparaisons de catégories appariées. Ce sont des écarts au diagnostic structuré, pas un score de fidélité sémantique ni un classement.

**Ce que la récupération permet de dire.** Avant toute génération, C fournit 4/4 conditions pour le prix et le délai, mais 1/4 pour l’hébergement ; le témoin complet fournit 4/4 dans les trois cas. Ces comptes sont nécessairement identiques pour les deux fournisseurs, puisqu’ils reçoivent les mêmes phrases. Ils ne constituent pas une nouvelle preuve indépendante de l’efficacité de C. La longueur et la répétition changent aussi, et le découpeur garde les phrases entières.

**Lire les écarts.** Une catégorie peut être déclarée disponible à partir d’une phrase voisine parce que les catégories se recoupent. Un extrait peut être exact sans être associé à cette catégorie dans le codage. Aucun de ces constats ne prouve à lui seul une hallucination. Le diagnostic est demandé explicitement ; il ne mesure pas le signalement spontané des absences. Toutes les réponses, y compris défavorables, sont conservées.

**Collecte Claude :** ${an.counts.attempted} tentés, ${an.counts.complete} complets, ${an.counts.failed} échecs, ${an.counts.incomplete} incomplets, ${an.counts.unattempted} non tentés. Coût estimé à partir des usages : **${an.estimated_cost_usd} USD HT**, plus ${an.unsettled_reserved_usd} USD réservés pour usage incertain ; plafond 2 USD. Ce n’est pas une facture. La collecte initiale a été interrompue au transport ; un plan distinct a repris les 30 essais non tentés, sans rejouer l’échec. Motif d’arrêt de la continuation : ${an.stopped_reason??'aucun'}. Aucun achat supplémentaire ; aucun nouvel appel OpenAI.

**Limites :** trois cas pédagogiques FR/EN, trois répétitions, un modèle par fournisseur, absence de corpus indépendant et aucun test de citation web. Le protocole a été figé localement avant la collecte ; sa publication préalable a été bloquée par le contrôle d’autorisation. Il ne s’agit donc pas d’un préenregistrement public. L’historique reste intact.

## English

**Claude Sonnet 5.5: ${c.all_valid_counts.anthropic}/108 complete responses; ${a.correct_unavailable}/${a.absent_opportunities} absent condition opportunities correctly declared under the prespecified coding.** GPT-6 Astra had ${c.all_valid_counts.openai} complete responses; ${c.paired_count} matched input/repetition pairs are available. The two tables above report all valid responses and the matched subset separately.

Questions, sentences, neutral categories, JSON schema, run order and measurement rules are identical. Provider adapters differ. Medium effort, tokenizers and constrained outputs are not guaranteed equivalent. This is a comparison of two configured models, not provider-wide capabilities or consumer interfaces.

There are ${c.paired_condition_declaration_disagreements} different availability declarations out of ${c.paired_count*4} paired condition comparisons. They are structured-diagnostic differences, not a semantic-fidelity score or model ranking. An exact quote can fail the prespecified sentence/category association. Categories overlap; a coding discrepancy alone does not establish hallucination. Missing-information diagnostics are explicitly requested, not spontaneous.

C supplies 4/4 conditions for price and duration and 1/4 for hosting under the frozen retrieval setting. These upstream counts are mechanically the same for both providers, not independent confirmation of a GEO writing rule. The full-text control supplies 4/4. C changes redundancy and length; the splitter keeps sentences indivisible.

Claude: ${an.counts.attempted} attempted, ${an.counts.complete} complete, ${an.counts.failed} failed, ${an.counts.incomplete} incomplete, ${an.counts.unattempted} unattempted. Estimated usage cost USD ${an.estimated_cost_usd} before tax, unresolved reserve USD ${an.unsettled_reserved_usd}, cap USD 2; not an invoice. No new OpenAI calls or automatic retries. The protocol was frozen locally before generation; public preregistration was blocked by authorization review. Three authored cases, two languages, three repetitions, one model per provider; no independent corpus or observed web-citation uplift.

## Reproduce without API calls

Run \`node anthropic/summarize.mjs\` from the repository root. Historical files are hash-checked in \`experiment.json\`; the same exported measurement function is used for both series. Never rerun a collector against an existing output directory. Visitors need no API key.
`;
 await writeFile(new URL('REPORT.md',here),report);return {paired:c.paired_count,claude_complete:an.counts.complete,cost:an.estimated_cost_usd,totals:a};}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await build()));
