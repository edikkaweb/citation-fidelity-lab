# Transport interruption and continuation · 9 October 2026

The first collection stopped after 78 attempts: 77 complete responses and one transport failure with no HTTP status or usage returned (`anthropic-attached-v2-hosting-fr-distributed-full-r1`). Known cost USD 0.529414; keep the unresolved USD 0.032428 reservation. Its raw record and original ledger are retained in `transport-interruption/`.

A read-only Models API check subsequently returned HTTP 200. This new plan selects exactly the 30 originally planned IDs that were never attempted. The failed ID is not retried or replaced. Prompts, source fragments, schema, model, effort, maximum tokens, prices, measurement code and order stay unchanged. The remaining budget subtracts both known costs and the unresolved reservation from the same USD 2 cap. Stop again on any technical error or uncertain usage.

The final report merges the two disjoint sets of run IDs and retains the failure in its denominator. This continuation is frozen before its first generation, not selected by the quality or direction of any completed response. No claim of public preregistration is made.

FR : un échec de transport est conservé sans réessai. Seuls les 30 essais jamais tentés sont repris après vérification du retour de la connexion. Les coûts connus et la réserve de l’échec restent imputés au même plafond de 2 USD.
