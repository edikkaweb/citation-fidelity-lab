# Citation Fidelity Lab — protocol 0.1

Frozen design date: 2026-10-08. No model collection has started in this release.

## English

### Question and boundaries

Does regrouping an identical set of factual sentences help an assistant retain decision-relevant conditions? The demonstration makes this comparison inspectable. It does not answer the empirical question yet, measure Search eligibility, or test whether a page is discovered and cited on the open web.

Three cases cover a price and scope, an indicative duration, and a hosting capability. Each has six authored source sentences and two permutations. No sentence is added or removed between variants. These short passages isolate an order change; they do not represent all long-page layouts. Source dates describe the underlying policy when known. Review dates describe our inspection, not the policy's publication date.

### Predeclared exploratory design

First pilot: price only; two variants × two explicitly selected assistants × three independent requests × two languages = 24 planned calls. This is a planned count, not a completed sample. The later three-case extension would total 72 calls under the same design. Three repetitions per condition are descriptive and do not establish a stable rate or population effect.

Before collection, record exact provider/model IDs, options, API version if exposed, date, tool availability, token limit, corpus and checker hashes. Use a fresh conversation for every request. Alternate the variant order within each repetition and record the actual order. Give one variant at a time, without the authored teaching answer or the alternative variant. Do not pool different model versions.

Fixed user prompt:

> Answer the question using only the supplied source passage. Keep the scope, exclusions and uncertainty attached to any number or claim. If the passage cannot establish an answer, say so. Identify the source by name; do not invent evidence or URLs.

Append the selected question and source passage exactly as stored in the corpus. The FR version uses the equivalent fixed prompt below. Record the full final prompt, not just its template.

### Separate three experiments

1. **Supplied text:** tests restatement of information already given. It cannot show discovery or real-world citation probability.
2. **Supplied URL:** tests retrieval and restatement with an explicit target. Record whether retrieval actually succeeded; an access failure is not content omission.
3. **No supplied URL:** tests source discovery for a frozen query and surface. Record every visible source URL and distinguish the domain from the exact article. This requires a separate protocol and denominator.

Do not merge these experiments. API model outputs are not observations of ChatGPT, Claude or Perplexity consumer interfaces unless collected from those interfaces.

### Automated assessment and records

For each attempt preserve: run ID, case, language, variant, repetition, presentation order, full prompt, request options, start/end timestamps, returned model ID, raw answer, finish reason, tool traces if exposed, usage, error and retry relationship. Never include keys, authorization headers or private account details in public results.

Report one indicator per condition. `present` means an explicit expression was detected; `conflict` means a predefined contradictory expression was detected; `not_detected` is not proof of absence or falsehood; `indeterminate` includes empty/incomplete outputs and potentially quoted or negated conflicts. These rules cannot certify entailment. Even all indicators present cannot certify overall fidelity. The current checker does not assess every source condition (for example every date or exception).

The predeclared condition families are attribution, numbers, scope, exclusions, status of a promise and limits of the cited evidence. Any later model-assisted assessment must have its own model ID, prompt, version and disagreements preserved. It must not be silently substituted for deterministic checks or described as ground truth.

No manual judging, double annotation or mandatory third-party replication is required. Ambiguous cases remain indeterminate. A future automated assessor can add evidence but cannot erase that uncertainty by policy.

Keep every attempted run, including API failures, partial responses, null differences and unfavourable outcomes. A retry gets its own record and links to the failed attempt. Report attempted, completed, failed and indeterminate counts separately, then condition-level counts with their denominators by case, language and assistant. Never turn an incomplete response into “not cited”. Do not combine indicators into a percentage called citability or semantic fidelity.

### Release and reuse

`results.json` is the empirical result store; authored examples live in `corpus.mjs`. Publish the frozen corpus, checker, hashes and actual collection records together when a collection exists. Until then, keep `status: "not_collected"` and `runs: []`. Version a changed corpus or rule set and keep the earlier release. The demo works with no credentials; a later collector would run privately, never inside GitHub Pages.

