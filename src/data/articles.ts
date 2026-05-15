export interface Article {
  id: string;
  type: 'article' | 'case-study';
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  tag?: string;
}

export const articles: Article[] = [
  {
    id: 'chantier-rplus1',
    type: 'case-study',
    title: "Construction R+1 — du plan à la livraison",
    excerpt: "Suivi complet d'une maison à étage (8,80 × 20,35 m) en 4 étapes : fondations, dalle, toiture et finitions.",
    category: "Construction & Suivi",
    readTime: "6 min",
    date: "2026",
    image: "/lovable-uploads/chantier-rplus1-etapes.jpeg",
    tag: "Étude de cas",
  },
  {
    id: 'chantier-plainpied',
    type: 'case-study',
    title: "Maison plain-pied — chantier en 4 étapes clés",
    excerpt: "De la fondation à la cour aménagée : retour sur la construction d'une maison conçue à partir de notre plan 1:100.",
    category: "Construction & Suivi",
    readTime: "5 min",
    date: "2026",
    image: "/lovable-uploads/chantier-rdc-finition.jpeg",
    tag: "Étude de cas",
  },
  {
    id: 'bornage-titre-foncier',
    type: 'article',
    title: "Bornage & titre foncier : la méthode Skal",
    excerpt: "Comment matérialiser 14 bornes contradictoires sur 2 ha et produire un plan officiel à l'échelle 1/1500.",
    category: "Arpentage & Bornage",
    readTime: "5 min",
    date: "Avril 2026",
    image: "/lovable-uploads/plan-bornage.jpeg",
    tag: "Article",
  },
  {
    id: 'cartographie-benin',
    type: 'article',
    title: "Cartographie thématique du Bénin : du satellite à la décision",
    excerpt: "Cartes administratives, sanitaires, climatiques et d'occupation du sol — un atlas pour piloter le territoire.",
    category: "Cartographie & SIG",
    readTime: "7 min",
    date: "Mars 2026",
    image: "/lovable-uploads/carte-administrative-benin.jpeg",
    tag: "Article",
  },
  {
    id: 'lotissement-18-parcelles',
    type: 'case-study',
    title: "Lotissement — 18 parcelles d'habitation",
    excerpt: "Découpage, voirie de desserte et plan technique : un domaine prêt à commercialiser et homologuer.",
    category: "Urbanisme & Lotissement",
    readTime: "5 min",
    date: "2026",
    image: "/lovable-uploads/plan-lotissement.jpeg",
    tag: "Étude de cas",
  },
  {
    id: 'golden-hive-branding',
    type: 'case-study',
    title: "Golden Hive Design — identité visuelle premium",
    excerpt: "Logo, monogramme GH, charte graphique et déclinaisons print/web pour un studio créatif.",
    category: "Design & Identité",
    readTime: "4 min",
    date: "2026",
    image: "/lovable-uploads/golden-hive-logo.png",
    tag: "Étude de cas",
  },
  {
    id: 'plans-architecture',
    type: 'article',
    title: "Concevoir un plan de maison : lumière, circulation, zonage",
    excerpt: "4 plans Skal Services décortiqués : comment équilibrer espaces jour, espaces nuit et terrasses.",
    category: "Architecture & Plans",
    readTime: "6 min",
    date: "Février 2026",
    image: "/lovable-uploads/plan-maison-2.png",
    tag: "Article",
  },
];