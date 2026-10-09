# Attached conditions and declared missing information · protocol v1

Action 602. FR/EN. Freeze before any call. This is a new experiment; the earlier 36, 12 and 72 answers remain unchanged and separate.

## Intervention and scope

Three authored cases (price, duration, hosting); the same questions, sources, four condition definitions and six source sentences per variant. A and B retain the original sentences and ordering. C uses B’s order, replacing the numeric sentences in price/duration and the principal hosting claim with a self-contained statement carrying all four conditions. Those replacements intentionally repeat information: sentence count stays at six, but length and redundancy change. This experiment cannot isolate proximity from repetition or length. The exact edits and condition-to-sentence map are in corpus.mjs. No C wording is adjusted after retrieval or generation results are observed.

The existing lexical retriever is imported unchanged: three source sentences per fragment, one fragment selected; full-text control. It ranks matching query terms divided by the square root of fragment term count, with source-order ties. It treats each authored source sentence as indivisible. Conditions fitting in one sentence therefore travel together by construction. A 4/4 result under this rule is not an independent proof of a GEO writing rule, robustness to token-based splitting, search-engine behaviour or web citation uplift. All two/three-sentence and one/two-fragment settings are also published as retrieval-only sensitivity checks.

## Runs

3 cases × 2 languages × 3 variants × 2 input modes × 3 repetitions = 108 planned calls, one provider (OpenAI), GPT-6 Astra, medium reasoning, 1,600 maximum output tokens, standard service, no tools, no stored conversations. Order is rotated by repetition and language. No automatic retry, no replacement of adverse outputs. Claude is not run until its access and separate budget are authorized. A later provider replication must be explicitly separate.

The revised prompt asks for an answer and an availability declaration for each of four named information categories, plus a list of categories not available in the supplied text. Category labels contain no withheld factual values, but asking them explicitly is itself an intervention: findings describe an instructed diagnostic, not spontaneous behaviour.

## Measurements

1. Conditions supplied: deterministic union of the prespecified condition IDs carried by selected sentences.
2. Missing-condition recognition: among truly absent condition opportunities, count declarations `not_available`; report denominator, false `available` declarations and available conditions incorrectly declared missing separately. Do not treat a false availability declaration alone as a semantic hallucination in the prose answer.
3. Evidence: supplied sentence ID, a quote of at least 16 characters after whitespace normalization, exact substring, and prespecified sentence/condition association. This does not certify that the quote entails every claim in the answer. Check consistency between the per-condition declaration and the unavailable list.
4. Technical validity: completed output, JSON shape, four unique categories, usage and cost; incomplete/failed outputs excluded from successful-response denominators but retained and reported. No broad semantic accuracy or hallucination score, mandatory human jury or publication selection by favourable outcome.

## Budget and stopping

The previous estimated OpenAI spending is USD 1.43470 before tax, within the already authorized USD 10 cumulative cap. Reserve USD 0.50 for two short audio capsules; experiment spending must remain within USD 9.50 cumulative. Before each sequential call, reserve a conservative upper bound using all request JSON UTF-8 bytes plus 1,024 framing tokens at the cache-write input rate and the maximum output tokens. Release a reservation only after valid usage is known. Stop on unknown usage, technical failure, incomplete output, or insufficient budget for the next call. The full-plan worst-case reservation may exceed remaining credit; the plan is never silently reduced, and unattempted runs are reported. No request starts without room for its worst case. USD 2 is not claimed as a guaranteed series cost.

Frozen rates: input $10, cached input $1, cache write $12.50, output $50 per million tokens; official pricing checked 8 October 2026. Keys stay in the private local env file. Public records contain authored source text and model outputs, never credentials or private user text.

## Interpretation / lecture

FR : comparer les trois rédactions sous ce découpage précis ; compter séparément disponibilité, absence déclarée et preuve exacte. Une phrase plus longue et répétée peut mécaniquement contenir plus de conditions. La mesure ne prouve pas que le modèle signale spontanément tous les manques ni qu’un moteur citera la page.
EN: compare the three authored layouts under this particular splitting rule. Availability, declared absence and exact evidence are separate outcomes. A longer, repeated sentence may mechanically carry more conditions. These measurements establish neither spontaneous missing-information detection nor future search citations.
