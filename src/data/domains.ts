import { Building2, Map, Palette, Globe, type LucideIcon } from 'lucide-react';

export interface DomainExample {
  title: string;
  caption: string;
  image: string;
  href?: string;
}

export interface Domain {
  slug: string;
  num: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  flagship?: boolean;
  intro: string;
  offerings: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  deliverables: string[];
  tools: string[];
  examples: DomainExample[];
}

export const domains: Domain[] = [
  {
    slug: 'architecture-btp',
    num: '01',
    icon: Building2,
    title: 'Architecture & BTP',
    tagline: 'Du plan à la livraison clé en main',
    flagship: true,
    intro:
      "Conception architecturale, plans d'exécution, suivi et direction de chantier, gestion complète des travaux de bâtiment. Nous intervenons sur projets résidentiels, commerciaux et d'infrastructure, du dessin coté à la remise des clés.",
    offerings: [
      { title: 'Conception architecturale', description: "Plans de maisons individuelles, résidences, locaux commerciaux. Études d'esquisse, APS, APD." },
      { title: 'Plans d\'exécution cotés', description: 'Plans 2D à l\'échelle (1:50, 1:75, 1:100), coupes, façades, plans de fondation et de structure.' },
      { title: 'Suivi & direction de chantier', description: "Coordination des corps d'état, contrôle qualité, respect du planning et du budget." },
      { title: 'Travaux BTP', description: 'Fondations, gros œuvre, charpente, couverture, second œuvre et finitions.' },
      { title: 'Implantation & nivellement', description: 'Mise en place géométrique précise du bâti sur le terrain.' },
    ],
    process: [
      { step: '01', title: 'Programme & esquisse', description: "Cadrage des besoins, contraintes du terrain, premières esquisses." },
      { step: '02', title: 'Plans cotés', description: 'Plans architecturaux complets à l\'échelle, validés avec le client.' },
      { step: '03', title: 'Chantier', description: 'Élévation, charpente, couverture, finitions — sous contrôle continu.' },
      { step: '04', title: 'Livraison', description: 'Réception des travaux, dossier de récolement, garanties.' },
    ],
    deliverables: ['Plans architecturaux DWG / PDF', 'Carnet de détails techniques', 'Suivi de chantier hebdomadaire', 'Procès-verbal de réception'],
    tools: ['AutoCAD', 'SketchUp', 'Béton armé', 'Maçonnerie agglos', 'Charpente bois & métal'],
    examples: [
      { title: 'Construction R+1 — Élégance & Confort', caption: 'Maison à étage 8,80 × 20,35 m, des fondations à la livraison', image: '/lovable-uploads/chantier-rplus1-etapes.jpeg', href: '/projects/17' },
      { title: 'Maison plain-pied — 4 étapes clés', caption: 'Construction 15,00 × 7,70 m clé en main', image: '/lovable-uploads/chantier-rdc-finition.jpeg', href: '/projects/18' },
      { title: 'Plan Élégance & Confort', caption: 'Maison familiale 5 chambres, séjour ouvert, terrasse', image: '/lovable-uploads/plan-maison-3.png', href: '/projects/73' },
    ],
  },
  {
    slug: 'geomatique-sig',
    num: '02',
    icon: Map,
    title: 'Géomatique & Cartographie',
    tagline: 'La donnée géographique au service de la décision',
    flagship: true,
    intro:
      "Levés topographiques de précision, plans cadastraux, bornage, cartographie thématique et SIG. Nous transformons le terrain en plans officiels et en cartes lisibles, exploitables par les bureaux d'études, les administrations et les décideurs.",
    offerings: [
      { title: 'Levés topographiques', description: 'Levés planimétriques et altimétriques au GPS RTK et station totale, haute précision.' },
      { title: 'Bornage & titre foncier', description: "Matérialisation des limites, plans contradictoires, dossiers pour titre foncier." },
      { title: 'Plans de lotissement', description: 'Découpage parcellaire, voirie de desserte, plans d\'urbanisme opérationnel.' },
      { title: 'Cartographie thématique', description: 'Cartes administratives, sanitaires, climatiques, pédologiques, occupation du sol.' },
      { title: 'SIG & télédétection', description: 'Bases de données géographiques, analyses spatiales, traitement d\'imagerie satellite.' },
      { title: 'Implantation d\'ouvrages', description: 'Mise en place géométrique de bâtiments, voiries et ouvrages.' },
    ],
    process: [
      { step: '01', title: 'Reconnaissance', description: 'Visite du site et calage des objectifs avec le client.' },
      { step: '02', title: 'Acquisition', description: 'Mesures terrain au GPS RTK, station totale ou drone.' },
      { step: '03', title: 'Traitement', description: 'Calculs, contrôles, dessin du plan, mise en page cartographique.' },
      { step: '04', title: 'Restitution', description: 'Plans cotés, procès-verbaux signés, livrables numériques.' },
    ],
    deliverables: ['Plans topographiques DWG / PDF', 'Procès-verbaux de bornage', 'Cartes haute résolution', 'Geodatabase QGIS / PostGIS'],
    tools: ['Station totale robotisée', 'GPS RTK', 'QGIS / ArcGIS', 'AutoCAD', 'Covadis', 'Drone photogrammétrique'],
    examples: [
      { title: 'Bornage & titre foncier — 2 ha', caption: '14 bornes contradictoires, plan officiel à 1/1500', image: '/lovable-uploads/plan-bornage.jpeg', href: '/projects/9' },
      { title: 'Lotissement 18 parcelles', caption: 'Découpage, voirie, plan technique homologable', image: '/lovable-uploads/plan-lotissement.jpeg', href: '/projects/8' },
      { title: 'Atlas thématique du Bénin', caption: 'Cartes administrative, sanitaire, climatique et d\'occupation du sol', image: '/lovable-uploads/carte-administrative-benin.jpeg', href: '/projects/10' },
    ],
  },
  {
    slug: 'graphisme-ia',
    num: '03',
    icon: Palette,
    title: 'Graphisme & IA',
    tagline: 'Identités visuelles fortes, automatisations intelligentes',
    intro:
      "Logos, chartes graphiques, interfaces et contenus visuels — combinés à des automatisations IA pour fluidifier vos process créatifs et métier. De l'identité de marque mémorable aux workflows assistés par intelligence artificielle.",
    offerings: [
      { title: 'Création de logo & identité', description: "Logotype, monogramme, signature de marque, déclinaisons monochromes." },
      { title: 'Charte graphique complète', description: 'Couleurs, typographies, grilles, zone de protection, règles d\'usage.' },
      { title: 'Supports print', description: 'Cartes de visite, papier en-tête, flyers, brochures, kakémonos.' },
      { title: 'Supports digitaux', description: 'Bannières réseaux sociaux, templates, signatures email, favicons.' },
      { title: 'Automatisations IA', description: "Chatbots, assistants virtuels, génération de contenu, traitement de données automatisé." },
      { title: 'Conseil & audit IA', description: "Cartographie des cas d'usage IA à fort impact dans vos opérations." },
    ],
    process: [
      { step: '01', title: 'Brief & moodboard', description: 'Cadrage des valeurs, des cibles et des références visuelles.' },
      { step: '02', title: 'Exploration', description: '3 à 5 pistes graphiques distinctes pour ouvrir le champ.' },
      { step: '03', title: 'Affinage', description: "Itérations sur la piste retenue jusqu'au rendu final." },
      { step: '04', title: 'Livrables & déploiement', description: 'Charte PDF, fichiers sources, déclinaisons et formation IA si applicable.' },
    ],
    deliverables: ['Logo en .ai, .svg, .png, .pdf', 'Charte graphique 30+ pages', 'Templates print & digital', 'Documentation des automatisations IA'],
    tools: ['Adobe Illustrator', 'Photoshop', 'Figma', 'OpenAI', 'Claude', 'LangChain'],
    examples: [
      { title: 'Golden Hive Design', caption: 'Identité visuelle premium pour studio créatif', image: '/lovable-uploads/golden-hive-logo.png', href: '/projects/16' },
      { title: 'Mel Shop — Branding', caption: 'Logo et identité pour boutique mode & lingerie', image: '/lovable-uploads/melshop-logo.jpeg', href: '/projects/14' },
      { title: 'La Ruche d\'Or', caption: 'Refonte complète d\'identité visuelle', image: '/lovable-uploads/9efd85a7-d43b-417b-b9c8-3f70c6457503.png', href: '/projects/2' },
    ],
  },
  {
    slug: 'web-digital',
    num: '04',
    icon: Globe,
    title: 'Web & Digital',
    tagline: 'Une présence en ligne qui convertit',
    intro:
      "Sites vitrines éditoriaux, plateformes numériques, e-commerce et applications métier — tous pensés pour être performants, accessibles et durables. Architecture moderne, code maintenable, SEO intégré dès la conception.",
    offerings: [
      { title: 'Sites vitrines & éditoriaux', description: 'Sites institutionnels, portfolios, blogs, sites multi-pages.' },
      { title: 'Plateformes e-commerce', description: 'Boutiques en ligne, paiements, gestion de catalogue.' },
      { title: 'Applications web métier', description: 'SaaS, dashboards, outils internes, espaces clients sécurisés.' },
      { title: 'SEO & référencement', description: 'Optimisation technique, contenu, données structurées, suivi des performances.' },
      { title: 'Hébergement & maintenance', description: 'Mise en ligne, sauvegardes, mises à jour de sécurité, support continu.' },
    ],
    process: [
      { step: '01', title: 'Cadrage', description: 'User stories, wireframes, choix techniques.' },
      { step: '02', title: 'Design UI', description: 'Maquettes haute fidélité et design system.' },
      { step: '03', title: 'Développement', description: 'Sprints courts avec démos régulières.' },
      { step: '04', title: 'Mise en ligne', description: 'Recette, déploiement, formation, suivi continu.' },
    ],
    deliverables: ['Code source documenté', 'Design system Figma', 'Documentation technique', 'Formation à la prise en main'],
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'PostgreSQL'],
    examples: [
      { title: 'Skalservices.com', caption: 'Site vitrine éditorial du studio (vous y êtes)', image: '/lovable-uploads/portfolio-terrain.jpeg', href: '/' },
    ],
  },
];

export const getDomainBySlug = (slug: string) => domains.find((d) => d.slug === slug);