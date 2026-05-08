import { PenTool, Palette, Code2, Map, Compass, BrainCircuit, type LucideIcon } from 'lucide-react';

export interface Discipline {
  slug: string;
  num: string;
  icon: LucideIcon;
  title: string;
  tag: string;
  desc: string;
  intro: string;
  offerings: string[];
  process: { step: string; title: string; description: string }[];
  deliverables: string[];
  tools: string[];
}

export const disciplines: Discipline[] = [
  {
    slug: 'design-graphique',
    num: '01',
    icon: PenTool,
    title: 'Design graphique',
    tag: 'Identité',
    desc: "Logos, chartes, supports imprimés et digitaux qui ancrent votre marque dans le réel.",
    intro:
      "Nous concevons des identités visuelles solides, pensées pour durer et se décliner sur tous vos supports. Chaque pièce — du logotype à la signalétique — est dessinée à la main avant d'être affinée en numérique pour garantir une cohérence parfaite.",
    offerings: [
      "Création et refonte de logotype",
      "Charte graphique complète (typographie, couleurs, grilles)",
      "Édition imprimée : plaquettes, rapports, packaging",
      "Supports événementiels et signalétique",
      "Templates réseaux sociaux et présentations",
    ],
    process: [
      { step: '01', title: 'Brief & moodboard', description: "Cadrage des valeurs, des cibles et des références visuelles." },
      { step: '02', title: 'Exploration', description: "Trois à cinq pistes graphiques distinctes pour ouvrir le champ." },
      { step: '03', title: 'Affinage', description: "Itérations sur la piste retenue jusqu'au logo final." },
      { step: '04', title: 'Livrables', description: "Charte PDF + fichiers vectoriels + déclinaisons prêtes à l'emploi." },
    ],
    deliverables: ["Charte graphique 30+ pages", "Logo en .ai, .svg, .png, .pdf", "Templates print et digitaux"],
    tools: ["Adobe Illustrator", "InDesign", "Figma", "Procreate"],
  },
  {
    slug: 'strategie-de-marque',
    num: '02',
    icon: Palette,
    title: 'Stratégie de marque',
    tag: 'Brand',
    desc: "Positionnement, voix, narration. Un récit qui tient debout sur dix ans.",
    intro:
      "Avant le visuel, le verbe. Nous construisons la plateforme de marque qui aligne votre vision, votre offre et votre marché. Une trame narrative claire qui guide ensuite toutes vos prises de parole.",
    offerings: [
      "Audit de marque et benchmark concurrentiel",
      "Plateforme de marque (mission, vision, valeurs)",
      "Architecture de marque et naming",
      "Ton de voix et messages clés",
      "Storytelling et narratif d'entreprise",
    ],
    process: [
      { step: '01', title: 'Immersion', description: "Entretiens dirigeants, équipes et clients." },
      { step: '02', title: 'Diagnostic', description: "Cartographie des forces, faiblesses et opportunités." },
      { step: '03', title: 'Plateforme', description: "Rédaction du document de référence." },
      { step: '04', title: 'Activation', description: "Déclinaison opérationnelle sur vos canaux." },
    ],
    deliverables: ["Plateforme de marque", "Guide éditorial", "Plan d'activation 12 mois"],
    tools: ["Notion", "Miro", "Frameworks Brand Pyramid, Golden Circle"],
  },
  {
    slug: 'web-application',
    num: '03',
    icon: Code2,
    title: 'Web & application',
    tag: 'Code',
    desc: 'Sites éditoriaux, e-commerce et applications sur mesure, pensés pour durer.',
    intro:
      "Du site vitrine éditorial à l'application métier, nous développons des produits robustes, accessibles et performants. Architecture moderne, code maintenable, hébergement maîtrisé.",
    offerings: [
      "Sites vitrines et éditoriaux",
      "Plateformes e-commerce",
      "Applications web métier (SaaS, dashboards)",
      "Applications mobiles iOS / Android",
      "Intégration de CMS et headless",
    ],
    process: [
      { step: '01', title: 'Cadrage', description: "User stories, wireframes, choix techniques." },
      { step: '02', title: 'Design UI', description: "Maquettes haute fidélité et design system." },
      { step: '03', title: 'Développement', description: "Sprints hebdomadaires avec démos régulières." },
      { step: '04', title: 'Mise en ligne', description: "Recette, déploiement, formation, suivi." },
    ],
    deliverables: ["Code source documenté", "Design system Figma", "Documentation technique"],
    tools: ["React", "Next.js", "TypeScript", "Tailwind", "Supabase", "PostgreSQL"],
  },
  {
    slug: 'cartographie-sig',
    num: '04',
    icon: Map,
    title: 'Cartographie SIG',
    tag: 'Géo',
    desc: 'Cartes thématiques, modélisation 3D du territoire et tableaux de bord SIG.',
    intro:
      "Nous structurons la donnée géographique pour la transformer en outil de pilotage. Cartes thématiques imprimées, web-maps interactives, modèles 3D du terrain : chaque livrable répond à une décision concrète.",
    offerings: [
      "Cartes thématiques et atlas",
      "Web-maps interactives (Leaflet, Mapbox)",
      "Modélisation 3D du territoire",
      "Tableaux de bord SIG métier",
      "Bases de données géographiques",
    ],
    process: [
      { step: '01', title: 'Collecte', description: "Données ouvertes, terrain, drone." },
      { step: '02', title: 'Structuration', description: "Modèle de données, géocodage, contrôle qualité." },
      { step: '03', title: 'Cartographie', description: "Sémiologie, mise en page, validation." },
      { step: '04', title: 'Diffusion', description: "Publication web, impression, formation." },
    ],
    deliverables: ["Cartes haute résolution", "Geodatabase QGIS / PostGIS", "Tableaux de bord en ligne"],
    tools: ["QGIS", "PostGIS", "Mapbox", "Leaflet", "ArcGIS"],
  },
  {
    slug: 'arpentage',
    num: '05',
    icon: Compass,
    title: 'Arpentage',
    tag: 'Terrain',
    desc: 'Levés topographiques de précision, implantation et suivi de chantier.',
    intro:
      "Nos équipes interviennent sur le terrain avec station totale et GPS RTK pour produire des levés haute précision. Bornage, implantation, métré, suivi de chantier : la donnée juste, au bon moment.",
    offerings: [
      "Levés topographiques (planimétriques et altimétriques)",
      "Bornage et délimitation foncière",
      "Implantation d'ouvrages",
      "Métrés et calculs de cubature",
      "Suivi de chantier et récolement",
    ],
    process: [
      { step: '01', title: 'Reconnaissance', description: "Visite préalable et calage des objectifs." },
      { step: '02', title: 'Mesures', description: "Acquisition au GPS RTK et station totale." },
      { step: '03', title: 'Traitement', description: "Calculs, contrôles, dessin du plan." },
      { step: '04', title: 'Restitution', description: "Plans cotés et procès-verbaux signés." },
    ],
    deliverables: ["Plans topographiques DWG / PDF", "Procès-verbaux de bornage", "Modèles numériques de terrain"],
    tools: ["Station totale robotisée", "GPS RTK", "Drone photogrammétrique", "AutoCAD", "Covadis"],
  },
  {
    slug: 'conseil-ia',
    num: '06',
    icon: BrainCircuit,
    title: 'Conseil IA',
    tag: 'IA',
    desc: "Audit, automatisations LLM, analyses prédictives intégrées à vos outils métier.",
    intro:
      "Nous identifions les cas d'usage IA à fort impact dans vos opérations, puis nous les industrialisons. Pas de gadget : des automatisations mesurables qui font gagner des heures et fiabilisent vos données.",
    offerings: [
      "Audit des cas d'usage IA dans l'entreprise",
      "Automatisations LLM (assistants, extraction, synthèse)",
      "Modèles prédictifs et scoring",
      "Intégration IA dans vos outils existants",
      "Formation des équipes à l'IA générative",
    ],
    process: [
      { step: '01', title: 'Audit', description: "Cartographie des processus et opportunités." },
      { step: '02', title: 'Prototypage', description: "POC sur le cas d'usage prioritaire." },
      { step: '03', title: 'Industrialisation', description: "Mise en production sécurisée." },
      { step: '04', title: 'Suivi', description: "Mesure d'impact et amélioration continue." },
    ],
    deliverables: ["Rapport d'audit", "Prototype fonctionnel", "Documentation et formation"],
    tools: ["OpenAI", "Anthropic Claude", "Python", "LangChain", "Supabase"],
  },
];

export const getDisciplineBySlug = (slug: string) =>
  disciplines.find((d) => d.slug === slug);