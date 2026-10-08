# Citation Fidelity Lab · Edikka

Compare a source passage with a restatement, condition by condition. Three cases (price, time, hosting), in French and English. This static demonstration runs entirely in the browser.

[Try the demo in French](https://edikkaweb.github.io/citation-fidelity-lab/) · [Try it in English](https://edikkaweb.github.io/citation-fidelity-lab/?lang=en)

**Release 0.1 contains authored teaching examples, not model responses. No citation lift, ranking benefit or overall fidelity score is claimed.** `results.json` deliberately contains zero collected runs. A detected expression is an indicator, not an entailment judgment.

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
- [Experiment status](results.json): collected data is separate from teaching examples.
- `test/checker.test.mjs`: preservation of facts, incomplete outputs, number boundaries, tax contradictions, quoted counterexamples and unknown paraphrases.

No tracking, cookies, browser storage or model calls are included. The JSON download happens only when the visitor requests it and contains their entered text. Outbound source links leave the demo. A hosting provider can still keep ordinary access logs.

Code is MIT-licensed. Edikka-authored corpus passages and teaching answers are CC BY 4.0 (credit: “Edikka, Citation Fidelity Lab, version 0.1, 2026-10-08”). Linked third-party documents retain their own rights; this repository does not relicense them. Source passages here are editorial paraphrases, not verbatim quotations. See [LICENSE](LICENSE).

## Français

Ce laboratoire rapproche une information de sa reprise, sans note globale. Les trois cas sont bilingues et le code fonctionne sans serveur applicatif ni clé API. Les deux variantes de chaque cas contiennent **exactement les mêmes phrases**, ordonnées différemment.

Les réponses proposées sont écrites pour la démonstration. Elles n'ont pas été obtenues auprès d'une IA. Les repères automatiques ne comprennent pas toutes les négations ou reformulations : « non détecté » ne veut pas dire « faux », et « détecté » ne veut pas dire « fidèle ». Un texte incomplet reste indéterminé. Aucun contrôle humain n'est exigé pour utiliser ou reproduire cette version.

Méthode éditoriale : [FR](https://www.edikka.com/insights/seo/site-citable-ia) · [EN](https://www.edikka.com/en/insights/seo/ai-citable-website).
