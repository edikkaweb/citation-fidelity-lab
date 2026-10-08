# Duration follow-up / Nouvelle série délai — 2026-10-08

Release 0.3 · corpus 0.2 · unchanged checker 0.1 · GPT-6 Astra · supplied text, no tools.

## Français

**12 nouveaux appels, 12 réponses complètes, 0 échecs, 0 réponses incomplètes.** Deux variantes × deux langues × trois répétitions, délai uniquement. Le renvoi « Cette catégorie » est remplacé par « La refonte ciblée » ; aucun autre fait n’a été changé. Les contrôles restent identiques.

Coût calculé de cette série : **0.10378 USD HT**. Coût cumulé avec la série initiale : **0.41792 USD HT**, pour un plafond de 10 USD. Ces calculs reposent sur les consommations retournées ; ce ne sont pas des factures.

Les [36 essais initiaux et leur rapport](archive/v0.2/RESULTS.md) restent intacts, y compris les 12 essais de délai ambigus. Ils ne sont pas fusionnés avec les nouveaux essais. Le sélecteur principal conserve les 24 réponses initiales de prix/hébergement et présente les 12 nouvelles réponses du délai, avec leur provenance exportable. L’[ancienne interface](archive/v0.2/) permet de revoir la totalité de la première série.

Les expressions reconnues sont présentées ci-dessous, sans score global. Les règles manquent des reformulations valides ; une non-détection ne constitue pas une erreur sémantique établie. La correction retire un renvoi ambigu identifié ; elle ne prouve pas à elle seule la fidélité de toutes les réponses. Aucun résultat avant/après causal n’est revendiqué, puisque le texte a changé. Trois répétitions par condition ne permettent pas une généralisation. Aucun jury ou contrôle humain obligatoire.

## English

**12 new calls, 12 complete answers, 0 failures, 0 incomplete answers.** Duration only: two variants × two languages × three repetitions. “This category” was replaced with “A targeted redesign”; all other facts and the checker remain unchanged.

Calculated follow-up cost: **USD 0.10378 before tax**. Cumulative calculated cost: **USD 0.41792 before tax**, within the USD 10 ceiling. Returned usage supports these calculations; they are not billing receipts.

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

### Une durée, sans promesse ajoutée · FR

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Attribution à Edikka | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Durée de 4 à 7 semaines | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Refonte ciblée | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Durée indicative | 3 / 0 / 0 / 0 | 2 / 0 / 0 / 1 |
| Calendrier lié à une proposition signée | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |

### A duration, without an added promise · EN

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Attribution to Edikka | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Four-to-seven-week duration | 0 / 3 / 0 / 0 | 2 / 1 / 0 / 0 |
| Targeted redesign | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Indicative duration | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Schedule tied to a signed proposal | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |

## Integrity / Intégrité

Results SHA-256: `d5a9d0d201995c6a379975182efc27be5916bdcb810ee04e0e43f86b377d2e5b`. Run `node summarize.mjs` to verify recorded prompts and recompute indicators and counts without any API call. The checker and corpus used for this series are pinned in `experiment.json`; results must not be silently re-scored after rule changes.


## Separate fragment experiment / Expérience distincte par fragments

Release 0.4 adds a new 72-call series with its own full-text control, retrieval rule and frozen plan. The preceding report remains the report of the original 36 + 12 calls. / La version 0.4 ajoute une série distincte de 72 appels, avec témoin complet, règle de récupération et plan figé. Le rapport ci-dessus conserve la lecture des 36 + 12 appels antérieurs.

[Read the bilingual fragment report / Lire le rapport par fragments](retrieval/REPORT.md) · [Explore / Explorer](https://edikkaweb.github.io/citation-fidelity-lab/retrieval/)
