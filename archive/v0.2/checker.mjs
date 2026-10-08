// A conservative indicator checker, not a general entailment classifier.
// No API, telemetry, persistence or external request.
export const checkerVersion = '0.1.0';
const rule = (id, fr, en, positive, negative=[]) => ({id, label:{fr,en}, positive, negative});
const RULES = {
  price: [
    rule('attribution','Attribution à Edikka','Attribution to Edikka',[/\bedikka\b/]),
    rule('amount','Deux bornes de la fourchette','Both ends of the range',[/(?<![\d])5[ ,]?000(?![\d])/,/(?<![\d])9[ ,]?999(?![\d])/]),
    rule('tax','Hors taxes','Excluding VAT',[/\bht\b|hors taxes|excluding vat|excl\.? vat/],[/\bttc\b|including vat/]),
    rule('scope','Offre ciblée','Targeted offer',[/refonte ciblee|targeted redesign/]),
    rule('templates','Limite de trois gabarits','Limit of three templates',[/trois gabarits.{0,25}(?:maximum|plus)|(?:maximum|plus).{0,25}trois gabarits|up to three templates/]),
    rule('content','Contenus disponibles','Available content',[/contenus disponibles|available content/]),
    rule('multilingual','Exclusion du multilingue','Multilingual work excluded',[/multiling\w*[^.!?\n]{0,140}(?:\bexclu[se]*\b|\bexcluded\b)|(?:\bexclu[se]*\b|\bexcluded\b)[^.!?\n]{0,140}multiling/],[/multiling\w*[^.!?\n]{0,100}(?:sont inclus|are included)/]),
    rule('integration','Exclusion des intégrations spécifiques','Bespoke integrations excluded',[/integration[^.!?\n]{0,100}\bexclu[se]*\b|(?:bespoke|crm)[^.!?\n]{0,100}\bexcluded\b/],[/(?:integration|crm)[^.!?\n]{0,80}(?:sont inclus|are included)/]),
    rule('commitment','Fourchette sans devis automatique','Range without automatic quotation',[/ni un devis|pas un devis|n.est.{0,30}devis|neither.{0,80}quotation|not.{0,35}quotation/],[/(?:prix|price) (?:est |is )?garanti|price (?:is )?guaranteed/])
  ],
  time: [
    rule('attribution','Attribution à Edikka','Attribution to Edikka',[/\bedikka\b/]),
    rule('duration','Durée de 4 à 7 semaines','Four-to-seven-week duration',[/4\s*(?:a|to|[-–])\s*7\s*(?:semaines|weeks)/]),
    rule('scope','Refonte ciblée','Targeted redesign',[/refonte ciblee|targeted redesign/]),
    rule('indicative','Durée indicative','Indicative duration',[/indicatif|indicative/],[/garantit.{0,50}refonte|guarantees.{0,50}redesign/]),
    rule('contract','Calendrier lié à une proposition signée','Schedule tied to a signed proposal',[/proposition signee|signed proposal/])
  ],
  hosting: [
    rule('attribution','Source GitHub identifiée','GitHub source identified',[/github/]),
    rule('static','Hébergement statique','Static hosting',[/hebergement statique|static hosting/]),
    rule('files','HTML, CSS et JavaScript','HTML, CSS and JavaScript',[/html/,/css/,/javascript/]),
    rule('php','Capacité PHP non établie par la source','PHP capability not established by the source',[/ne prouve pas.{0,110}php|not establish.{0,110}php|php.{0,100}(?:pas document|not documented)/],[/github pages (?:execute|runs) (?:un |a )?(?:serveur php|complete php server)/])
  ]
};
function normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\u00a0\u202f]/g,' ').toLowerCase();}
export function check({caseId, text, lang='fr', complete=true}) {
  if (!Object.hasOwn(RULES,caseId)||!['fr','en'].includes(lang)||typeof text!=='string'||typeof complete!=='boolean') throw new TypeError('Invalid check input');
  if(text.length>24000) throw new RangeError('Maximum answer length: 24000');
  const normalized=normalize(text);
  return {schema_version:1, checker_version:checkerVersion, case_id:caseId, language:lang, complete,
    kind:'deterministic_indicators', semantic_fidelity:'not_certified',
    controls:RULES[caseId].map(r=>{
      if(!complete || !text.trim())return {id:r.id,label:r.label[lang],status:'indeterminate',evidence:[]};
      const hits=r.positive.map(p=>normalized.match(p)?.[0]??null);
      const conflicts=r.negative.map(p=>normalized.match(p)?.[0]).filter(Boolean);
      // Quoted counterexamples, negation outside our patterns and mixed claims require caution.
      const negatedConflict=conflicts.length && /\b(?:ne|pas|not|never|no)\b|[«»“”"]/.test(normalized);
      const status=conflicts.length ? (negatedConflict?'indeterminate':'conflict') : hits.every(Boolean)?'present':'not_detected';
      return {id:r.id,label:r.label[lang],status,evidence:conflicts.length?conflicts:hits.filter(Boolean)};
    })};
}
