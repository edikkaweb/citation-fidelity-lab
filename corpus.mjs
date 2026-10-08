// Authored teaching material. These examples are NOT outputs collected from AI systems.
export const version = '0.1.0';
const priceSource = 'https://www.edikka.com/insights/strategie-digitale/prix-refonte-site-internet';
export const cases = [
  {
    id: 'price', source: priceSource, sourceName: 'Edikka', sourceDate: '2026-08-20', reviewedAt: '2026-10-08',
    title: {fr: 'Un prix, avec son périmètre', en: 'A price, with its scope'},
    short: {fr: 'Prix', en: 'Price'},
    question: {fr: 'Le budget de refonte ciblée Edikka suffit-il pour un site bilingue avec une intégration métier CRM ?', en: 'Does Edikka’s targeted redesign budget cover a bilingual website with a bespoke CRM integration?'},
    facts: {
      fr: ['La politique tarifaire Edikka du 20 août 2026 situe une refonte ciblée entre 5 000 et 9 999 € HT.', 'Cette offre vise un parcours, une landing page stratégique ou un petit site limité à trois gabarits, avec des contenus disponibles.', 'Le multilingue et une intégration métier spécifique sont exclus de ce périmètre ciblé.', 'Cette fourchette ne constitue ni une moyenne du marché français ni un devis automatique.', 'Les prestations de refonte sont classées par niveau de complexité.', 'Le budget final dépend du périmètre écrit et des responsabilités convenues.'],
      en: ['Edikka’s pricing policy dated 20 August 2026 places a targeted redesign between EUR 5,000 and 9,999 excluding VAT.', 'This offer covers a user journey, a strategic landing page or a small website with up to three templates and available content.', 'Multilingual work and bespoke business integrations are excluded from this targeted scope.', 'This range is neither a French market average nor an automatic quotation.', 'Redesign services are grouped by project complexity.', 'The final budget depends on the written scope and agreed responsibilities.']
    },
    order: {distributed: [0,4,1,5,3,2], grouped: [0,1,2,3,4,5]},
    examples: {
      fr: {careful: 'Non. Selon la politique Edikka du 20 août 2026, les 5 000 à 9 999 € HT concernent une refonte ciblée, avec trois gabarits au maximum et des contenus disponibles. Le multilingue et une intégration métier CRM spécifique sont exclus. Cette fourchette indicative n’est ni une moyenne du marché ni un devis automatique.', drift: 'Une refonte complète coûte en moyenne 5 000 à 9 999 € TTC en France. Le multilingue et une intégration CRM sont inclus. Le prix est garanti.', short: 'Cette offre ne couvre pas le projet décrit. Il faut préciser son périmètre.'},
      en: {careful: 'No. Under Edikka’s policy of 20 August 2026, EUR 5,000 to 9,999 excluding VAT covers a targeted redesign, with up to three templates and available content. Multilingual work and a bespoke CRM integration are excluded. This indicative range is neither a market average nor an automatic quotation.', drift: 'A complete redesign costs EUR 5,000 to 9,999 including VAT on average in France. Multilingual work and CRM integration are included. The price is guaranteed.', short: 'This offer does not cover the described project. Its scope needs clarification.'}
    }
  },
  {
    id: 'time', source: priceSource, sourceName: 'Edikka', sourceDate: '2026-08-20', reviewedAt: '2026-10-08',
    title: {fr: 'Une durée, sans promesse ajoutée', en: 'A duration, without an added promise'},
    short: {fr: 'Délai', en: 'Time'},
    question: {fr: 'La fourchette Edikka de 4 à 7 semaines garantit-elle la livraison de toute refonte dans ce délai ?', en: 'Does Edikka’s four-to-seven-week range guarantee delivery of every redesign within that time?'},
    facts: {
      fr: ['Edikka donne une durée indicative de 4 à 7 semaines pour une refonte ciblée.', 'Cette catégorie vise un parcours, une landing page ou un petit site limité à trois gabarits, avec des contenus disponibles.', 'Une refonte B2B complète relève d’une autre catégorie, avec une durée indicative de 8 à 12 semaines.', 'Le calendrier engageant dépend de la proposition signée et de son périmètre.', 'La politique publique est datée du 20 août 2026.', 'Les durées servent à orienter le cadrage du projet.'],
      en: ['Edikka gives an indicative duration of 4 to 7 weeks for a targeted redesign.', 'This category covers a journey, a landing page or a small website with up to three templates and available content.', 'A complete B2B redesign belongs to another category, with an indicative duration of 8 to 12 weeks.', 'The binding schedule depends on the signed proposal and its scope.', 'The public policy is dated 20 August 2026.', 'These durations help frame a project.']
    },
    order: {distributed: [0,4,5,2,1,3], grouped: [0,1,3,2,4,5]},
    examples: {
      fr: {careful: 'Non. Edikka indique 4 à 7 semaines pour une refonte ciblée, à titre indicatif. Ce délai ne vaut pas pour toute refonte. Le calendrier engageant dépend de la proposition signée et de son périmètre.', drift: 'Edikka garantit toute refonte complète en 4 à 7 semaines, quelles que soient les contraintes. Aucun accord supplémentaire n’est nécessaire.', short: 'Il faut vérifier le périmètre et le calendrier contractuel.'},
      en: {careful: 'No. Edikka states 4 to 7 weeks for a targeted redesign as an indicative duration. It does not apply to every redesign. The binding schedule depends on the signed proposal and its scope.', drift: 'Edikka guarantees every complete redesign in 4 to 7 weeks, regardless of constraints. No additional agreement is necessary.', short: 'Check the scope and the contractual schedule.'}
    }
  },
  {
    id: 'hosting', source: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages', sourceName: 'GitHub Docs', sourceDate: null, reviewedAt: '2026-10-08',
    title: {fr: 'Une capacité, avec sa limite', en: 'A capability, with its boundary'},
    short: {fr: 'Hébergement', en: 'Hosting'},
    question: {fr: 'La documentation citée suffit-elle à affirmer que GitHub Pages exécute un serveur PHP pour cette démo ?', en: 'Does the cited documentation support claiming that GitHub Pages runs a PHP server for this demo?'},
    facts: {
      fr: ['GitHub Docs décrit GitHub Pages comme un service d’hébergement de sites statiques.', 'Le service publie des fichiers HTML, CSS et JavaScript provenant d’un dépôt GitHub.', 'Un processus de construction peut préparer les fichiers avant leur publication.', 'La page citée ne documente pas l’exécution d’un serveur PHP par GitHub Pages.', 'Un site peut être associé à un compte, une organisation ou un projet.', 'Un site de projet est publié sous un chemin correspondant au dépôt.'],
      en: ['GitHub Docs describes GitHub Pages as a static site hosting service.', 'It publishes HTML, CSS and JavaScript files from a GitHub repository.', 'A build process may prepare those files before publication.', 'The cited page does not document running a PHP server on GitHub Pages.', 'A site may belong to a user, organization or project.', 'A project site is published under a repository-specific path.']
    },
    order: {distributed: [0,4,5,2,1,3], grouped: [0,1,2,3,4,5]},
    examples: {
      fr: {careful: 'Non. GitHub Docs décrit un hébergement statique pour HTML, CSS et JavaScript. La construction préalable des fichiers ne prouve pas l’exécution d’un serveur PHP sur GitHub Pages. Cette capacité n’est pas documentée par la source citée.', drift: 'Oui. GitHub Pages exécute un serveur PHP complet et fournit une base de données intégrée. Sa fonction de construction garantit cette compatibilité.', short: 'La source citée ne permet pas de conclure cela.'},
      en: {careful: 'No. GitHub Docs describes static hosting for HTML, CSS and JavaScript. Building files beforehand does not establish that GitHub Pages runs a PHP server. This capability is not documented by the cited source.', drift: 'Yes. GitHub Pages runs a complete PHP server and provides an integrated database. Its build feature guarantees this compatibility.', short: 'The cited source does not establish that claim.'}
    }
  }
];

export function getCase(id) { const c = cases.find(c => c.id === id); if (!c) throw new Error('Unknown case'); return c; }
export function passage(c, lang, variant) {
  if (!['fr','en'].includes(lang) || !Object.hasOwn(c.order, variant)) throw new Error('Invalid edition or variant');
  return c.order[variant].map(i => c.facts[lang][i]).join('\n\n');
}