The distinction between citation coverage and citation support is established research, not a new Edikka claim: [Liu, Zhang and Liang (2023), Evaluating Verifiability in Generative Search Engines](https://aclanthology.org/2023.findings-emnlp.467/). This lab illustrates business conditions; its fixtures are not a benchmark of current assistants.

## Français

### Question et périmètre

Rapprocher les mêmes phrases factuelles aide-t-il un assistant à conserver les conditions utiles à une décision ? Cette démonstration rend la comparaison inspectable. Elle n'apporte pas encore de réponse expérimentale et ne mesure ni l'indexation, ni la découverte spontanée d'une page, ni sa probabilité d'être citée.

Trois cas : prix et périmètre, délai indicatif, capacité d'hébergement. Chaque cas contient six phrases rédigées pour l'expérience, disposées dans deux ordres différents. Le contenu factuel est identique entre variantes. Ce changement d'ordre ne représente pas toutes les mises en page possibles. La date d'une politique et la date de consultation de sa source restent distinctes.

### Pilote prévu avant collecte

Prix uniquement : deux variantes × deux assistants précisément identifiés × trois requêtes indépendantes × deux langues = 24 appels prévus. L'extension aux trois cas représenterait 72 appels. Aucun de ces appels n'est annoncé comme effectué. Trois répétitions par condition permettent une description, pas un taux stable ou une généralisation.

Avant les appels, figer identifiants des fournisseurs et modèles, paramètres, date, outils, limite de sortie, versions et empreintes du corpus et du contrôleur. Une conversation neuve par appel. Alterner l'ordre des variantes dans chaque répétition et le consigner. Fournir une seule variante, sans l'autre variante ni les exemples de réponse. Ne pas regrouper des versions différentes d'un modèle.

Consigne fixe :

> Réponds à la question à partir du seul passage source fourni. Conserve le périmètre, les exclusions et les incertitudes associés à chaque chiffre ou affirmation. Si le passage ne permet pas de conclure, indique-le. Identifie la source par son nom ; n'invente ni preuve ni URL.

Ajouter la question et le passage du corpus, sans réécriture. Conserver le prompt complet effectivement envoyé.

### Trois situations distinctes

Texte fourni : reprise d'une information déjà disponible. URL fournie : accès effectif à une cible puis reprise, avec échecs d'accès séparés. Sans URL : découverte d'une source, selon un protocole distinct et une requête figée. Ne pas fusionner ces observations. Un résultat d'API ne représente pas automatiquement l'interface grand public du même fournisseur.

### Contrôles et conservation

Conserver pour chaque tentative : identifiant, cas, langue, variante, répétition, ordre, prompt complet, paramètres, horodatages, modèle retourné, réponse brute, raison de fin, traces d'outils disponibles, consommation, erreur et lien entre tentative et reprise. Exclure clés, en-têtes d'autorisation et données privées des exports publics.

Un repère détecté signifie qu'une formulation attendue a été trouvée. Une contradiction détectée correspond à une expression contradictoire prévue par le code. Un repère non détecté ne démontre pas une erreur. Une réponse vide ou incomplète et les contradictions possiblement citées ou niées restent indéterminées. Même tous les repères présents ne certifient pas le sens global. Certaines conditions de la source, comme chaque date ou exception, ne sont pas couvertes par ce contrôleur.

Les familles prévues sont l'attribution, les chiffres, le périmètre, les exclusions, la portée de l'engagement et les limites de la preuve. Un futur évaluateur par modèle doit conserver son modèle, son prompt, sa version et ses désaccords. Il ne remplace pas discrètement les règles ni ne devient une vérité de référence.

Aucune validation humaine, double annotation ou réplication externe obligatoire. Les ambiguïtés restent indéterminées. Conserver les échecs, réponses partielles, résultats nuls ou défavorables ; toute nouvelle tentative possède son propre identifiant. Rapporter séparément les tentatives, réussites techniques, échecs et cas indéterminés, puis les repères par condition, langue, cas et assistant, avec leurs dénominateurs. Une réponse incomplète ne vaut pas « non cité ». Aucun score global de citabilité ou de fidélité.

Les exemples rédigés restent dans `corpus.mjs`, les collectes dans `results.json`. Publier corpus, code, versions, empreintes et traces ensemble lorsqu'une collecte existe. D'ici là, conserver le statut `not_collected` et la liste vide. La démo ne nécessite aucune clé ; une éventuelle collecte se fera dans un environnement privé, jamais dans GitHub Pages.

La distinction scientifique entre couverture des citations et soutien réel des affirmations précède ce laboratoire : [Liu, Zhang et Liang, 2023](https://aclanthology.org/2023.findings-emnlp.467/). Les cas Edikka illustrent des conditions métier ; ils ne constituent pas un classement des assistants actuels.
