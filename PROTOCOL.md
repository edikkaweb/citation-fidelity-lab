# Citation Fidelity Lab — protocol 0.2 / release 0.3

Frozen design date: 2026-10-08. The duration follow-up has not started when this protocol is frozen. Exact prompts, order, options and hashes are in `experiment.json`.

## Français

### Correction et question

Le corpus 0.1 comportait un renvoi ambigu dans le cas du délai : « Cette catégorie » pouvait désigner deux offres selon sa place. Le corpus 0.2 remplace uniquement cette expression par « La refonte ciblée » (et son équivalent anglais). Les six phrases, leurs conditions et leur ordre restent identiques entre les deux versions, hors cette correction. Les variantes A et B du nouveau corpus sont toujours deux permutations des mêmes six phrases.

Les 36 essais initiaux, leur corpus, leurs règles, leurs résultats et leur interface sont conservés sans réécriture dans [archive/v0.2](archive/v0.2/). Aucun essai initial n'est supprimé. Les cas prix et hébergement ne sont pas réexécutés.

### Collecte fixée avant les appels

Délai uniquement : deux variantes × deux langues × trois répétitions = **12 appels indépendants**. Fournisseur OpenAI, modèle `gpt-6-astra`, Responses API v1, effort `medium`, limite de sortie 4 000 tokens (raisonnement compris), service `default`, `store:false`, `tools:[]`. Une seule variante par appel, aucune conversation précédente, aucun exemple de réponse. Le modèle retourné et les horodatages sont consignés. L'ordre A/B alterne selon répétition et langue ; aucune randomisation n'est revendiquée.

La consigne reste exactement celle du premier protocole, conservée intégralement dans chaque requête du plan. Les contrôles déterministes 0.1 restent inchangés, même lorsqu'ils manquent une reformulation valide. Corpus, règles, protocole, collecteur et dépenses antérieures sont hachés avant le premier appel. Arrêt au premier échec technique ; aucune reprise automatique ni changement de modèle. Toutes les tentatives, erreurs et sorties incomplètes restent dans les données.

Budget autorisé **cumulé** : 10 USD hors taxes. Les 0,31414 USD calculés pour la première série sont déduits avant toute réservation. Le collecteur réserve pour chaque appel une borne d'entrée et la sortie maximale, sans libérer cette réserve pendant la série. Il ne plafonne ni les autres dépenses du compte ni les taxes. La clé reste privée, hors navigateur et dépôt.

### Lecture des résultats

Rapporter séparément les 12 nouveaux essais et les 36 initiaux. Aucune moyenne commune, aucun gain avant/après causal : le texte source a changé. Trois répétitions par condition décrivent ces réponses, sans estimer un taux stable. L'expérience fournit un texte ; elle ne teste ni recherche web, ni accès à une URL, ni découverte spontanée, ni probabilité réelle de citation. Un seul modèle ne constitue pas une comparaison de fournisseurs et l'API n'est pas l'interface ChatGPT.

Un repère détecté est une expression reconnue, pas une certification du sens. Non détecté ne signifie pas faux ; les contradictions citées ou niées et réponses incomplètes restent indéterminées. Les règles ne couvrent pas toutes les conditions. Aucun score global, jury ou contrôle humain obligatoire. Réponses brutes, options, dates, usages, erreurs et constats sont publiés ; clés et métadonnées de compte sont exclus.

## English

### Correction and frozen follow-up

Corpus 0.1 used the ambiguous phrase “This category” in the duration case. Corpus 0.2 changes it to “A targeted redesign”, with the equivalent French correction. All other sentences, conditions and order remain unchanged. A and B still permute the exact same six sentences. The original 36 attempts, corpus, checker, report and interface remain intact in [archive/v0.2](archive/v0.2/); price and hosting are not recollected.

The new series consists of **12 independent duration calls**: two variants × two languages × three repetitions. OpenAI `gpt-6-astra`, Responses API v1, medium reasoning, 4,000 output tokens including reasoning, default service tier, no tools, no stored conversation. The original fixed instruction is retained verbatim in each planned request. A/B order alternates by repetition and language; it is not randomised. No prior response, competing variant or teaching answer is supplied. Preserve the returned model, timestamps, answers, usage, errors and completeness.

Checker 0.1 is unchanged despite known missed paraphrases. Freeze hashes of source, checker, protocol, collector and prior spending before collection. Stop at the first technical failure; no automatic retries or model fallback. Record every started attempt. The **cumulative USD 10 before-tax ceiling** includes the first series' calculated USD 0.31414; subtract that amount before reserving the worst-case new requests. This is not an account-wide spending limit. Credentials remain private.

### Interpretation and reuse

Report the 12 new attempts separately from the first 36. Do not pool versions or claim a causal before/after improvement: the source text changed. Three repetitions per condition do not establish stable rates. Supplied text cannot establish web retrieval, discovery or real citation probability. One provider is not a cross-provider comparison; API outputs do not represent the ChatGPT interface.

Detected expressions do not certify overall meaning. Non-detection is not an error verdict; quoted/negated conflicts and incomplete outputs remain indeterminate. Rules do not cover every condition. No overall score or required human judging. Publish the full safe records and frozen files, with MIT code and CC BY 4.0 authored material.

## Prior research / Recherche antérieure

Citation support and coverage are established concepts: [Liu, Zhang and Liang (2023), Evaluating Verifiability in Generative Search Engines](https://aclanthology.org/2023.findings-emnlp.467/). This lab is an exploratory teaching instrument, not a benchmark or a claim of scientific novelty.
