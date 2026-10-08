# Fragment retrieval experiment · results / résultats

Experiment: fragment-retrieval-v1-20261008. Frozen plan: [experiment.json](experiment.json). Collection: 2026-10-08T18:23:26.985Z–2026-10-08T18:31:50.850Z. Returned model: gpt-6-astra. [All raw answers and supplied fragments](results.json), [interactive comparison](https://edikkaweb.github.io/citation-fidelity-lab/retrieval/), [protocol](PROTOCOL.md), [recompute counts](summarize.mjs), [summary](summary.json).

## Français

**Résultat principal : le sens de l’écart dépend du cas.** Avec trois phrases par fragment et un seul fragment retenu, les conditions disponibles passent de 2/4 dans A à 3/4 dans B pour le prix, de 1/4 à 3/4 pour le délai, mais de 3/4 à 1/4 pour l’hébergement. Ce constat est identique dans les deux langues. Il concerne l’information fournie en amont, pas un jugement de fidélité sur les réponses. Le témoin complet fournit 4/4 conditions dans toutes les variantes.

Le contre-exemple hébergement est conservé : dans B, le fragment où l’exécution PHP est indiquée comme non documentée répond davantage aux termes de la question, mais laisse les capacités statiques dans l’autre fragment. Rapprocher certaines conditions ne garantit donc pas que notre récupérateur sélectionnera toutes les conditions utiles. Les noms A/B désignent les permutations publiées, pas un classement de qualité.

**Collecte.** 72/72 appels ; 72 réponses complètes, 0 incomplètes, 0 échecs, 0 non tentés. 0/236 extraits déclarés ne passent pas le contrôle exact. Ce contrôle vérifie un identifiant fourni et une sous-chaîne d’au moins 16 caractères après normalisation des espaces. Il ne certifie ni l’exhaustivité ni le soutien sémantique de toute la réponse. Il ne donne pas non plus le taux d’erreur du contrôleur historique.

Coût calculé d’après les usages et le tarif figé : **1.01678 USD HT** pour cette série ; **1.4347 USD HT** avec les 48 réponses antérieures (0,41792 USD), sous le plafond autorisé de 10 USD. Ces montants sont des estimations, pas une facture. Les 36 + 12 réponses antérieures et leurs règles restent intactes et ne sont pas agrégées comme observations équivalentes.

### Observations par condition expérimentale

La colonne « extraits » donne, pour chacune des trois répétitions, le nombre d’identifiants F1–F4 accompagnés d’un extrait exact dans les preuves déclarées. Les répétitions sont indépendantes ; elles ne constituent pas une estimation robuste d’un taux.

| Cas | Langue | Entrée | Variante | Conditions fournies | Extraits exacts des conditions, par essai | Extraits invalides / déclarés |
|---|---|---|---|---|---|---|
| price | fr | retrieved | A | 2/4 | 2, 2, 2 | 0/7 |
| price | fr | retrieved | B | 3/4 | 3, 3, 2 | 0/8 |
| price | fr | full | A | 4/4 | 4, 4, 4 | 0/15 |
| price | fr | full | B | 4/4 | 4, 4, 4 | 0/15 |
| price | en | retrieved | A | 2/4 | 2, 2, 2 | 0/6 |
| price | en | retrieved | B | 3/4 | 2, 2, 3 | 0/7 |
| price | en | full | A | 4/4 | 3, 3, 3 | 0/12 |
| price | en | full | B | 4/4 | 3, 3, 3 | 0/12 |
| time | fr | retrieved | A | 1/4 | 1, 1, 1 | 0/6 |
| time | fr | retrieved | B | 3/4 | 3, 3, 3 | 0/9 |
| time | fr | full | A | 4/4 | 4, 4, 4 | 0/15 |
| time | fr | full | B | 4/4 | 4, 4, 4 | 0/13 |
| time | en | retrieved | A | 1/4 | 1, 1, 1 | 0/6 |
| time | en | retrieved | B | 3/4 | 3, 3, 3 | 0/9 |
| time | en | full | A | 4/4 | 4, 4, 4 | 0/12 |
| time | en | full | B | 4/4 | 4, 4, 4 | 0/12 |
| hosting | fr | retrieved | A | 3/4 | 3, 3, 3 | 0/9 |
| hosting | fr | retrieved | B | 1/4 | 1, 1, 1 | 0/3 |
| hosting | fr | full | A | 4/4 | 4, 4, 4 | 0/12 |
| hosting | fr | full | B | 4/4 | 4, 4, 4 | 0/12 |
| hosting | en | retrieved | A | 3/4 | 3, 3, 3 | 0/9 |
| hosting | en | retrieved | B | 1/4 | 1, 1, 1 | 0/3 |
| hosting | en | full | A | 4/4 | 4, 4, 4 | 0/12 |
| hosting | en | full | B | 4/4 | 4, 4, 4 | 0/12 |

### Sensibilité et limites

Les **48 réglages de récupération**, avec groupes de deux ou trois phrases et un ou deux fragments, figurent dans le plan, la synthèse et l’interface. Aucune génération supplémentaire n’a lieu pour ces réglages. La comparaison principale garde son réglage préenregistré ; aucun meilleur réglage n’est choisi après les réponses.

Trois cas rédigés, un fournisseur, un modèle et une consigne structurée explicite : ce dispositif est une simulation contrôlée, sans recherche web. Les extraits sont des preuves déclarées sur des faits fournis, pas des citations web spontanées. On ne peut pas en déduire une hausse de citation, un effet universel du regroupement ni une supériorité entre fournisseurs. La comparaison Claude n’est pas réalisée. Un second fournisseur peut répéter ce protocole dans une série distincte, sans changer les cas après observation. Aucun jury ou contrôle humain obligatoire n’a été ajouté.

## English

**Main finding: the direction depends on the case.** Under the frozen three-sentence, top-one setting, available conditions change from 2/4 in A to 3/4 in B for price, from 1/4 to 3/4 for duration, but from 3/4 to 1/4 for hosting. Both languages show the same retrieval outcome. This measures supplied information before generation, not semantic answer fidelity. Every full-text control supplies 4/4 conditions.

The adverse hosting example is retained: B’s fragment stating that PHP execution is not documented matches the question better while leaving static-hosting capabilities in another fragment. Grouping some conditions does not guarantee that this retriever selects every relevant condition. A/B names identify published permutations, not quality ranks.

**Collection:** 72/72 calls, 72 complete, 0 incomplete, 0 failed, 0 unattempted. 0/236 declared extracts fail the exact ID/substring check. This check requires a supplied fact ID and at least 16 characters after whitespace normalization; it does not establish completeness or semantic support for the whole answer, nor the historical checker’s error rate.

Estimated cost: **USD 1.01678 before tax** for this series, **USD 1.4347 cumulative** including the prior 48 calls. Usage-based calculation, not an invoice. Historical 36 + 12 outputs and rules remain unchanged and separate.

The table above reports case, language, input mode, variant, available condition count, exact-cited condition counts for each of three independent runs, and invalid/declared extract counts. It is descriptive, not a stable rate estimate. All **48 retrieval-only sensitivity settings** are published; no extra generation or post-hoc best-setting selection.

**Limits:** three authored cases, one provider/model, explicit structured evidence instructions, no web search. Declared extracts from supplied facts are not spontaneous web citations. No web citation uplift, universal grouping benefit, semantic fidelity score or cross-provider superiority is established. Claude has not been evaluated. A second provider can run a separate replication with the same cases and no mandatory human gate.

Results SHA-256: `28f0af9f5c50656d17dabc112dd460a160d9dba07f2e49e5a3d1567fa6b0bc40`. Recompute locally: `node retrieval/summarize.mjs`. Code MIT; authored material CC BY 4.0.
