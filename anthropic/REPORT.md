# Claude / OpenAI · same inputs, separate series

[Interactive comparison](index.html) · [Frozen protocol](PROTOCOL.md) · [Plan and hashes](experiment.json) · [Transport continuation](CONTINUATION.md) · [Claude records](results.json) · [Calculated comparison](summary.json) · [Original OpenAI series](../attached/REPORT.md)

## Français

**Claude Sonnet 5.5 : 107 réponses complètes sur 108 prévues ; 79/84 absences déclarées conformément au codage.** GPT-6 Astra avait 107 réponses complètes ; les deux séries partagent 106 entrées/répétitions complètes appariables.

Les mêmes questions, phrases, catégories neutres, schéma JSON, ordre et règles de mesure ont été conservés. Seul l’adaptateur fournisseur et ses paramètres changent. L’effort medium, les tokeniseurs et les sorties contraintes ne sont pas équivalents par définition. Cette réplication teste deux modèles configurés, pas deux marques entières ni leurs interfaces grand public.

### Toutes les réponses valides · dénominateurs propres à chaque série

| Model | Complete | Missing declared / absent | Available against coding | Missing against coding | Non-exact quotes | Sentence associations rejected |
|---|---:|---:|---:|---:|---:|---:|
| gpt-6-astra | 107 | 74/83 | 9 | 10/345 | 0/344 | 9/344 |
| claude-sonnet-5-5 | 107 | 79/84 | 5 | 0/344 | 0/349 | 5/349 |

### Sous-ensemble apparié · 106 entrées communes

| Model | Complete | Missing declared / absent | Available against coding | Missing against coding | Non-exact quotes | Sentence associations rejected |
|---|---:|---:|---:|---:|---:|---:|
| gpt-6-astra | 106 | 74/83 | 9 | 9/341 | 0/341 | 9/341 |
| claude-sonnet-5-5 | 106 | 78/83 | 5 | 0/341 | 0/346 | 5/346 |

19 déclarations de disponibilité diffèrent entre modèles sur 424 comparaisons de catégories appariées. Ce sont des écarts au diagnostic structuré, pas un score de fidélité sémantique ni un classement.

**Ce que la récupération permet de dire.** Avant toute génération, C fournit 4/4 conditions pour le prix et le délai, mais 1/4 pour l’hébergement ; le témoin complet fournit 4/4 dans les trois cas. Ces comptes sont nécessairement identiques pour les deux fournisseurs, puisqu’ils reçoivent les mêmes phrases. Ils ne constituent pas une nouvelle preuve indépendante de l’efficacité de C. La longueur et la répétition changent aussi, et le découpeur garde les phrases entières.

**Lire les écarts.** Une catégorie peut être déclarée disponible à partir d’une phrase voisine parce que les catégories se recoupent. Un extrait peut être exact sans être associé à cette catégorie dans le codage. Aucun de ces constats ne prouve à lui seul une hallucination. Le diagnostic est demandé explicitement ; il ne mesure pas le signalement spontané des absences. Toutes les réponses, y compris défavorables, sont conservées.

**Collecte Claude :** 108 tentés, 107 complets, 1 échecs, 0 incomplets, 0 non tentés. Coût estimé à partir des usages : **0.718656 USD HT**, plus 0.032428 USD réservés pour usage incertain ; plafond 2 USD. Ce n’est pas une facture. La collecte initiale a été interrompue au transport ; un plan distinct a repris les 30 essais non tentés, sans rejouer l’échec. Motif d’arrêt de la continuation : aucun. Aucun achat supplémentaire ; aucun nouvel appel OpenAI.

**Limites :** trois cas pédagogiques FR/EN, trois répétitions, un modèle par fournisseur, absence de corpus indépendant et aucun test de citation web. Le protocole a été figé localement avant la collecte ; sa publication préalable a été bloquée par le contrôle d’autorisation. Il ne s’agit donc pas d’un préenregistrement public. L’historique reste intact.

## English

**Claude Sonnet 5.5: 107/108 complete responses; 79/84 absent condition opportunities correctly declared under the prespecified coding.** GPT-6 Astra had 107 complete responses; 106 matched input/repetition pairs are available. The two tables above report all valid responses and the matched subset separately.

Questions, sentences, neutral categories, JSON schema, run order and measurement rules are identical. Provider adapters differ. Medium effort, tokenizers and constrained outputs are not guaranteed equivalent. This is a comparison of two configured models, not provider-wide capabilities or consumer interfaces.

There are 19 different availability declarations out of 424 paired condition comparisons. They are structured-diagnostic differences, not a semantic-fidelity score or model ranking. An exact quote can fail the prespecified sentence/category association. Categories overlap; a coding discrepancy alone does not establish hallucination. Missing-information diagnostics are explicitly requested, not spontaneous.

C supplies 4/4 conditions for price and duration and 1/4 for hosting under the frozen retrieval setting. These upstream counts are mechanically the same for both providers, not independent confirmation of a GEO writing rule. The full-text control supplies 4/4. C changes redundancy and length; the splitter keeps sentences indivisible.

Claude: 108 attempted, 107 complete, 1 failed, 0 incomplete, 0 unattempted. Estimated usage cost USD 0.718656 before tax, unresolved reserve USD 0.032428, cap USD 2; not an invoice. No new OpenAI calls or automatic retries. The protocol was frozen locally before generation; public preregistration was blocked by authorization review. Three authored cases, two languages, three repetitions, one model per provider; no independent corpus or observed web-citation uplift.

## Reproduce without API calls

Run `node anthropic/summarize.mjs` from the repository root. Historical files are hash-checked in `experiment.json`; the same exported measurement function is used for both series. Never rerun a collector against an existing output directory. Visitors need no API key.
