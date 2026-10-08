# Citation Fidelity Lab · Edikka

Compare a source passage with a restatement, condition by condition. Three cases (price, time, hosting), in French and English. This static demonstration runs entirely in the browser.

[Try the demo in French](https://edikkaweb.github.io/citation-fidelity-lab/) · [Try it in English](https://edikkaweb.github.io/citation-fidelity-lab/?lang=en)

**Release 0.2 includes 36 real GPT-6 Astra API answers, collected on 2026-10-08, alongside separately labelled teaching examples.** All 36 completed; estimated API usage cost: USD 0.31414 before tax. No citation lift, ranking benefit or overall fidelity score is claimed. [Read the bilingual results and limitations](RESULTS.md). The frozen checker misses paraphrases, and the duration case contains a referential ambiguity introduced by sentence order. This series does not isolate formatting alone.

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
- [All 36 experiment records](results.json): exact prompts, answers, options, timestamps, usage and indicators.
- [Frozen collection plan](experiment.json): hashes, order, budget and model settings.
- [Results and limitations](RESULTS.md) and [condition counts](summary.json).
- `node summarize.mjs`: verify every prompt and recompute indicators locally, without an API call.
- `test/checker.test.mjs`: preservation of facts, incomplete outputs, number boundaries, tax contradictions, quoted counterexamples and unknown paraphrases.

The browser interface includes no tracking, cookies, browser storage or model calls. It loads the published experiment records from the same site. The JSON download happens only when the visitor requests it and contains their entered text. Outbound source links leave the demo. A hosting provider can still keep ordinary access logs.

Code is MIT-licensed. Edikka-authored corpus passages and teaching answers are CC BY 4.0 (credit: “Edikka, Citation Fidelity Lab, version 0.1, 2026-10-08”). Linked third-party documents retain their own rights; this repository does not relicense them. Source passages here are editorial paraphrases, not verbatim quotations. See [LICENSE](LICENSE).

## Français

Ce laboratoire rapproche une information de sa reprise, sans note globale. Les trois cas sont bilingues et le code fonctionne sans serveur applicatif ni clé API. Les deux variantes de chaque cas contiennent **exactement les mêmes phrases**, ordonnées différemment.

La version 0.2 propose aussi 36 réponses réelles de GPT-6 Astra, collectées le 8 octobre 2026 : 36 appels complets, aucun échec technique, coût calculé de 0,31414 USD hors taxes. Les exemples rédigés et les réponses collectées portent des libellés distincts. [Le rapport](RESULTS.md) conserve les limites des règles et l’ambiguïté de référence découverte dans le cas du délai ; aucun gain général n’est démontré. Les repères automatiques ne comprennent pas toutes les négations ou reformulations : « non détecté » ne veut pas dire « faux », et « détecté » ne veut pas dire « fidèle ». Un texte incomplet reste indéterminé. Aucun contrôle humain n'est exigé pour utiliser ou reproduire cette version.

Méthode éditoriale : [FR](https://www.edikka.com/insights/seo/site-citable-ia) · [EN](https://www.edikka.com/en/insights/seo/ai-citable-website).

## Private collection / Collecte locale

Visitors never need a key. `collect.mjs` runs only through Node.js, with a private key read in memory. Never place a key or private raw responses in a published directory. The collector defaults to a dry run, uses the fixed OpenAI HTTPS endpoint, reserves the full request budget before sending, stops on the first technical failure and never retries automatically. Do not delete its persistent lock to repeat a collection.

```sh
# No network request:
node collect.mjs --experiment experiment.json --out /path/outside/website/private-results
# Only after independently approving costs and credentials:
node collect.mjs --experiment experiment.json --out /path/outside/website/private-results --key-file /path/outside/website/.env.local --execute
```

The frozen experiment reserves USD 8.060034 for 36 maximum-length requests, within a USD 10 ceiling. Actual usage was much smaller. This script does not cap unrelated account spending or provider taxes. Retain every attempted run, including failures, and never present a replay as the original collection. A changed source or checker needs a new version and separately frozen experiment.
