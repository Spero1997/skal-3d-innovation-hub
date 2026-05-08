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
    id: 'parc-fifadji',
    type: 'case-study',
    title: "Régénération du Parc urbain de Fifadji",
    excerpt: "83 hectares cartographiés et modélisés en 3D pour transformer une zone marécageuse en poumon vert de Cotonou.",
    category: "Urbanisme & Environnement",
    readTime: "8 min",
    date: "2025",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    tag: "Étude de cas",
  },
  {
    id: 'drone-photogrammetrie',
    type: 'article',
    title: "Drone & photogrammétrie : la précision au service du foncier",
    excerpt: "Comment nos relevés aériens accélèrent les bornages et sécurisent les titres fonciers au Bénin.",
    category: "Topographie",
    readTime: "5 min",
    date: "Mars 2025",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    tag: "Article",
  },
  {
    id: 'sig-collectivites',
    type: 'article',
    title: "SIG pour les collectivités : passer de la carte au pilotage",
    excerpt: "Un guide pratique pour structurer la donnée géographique d'une commune et en faire un outil de décision.",
    category: "Cartographie & SIG",
    readTime: "7 min",
    date: "Février 2025",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    tag: "Article",
  },
  {
    id: 'lotissement-calavi',
    type: 'case-study',
    title: "Lotissement de 142 parcelles à Abomey-Calavi",
    excerpt: "Borne, plan parcellaire et accompagnement administratif jusqu'à la délivrance des titres.",
    category: "Foncier & Cadastre",
    readTime: "6 min",
    date: "2024",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    tag: "Étude de cas",
  },
  {
    id: 'expertise-batie',
    type: 'case-study',
    title: "Expertise immobilière d'un complexe hôtelier",
    excerpt: "Évaluation, métré et diagnostic structurel d'un ensemble de 4 200 m² avant rachat investisseur.",
    category: "Expertise immobilière",
    readTime: "4 min",
    date: "2024",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    tag: "Étude de cas",
  },
  {
    id: 'normes-qhse',
    type: 'article',
    title: "QHSE sur chantier : les 5 réflexes qui changent tout",
    excerpt: "Sécurité, qualité, environnement — un mémo opérationnel pour les conducteurs de travaux.",
    category: "QHSE",
    readTime: "3 min",
    date: "Janvier 2025",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    tag: "Article",
  },
];