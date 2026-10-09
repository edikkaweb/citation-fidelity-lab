# Citation Fidelity Lab · Edikka

Compare a source passage with a restatement, condition by condition. Three cases (price, time, hosting), in French and English. This static demonstration runs entirely in the browser.

[Try the demo in French](https://edikkaweb.github.io/citation-fidelity-lab/) · [Try it in English](https://edikkaweb.github.io/citation-fidelity-lab/?lang=en)

**Release 0.6 adds a separate Claude Sonnet 5.5 replication: 107 complete answers, one retained transport failure and 106 complete input pairs with GPT-6 Astra.** On that paired subset, missing conditions declared correctly: Claude 78/83, GPT-6 Astra 74/83. Supplied conditions declared missing: 0/341 versus 9/341. This is an explicitly requested diagnostic with overlapping categories, not a semantic-fidelity score or a model ranking. Estimated Claude cost USD 0.718656 plus USD 0.032428 reserved for unknown usage, within USD 2. [Compare FR/EN](anthropic/) · [Report](anthropic/REPORT.md) · [Frozen protocol](anthropic/PROTOCOL.md).

**Release 0.3 adds 12 duration follow-up answers and preserves all 36 original answers in an intact archive.** All 48 calls completed across two separate series, with no technical failures. Total calculated usage cost: **USD 0.41792 before tax**. The follow-up replaces an ambiguous reference with “A targeted redesign”; the checker remains unchanged. The main selector shows the original price/hosting cases and the new duration case, with the matching source text and exported provenance. [Read the bilingual results and limitations](RESULTS.md). No pooled statistics, citation lift, ranking benefit or overall fidelity score is claimed.

**Release 0.4 adds a separately frozen fragment-retrieval experiment: 72 complete responses, a full-text control and 48 retrieval-only sensitivity settings.** The direction changes by case: grouping exposes more conditions for price and duration, fewer for hosting under the frozen rule. No universal benefit is claimed. Series cost USD 1.01678; cumulative USD 1.43470 before tax across 120 calls in three distinct series. [Explore FR](retrieval/) · [Explore EN](retrieval/?lang=en) · [Bilingual report and limits](retrieval/REPORT.md). Claude was not evaluated in that historical release; see the separate [0.6 replication](anthropic/REPORT.md).

**Release 0.5 tests attached conditions (C) and explicitly requested missing-information declarations, and adds a browser-only “your text” workbench.** C supplies 4/4 conditions for price and duration but 1/4 for hosting under the frozen retriever. Length and repetition also change; this is not a universal GEO rule. The first transport failure and the separately archived biased pilot remain visible. [New report](attached/REPORT.md) · [A/B/C explorer](attached/) · [Your text](workbench/). Claude was untested in that release; see the separate [0.6 replication](anthropic/REPORT.md).

## Run locally

Requires Node.js 22 or newer; no package installation and no API key.

```sh
npm test
npm run serve
```

Open <http://127.0.0.1:8796/> or add `?lang=en`. The local server accepts only reads, stays on loopback, and is for preview only. GitHub Pages serves the same files without this server.

## Publish on GitHub Pages

Place this directory's contents at the root of a dedicated repository. In the repository's Pages settings, publish the root of the chosen branch. `.nojekyll` keeps these static files as supplied. All asset links are relative and work under a project subdirectory. Do not publish the parent Edikka checkout, its configuration or credentials.

## Inspect and reproduce

- [Bilingual protocol](PROTOCOL.md): scope, paired variants, records, failure handling and limits.
- [Corpus](corpus.mjs): source links, dates, facts and explicitly authored examples.
- [Checker](checker.mjs): small, inspectable rules with no provider calls.
- [12 duration follow-up records](results.json): exact prompts, answers, options, timestamps, usage and indicators.
- [Original 36 records, code, corpus and interface](archive/v0.2/) remain unchanged.
- [Frozen collection plan](experiment.json): hashes, order, budget and model settings.
- [Results and limitations](RESULTS.md) and [condition counts](summary.json).
- `node summarize.mjs`: verify every prompt and recompute indicators locally, without an API call.
- `test/checker.test.mjs`: preservation of facts, incomplete outputs, number boundaries, tax contradictions, quoted counterexamples and unknown paraphrases.

The browser interface includes no tracking, cookies, browser storage or model calls. It loads the published experiment records from the same site. The JSON download happens only when the visitor requests it and contains their entered text. Outbound source links leave the demo. A hosting provider can still keep ordinary access logs.

Code is MIT-licensed. Edikka-authored corpus passages and teaching answers are CC BY 4.0 (credit: “Edikka, Citation Fidelity Lab, corpus 0.2 / release 0.3, 2026-10-08”). Linked third-party documents retain their own rights; this repository does not relicense them. Source passages here are editorial paraphrases, not verbatim quotations. See [LICENSE](LICENSE).

## Français

**Version 0.6 : 107 réponses Claude Sonnet 5.5 complètes, un échec de transport conservé et 106 entrées communes avec GPT-6 Astra.** Sur ces paires, absences reconnues : 78/83 contre 74/83 ; informations fournies déclarées manquantes : 0/341 contre 9/341. Diagnostic demandé explicitement, catégories parfois recoupées : aucun score de fidélité sémantique ni classement général. Coût Claude estimé 0,718656 USD HT, plus réserve 0,032428 USD pour usage inconnu. [Comparateur](anthropic/) · [Rapport](anthropic/REPORT.md).

**La version 0.5 teste la variante C et les déclarations explicites d’informations manquantes, et ajoute un mode « votre texte » sans API.** C fournit 4/4 conditions pour prix/délai, mais 1/4 pour hébergement. La longueur et la répétition changent aussi : aucune règle GEO universelle n’est établie. L’échec de transport et le pilote biaisé sont conservés séparément. [Rapport](attached/REPORT.md) · [Explorer A/B/C](attached/) · [Votre texte](workbench/). Claude était non testé dans cette version ; voir la [réplication 0.6 distincte](anthropic/REPORT.md).

**La version 0.4 ajoute 72 réponses dans une expérience distincte par fragments, avec un témoin complet et 48 réglages de sensibilité sans appel supplémentaire.** L’effet dépend du cas : davantage de conditions fournies pour prix/délai, moins pour hébergement avec la règle figée. Aucun bénéfice universel établi. Coût de cette série : 1,01678 USD HT ; cumul des trois séries (120 appels) : 1,43470 USD HT. [Expérience interactive](retrieval/) · [Rapport bilingue](retrieval/REPORT.md). Claude n’était pas évalué dans cette version ; voir la [réplication distincte](anthropic/REPORT.md).


Ce laboratoire rapproche une information de sa reprise, sans note globale. Les trois cas sont bilingues et le code fonctionne sans serveur applicatif ni clé API. Dans les exemples historiques A/B, les deux variantes de chaque cas contiennent **exactement les mêmes phrases**, ordonnées différemment.

La version 0.3 conserve les 36 premières réponses et ajoute 12 réponses sur le délai corrigé, dans une série distincte. Les 48 appels sont complets, sans échec technique ; coût cumulé calculé : **0,41792 USD hors taxes**. « La refonte ciblée » remplace le renvoi ambigu, sans modifier les contrôles ni les anciens résultats. Les réponses, sources et versions restent identifiables. [Le rapport](RESULTS.md) détaille les limites : aucun gain général démontré, aucun score global. « Non détecté » ne veut pas dire « faux », et « détecté » ne veut pas dire « fidèle ». Un texte incomplet reste indéterminé. Aucun contrôle humain n’est exigé pour utiliser ou reproduire cette version.

Méthode éditoriale : [FR](https://www.edikka.com/insights/seo/site-citable-ia) · [EN](https://www.edikka.com/en/insights/seo/ai-citable-website).

## Private collection / Collecte locale

Visitors never need a key. `collect.mjs` runs only through Node.js, with a private key read in memory. Never place a key or private raw responses in a published directory. The collector defaults to a dry run, uses the fixed OpenAI HTTPS endpoint, reserves the full request budget before sending, stops on the first technical failure and never retries automatically. Do not delete its persistent lock to repeat a collection.

```sh
# No network request:
node collect.mjs --experiment experiment.json --out /path/outside/website/private-results
# Only after independently approving costs and credentials:
node collect.mjs --experiment experiment.json --out /path/outside/website/private-results --key-file /path/outside/website/.env.local --execute
```

The frozen follow-up reserves USD 2.68425 for 12 maximum-length requests after subtracting the first series’ USD 0.31414 from the cumulative USD 10 ceiling. The new calculated cost was USD 0.10378. Actual usage was much smaller than the reserve. This script does not cap unrelated account spending or provider taxes. Retain every attempted run, including failures, and never present a replay as the original collection. A changed source or checker needs a new version and separately frozen experiment.


Stable release / Version stable: [v0.5.0](https://github.com/edikkaweb/citation-fidelity-lab/tree/v0.5.0) · [v0.4.0](https://github.com/edikkaweb/citation-fidelity-lab/tree/v0.4.0) · [v0.3.0](https://github.com/edikkaweb/citation-fidelity-lab/tree/v0.3.0) · [v0.2.0 archive](https://github.com/edikkaweb/citation-fidelity-lab/tree/v0.2.0).

Fragment experiment: `node retrieval/summarize.mjs` recomputes descriptive counts without a key. Its frozen `retrieval/experiment.json`, protocol, source hashes, complete prompts and source fragments are published. Do not rerun the historical collector on its original output directory.

Version 0.5: `node attached/summarize.mjs` recomputes the new diagnostic; `node --test test/*.test.mjs` checks the implementation. `attached/CONTINUATION.md` preserves the transport interruption; `attached-pilot/ERRATUM.md` explains the excluded pilot. No audio costs are included in experiment reports.

Version 0.6: `node anthropic/summarize.mjs` recomputes both provider summaries and the paired subset without API calls. The locally frozen protocol was not publicly preregistered.
