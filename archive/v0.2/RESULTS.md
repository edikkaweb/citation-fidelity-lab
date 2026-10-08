# Collected results / Résultats collectés — 2026-10-08

Release 0.2 · corpus/checker 0.1 frozen · GPT-6 Astra · supplied text, no tools.

## Français

**36 appels tentés, 36 réponses complètes, 0 échecs et 0 réponses incomplètes.** Trois cas × deux variantes × deux langues × trois répétitions, un seul modèle. Coût estimé à partir des consommations retournées : **0.31414 USD hors taxes**, pour un plafond autorisé de 10 USD. Il s'agit d'un calcul, pas d'une facture.

Cette série ne démontre aucun gain général de fidélité ni de citation. Les trois répétitions par condition ne permettent pas d'estimer un taux stable. Les réponses proviennent de l'API OpenAI, pas de l'interface ChatGPT. Aucune recherche web ni découverte spontanée de page n'a été testée. La comparaison avec un second fournisseur reste à réaliser.

Deux limites du dispositif sont visibles dans les traces :

- **La détection manque des reformulations.** Dans le premier essai tarifaire FR, la réponse écrit « en exclut » et « limité à trois gabarits » ; les expressions figées du contrôleur ne les reconnaissent pas. Les statuts « non détecté » ne constituent donc pas des erreurs sémantiques établies. Les règles n'ont pas été ajustées après collecte.
- **Des phrases identiques peuvent changer de référent lorsqu'on les déplace.** Dans le cas du délai, la variante A place « Cette catégorie » / « This category » après la catégorie B2B complète, alors que B la rattache à la refonte ciblée. Le premier essai FR A signale cette ambiguïté. L'expérience ne peut donc pas isoler un simple effet de mise en forme : la résolution du renvoi est un facteur de confusion. Le corpus original reste conservé ; une version ultérieure devra rendre ces phrases autonomes et faire l'objet d'une nouvelle collecte distincte.

Les tableaux rapportent des expressions détectées, pas la vérité d'une réponse. Les quatre statuts sont conservés, sans score global. Une contradiction potentiellement niée ou citée reste indéterminée. Aucun jugement humain n'est requis pour reproduire ces contrôles ; leur portée reste limitée.

## English

**36 attempted calls, 36 complete answers, 0 failures and 0 incomplete answers.** Three cases × two variants × two languages × three repetitions, one model. Estimated cost from returned usage: **USD 0.31414 before tax**, within the authorised USD 10 ceiling. This calculation is not a billing receipt.

This series establishes no general fidelity or citation benefit. Three repetitions per condition do not establish stable rates. These are OpenAI API outputs, not observations of the ChatGPT interface. No web retrieval or spontaneous discovery was tested. The second-provider comparison remains uncollected.

The traces expose two limitations. First, the frozen checker misses valid-looking paraphrases: the first French price answer uses “en exclut” and “limité à trois gabarits”, which its patterns do not recognise. Non-detection is not an established semantic error; rules were not tuned after collection. Second, rearranging identical sentences can change a pronoun's referent. In time variant A, “This category” follows the complete B2B category, while B places it after targeted redesign. The first French A answer flags this ambiguity. The experiment therefore cannot isolate formatting alone. A future corpus must use self-contained sentences and be collected separately; this original corpus is preserved.

Counts below describe detected expressions, not answer truth. All four outcomes remain visible, with no overall score. Potentially negated or quoted conflicts remain indeterminate. No human judging is required to reproduce these checks; their limitations remain explicit.

## Records / Traces

[Every prompt and answer](results.json) · [Frozen plan and fingerprints](experiment.json) · [Machine-readable counts](summary.json) · [Bilingual protocol](PROTOCOL.md) · [Collector](collect.mjs) · [Recompute this report](summarize.mjs)

A = distributed / dispersé ; B = grouped / rapproché.

Each cell: **detected / non-detected / conflict / indeterminate**. Denominator: 3 attempted and complete answers for each cell in this collection. These counts must not be combined into a fidelity percentage.

Chaque cellule : **détecté / non détecté / contradiction / indéterminé**. Dénominateur : 3 réponses tentées et complètes pour chaque cellule de cette collecte. Ne pas agréger en pourcentage de fidélité.

### Un prix, avec son périmètre · FR

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Attribution à Edikka | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Deux bornes de la fourchette | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Hors taxes | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Offre ciblée | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Limite de trois gabarits | 0 / 3 / 0 / 0 | 0 / 3 / 0 / 0 |
| Contenus disponibles | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Exclusion du multilingue | 2 / 1 / 0 / 0 | 3 / 0 / 0 / 0 |
| Exclusion des intégrations spécifiques | 2 / 1 / 0 / 0 | 3 / 0 / 0 / 0 |
| Fourchette sans devis automatique | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |

### A price, with its scope · EN

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Attribution to Edikka | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Both ends of the range | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Excluding VAT | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Targeted offer | 3 / 0 / 0 / 0 | 2 / 1 / 0 / 0 |
| Limit of three templates | 0 / 3 / 0 / 0 | 2 / 1 / 0 / 0 |
| Available content | 0 / 3 / 0 / 0 | 2 / 1 / 0 / 0 |
| Multilingual work excluded | 0 / 3 / 0 / 0 | 0 / 3 / 0 / 0 |
| Bespoke integrations excluded | 0 / 3 / 0 / 0 | 0 / 3 / 0 / 0 |
| Range without automatic quotation | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |

### Une durée, sans promesse ajoutée · FR

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Attribution à Edikka | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Durée de 4 à 7 semaines | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Refonte ciblée | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Durée indicative | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Calendrier lié à une proposition signée | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |

### A duration, without an added promise · EN

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Attribution to Edikka | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Four-to-seven-week duration | 2 / 1 / 0 / 0 | 1 / 2 / 0 / 0 |
| Targeted redesign | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Indicative duration | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Schedule tied to a signed proposal | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |

### Une capacité, avec sa limite · FR

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| Source GitHub identifiée | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Hébergement statique | 1 / 2 / 0 / 0 | 2 / 1 / 0 / 0 |
| HTML, CSS et JavaScript | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Capacité PHP non établie par la source | 0 / 0 / 0 / 3 | 0 / 0 / 0 / 3 |

### A capability, with its boundary · EN

| Condition | A · n=3 | B · n=3 |
| --- | --- | --- |
| GitHub source identified | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| Static hosting | 0 / 3 / 0 / 0 | 2 / 1 / 0 / 0 |
| HTML, CSS and JavaScript | 3 / 0 / 0 / 0 | 3 / 0 / 0 / 0 |
| PHP capability not established by the source | 0 / 3 / 0 / 0 | 1 / 2 / 0 / 0 |

## Integrity / Intégrité

Results SHA-256: `36ba87793a83fc9620443cd3eaaebb181aae4bb8922fe8d9212df1219ca126c4`. Run `node summarize.mjs` to verify recorded prompts and recompute indicators and counts without any API call. The checker and corpus used for this series are pinned in `experiment.json`; results must not be silently re-scored after rule changes.
