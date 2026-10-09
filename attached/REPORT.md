# Attached conditions / Conditions attachées · results

[Protocol](PROTOCOL.md) · [Frozen plan](experiment.json) · [Transport continuation](CONTINUATION.md) · [All responses](results.json) · [Summary](summary.json) · [Explorer](https://edikkaweb.github.io/citation-fidelity-lab/attached/) · [Your text](https://edikkaweb.github.io/citation-fidelity-lab/workbench/)

## Français

**C conserve 4/4 conditions pour le prix et le délai, mais seulement 1/4 pour l’hébergement.** Ces comptes décrivent les conditions fournies avant génération, avec trois phrases par fragment et un fragment retenu. A donne respectivement 2/4, 1/4, 3/4 ; B donne 3/4, 3/4, 1/4. Les résultats sont identiques en FR/EN. Chaque témoin complet fournit 4/4.

C remplace les phrases-chiffres (et l’affirmation principale d’hébergement) par une phrase autonome portant les quatre conditions. Elle change aussi la longueur et répète des informations. Notre découpeur garde chaque phrase entière : le transport conjoint des conditions est donc en partie mécanique. **Ce n’est pas une règle GEO universelle démontrée.** Le mauvais résultat hébergement est conservé ; aucun réglage favorable n’est sélectionné après coup. Les 72 réglages de sensibilité sont dans la synthèse, sans appel de modèle supplémentaire.

**Absences déclarées.** Sur 83 occasions où un identifiant de condition était absent de l’entrée selon le codage préalable des réponses complètes, 74 déclarations la signalent comme indisponible ; 9 la déclarent disponible contrairement à ce codage. Parmi 345 conditions fournies, 10 sont déclarées absentes. 0 déclarations contredisent leur liste « indisponibles ». La consigne demande explicitement ce diagnostic : ce résultat ne mesure pas un comportement spontané et ne constitue pas un taux d’hallucination du texte libre.

**Extraits.** 0/344 extraits ne sont pas des sous-chaînes exactes valides. 9 autres déclarations ont un extrait exact, mais provenant d’une phrase non associée à la condition dans le codage préalable. Le contrôle combiné relève 9/344 preuves non validées. Le contrôle impose un identifiant fourni, une association condition/phrase prédéfinie et une sous-chaîne d’au moins 16 caractères, espaces normalisés. Il ne garantit pas que l’extrait soutient sémantiquement toute la réponse.

**Limite du diagnostic.** Les catégories peuvent se recouper. Dans les trois essais prix EN/A/récupéré, F3 est déclarée disponible en citant le périmètre de S2, alors que la réponse dit que le bilingue et le CRM ne sont pas précisés. Une discordance au codage n’est donc pas à elle seule une invention ni un échec à signaler le manque dans le texte libre. Aucun taux de fidélité sémantique n’est déduit. [Note de lecture](MEASUREMENT-NOTE.md).

**Collecte :** 108/108 tentés, 107 complets, 1 échecs, 0 incomplets, 0 non tentés. Le premier appel a échoué au transport, usage inconnu, sans réessai. Les 107 appels restants ont leur plan de continuation figé. Le pilote de 45 réponses et un appel interrompu reste [archivé séparément](../attached-pilot/ERRATUM.md) : ses libellés révélaient des parties des conditions. Aucun de ses résultats n’entre dans les dénominateurs ci-dessus.

**Coûts USD HT estimés :** 3.88557 connus pour cette série ; 7.1806 connus pour toutes les séries, pilote compris. Réserves pour usages incertains : 0.255738. Montant imputé au plafond avant audio : 7.436338. Les réserves ne sont pas présentées comme une facture. Un seul fournisseur ; Claude n’a pas été testé.

## English

**C supplies 4/4 conditions for price and duration, but only 1/4 for hosting.** These are input availability counts under the frozen three-sentence, top-one retriever, equal in both languages. A supplies 2/4, 1/4, 3/4 and B supplies 3/4, 3/4, 1/4 respectively. Every full-text control supplies 4/4. C also changes length and repetition. Sentences remain indivisible, making joint condition transport partly mechanical. No universal GEO writing rule or web citation uplift is established. All 72 retrieval-only sensitivity settings and the adverse hosting result are retained.

Of 83 condition opportunities absent under the prespecified coding in completed responses, 74 are correctly declared unavailable and 9 available contrary to the coding. Of 345 supplied conditions, 10 are falsely declared missing. 0 availability statements conflict with their missing-condition list. This explicitly requested diagnostic does not measure spontaneous behaviour or semantic hallucination in the prose answer. 0/344 quotes fail the exact substring check; 9 other quotes are exact but use a sentence not associated with that condition in the prespecified coding. Categories can overlap: all three price EN/A/retrieved answers flag missing bilingual/CRM coverage in prose while classifying F3 as available from a scope sentence. This is a coding discrepancy, not proof of hallucination. Substring checks do not certify entailment. See [measurement note](MEASUREMENT-NOTE.md).

Collection: 108/108 attempted, 107 complete, 1 failed, 0 incomplete, 0 unattempted. The initial transport failure is retained without retry; the remaining requests use a frozen continuation. The biased 45-response pilot is archived and excluded. One provider, no Claude comparison. Estimated known costs: USD 3.88557 for this series, USD 7.1806 for all series including pilot, plus USD 0.255738 in unresolved reservations; USD 7.436338 charged against the budget before audio, not an invoice.

## Every experimental condition / Toutes les conditions expérimentales

Counts describe independent repetitions, not a robust population-rate estimate. Zero-denominator missing-condition groups are not evidence of missingness recognition.

| Case | Lang | Input | Variant | Supplied | Complete / planned | Missing correctly declared / absent | Available against coding | Unavailable against coding | Combined evidence failures / available declarations |
|---|---|---|---|---|---|---|---|---|---|
| price | fr | retrieved | A | 2/4 | 3/3 | 6/6 | 0 | 0 | 0/6 |
| price | fr | retrieved | B | 3/4 | 2/3 | 2/2 | 0 | 0 | 0/6 |
| price | fr | retrieved | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | fr | full | A | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | fr | full | B | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | fr | full | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | en | retrieved | A | 2/4 | 3/3 | 3/6 | 3 | 0 | 3/9 |
| price | en | retrieved | B | 3/4 | 3/3 | 3/3 | 0 | 0 | 0/9 |
| price | en | retrieved | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | en | full | A | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | en | full | B | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| price | en | full | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | fr | retrieved | A | 1/4 | 3/3 | 6/9 | 3 | 0 | 3/6 |
| time | fr | retrieved | B | 3/4 | 3/3 | 3/3 | 0 | 0 | 0/9 |
| time | fr | retrieved | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | fr | full | A | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | fr | full | B | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | fr | full | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | en | retrieved | A | 1/4 | 3/3 | 6/9 | 3 | 0 | 3/6 |
| time | en | retrieved | B | 3/4 | 3/3 | 3/3 | 0 | 0 | 0/9 |
| time | en | retrieved | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | en | full | A | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | en | full | B | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| time | en | full | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| hosting | fr | retrieved | A | 3/4 | 3/3 | 3/3 | 0 | 0 | 0/9 |
| hosting | fr | retrieved | B | 1/4 | 3/3 | 9/9 | 0 | 1 | 0/2 |
| hosting | fr | retrieved | C | 1/4 | 3/3 | 9/9 | 0 | 0 | 0/3 |
| hosting | fr | full | A | 4/4 | 3/3 | 0/0 | 0 | 3 | 0/9 |
| hosting | fr | full | B | 4/4 | 3/3 | 0/0 | 0 | 3 | 0/9 |
| hosting | fr | full | C | 4/4 | 3/3 | 0/0 | 0 | 3 | 0/9 |
| hosting | en | retrieved | A | 3/4 | 3/3 | 3/3 | 0 | 0 | 0/9 |
| hosting | en | retrieved | B | 1/4 | 3/3 | 9/9 | 0 | 0 | 0/3 |
| hosting | en | retrieved | C | 1/4 | 3/3 | 9/9 | 0 | 0 | 0/3 |
| hosting | en | full | A | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| hosting | en | full | B | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |
| hosting | en | full | C | 4/4 | 3/3 | 0/0 | 0 | 0 | 0/12 |

Recompute: `node attached/summarize.mjs`. Code MIT, authored material CC BY 4.0. Historical protocols and outputs remain separate and unchanged.
