# Claude replication / Réplication Claude · 9 October 2026

Action 602. Separate series, frozen before generation. The original OpenAI series, pilot, failed request and continuation are retained byte-for-byte.

## Design

108 planned calls: three authored cases × FR/EN × A/B/C × retrieved/full text × three repetitions. Import `attached/collect.mjs:makePlan` unchanged. Every question, supplied sentence, sentence/condition map, neutral category label, user prompt, JSON schema and run order is identical to the published attached-v2 plan. Each new run records its original run ID. The same frozen lexical retriever and measurement code are imported, never copied or adapted to results.

Provider: Anthropic Messages API; model `claude-sonnet-5-5`, verified available in the authenticated Models API on 9 October 2026. Standard service, adaptive thinking, explicit medium effort, maximum 1,600 total output tokens, no tools, no browsing, no prompt caching requested. The input is one user message. The original JSON schema is passed as `output_config.format`. These are provider-specific settings: medium effort, tokenizer, constrained decoding and output budgets are not guaranteed equivalent across providers. This compares these two configured models, not all OpenAI/Claude products or consumer interfaces.

## Budget and failures

Separate cap: USD 2 before tax. Sonnet 5.5 published rates on 9 October 2026: input $2, output $10, cache writes $2.50 (5m) / $4 (1h), cache reads $0.10 per million tokens. No paid tools, fast mode or regional premium. Before each sequential request, reserve all request JSON UTF-8 bytes plus 1,024 framing tokens at the higher $4 input rate and 1,600 output tokens at $10. Settle only with valid returned usage. Keep the full reservation for unknown usage, stop on transport/HTTP failure, incomplete output, invalid schema shape, unexpected model, exceeded reservation or insufficient headroom. No automatic retry, no favourable-result selection; unattempted calls remain visible. If interrupted, the ledger retains the in-flight reservation. No second process may reuse the output directory.

The sum of all worst-case reservations can exceed $2: this is a sequential cap, not a promise that every possible response fits the budget. Cost estimates from usage are not invoices. Acquisition of credits is outside the series cost.

## Measurement and comparison

Reuse `attached/measure.mjs` and the exported summary function. Exact quote, sentence/condition association, unavailable-category declaration, false available/unavailable declarations and list consistency are separate checks. Validate structured shape before counting a response. Preserve adverse outputs; do not infer a semantic hallucination rate from category disagreements. The diagnostic explicitly asks about missing information, so it is not a measure of spontaneous disclosure.

Report all valid responses for each model and a separate paired subset where both produced a complete valid response for the same planned input/repetition. State both denominators. Repetitions are not independent articles. There are three synthetic cases and one model per provider; no model ranking, significance claim, general GEO rule or web-citation uplift follows.

Retrieval counts are deterministic and therefore identical between providers. In C, putting conditions inside an indivisible sentence can mechanically preserve them, but hosting still supplies only 1/4 in the chosen fragment. C also changes length and redundancy; this design cannot isolate proximity.

## Sources

- [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing), consulted 9 October 2026.
- [Models](https://platform.claude.com/docs/en/models/overview), consulted 9 October 2026.
- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), consulted 9 October 2026.
- [Thinking and cost](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost), consulted 9 October 2026.

FR : réplication exploratoire distincte, mêmes entrées et mêmes règles ; écarts de paramètres fournisseurs documentés. Aucun résultat historique réécrit. Les secrets restent dans le fichier privé local.
