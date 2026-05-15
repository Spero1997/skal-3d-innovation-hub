export interface ProjectData {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  image: string;
  gallery?: string[];
  services: string[];
  objectives: string[];
  technologies: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  delay: number;
}

export const projects: ProjectData[] = [
  {
    id: 1,
    title: "Projets Poumons verts de Cotonou",
    subtitle: "Création du Parc urbain de Fifadji / Houéyihô",
    category: "Urbanisme & Environnement",
    description: "Le projet Poumon vert consiste à regénérer des zones naturelles dans la ville de Cotonou (Fifadji et Houéyihô), un grand parc urbain de 83 hectares pour contenir en partie les besoins d'assainissement, d'espace vert, d'écotourisme et de distraction.",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    gallery: [
      "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    ],
    services: ["Cartographie", "Arpentage topographique", "Conseil en urbanisme"],
    objectives: [
      "Régénérer 83 hectares de zones naturelles urbaines",
      "Concevoir un parc multifonctionnel (assainissement, loisirs, écotourisme)",
      "Établir un relevé topographique complet du site",
      "Proposer un plan d'aménagement durable"
    ],
    technologies: ["SIG (ArcGIS / QGIS)", "Relevé GPS différentiel", "Modélisation 3D du terrain", "Drone photogrammétrique"],
    testimonial: {
      quote: "Skal Services a su allier rigueur technique et vision environnementale pour ce projet ambitieux. Leur expertise en cartographie a été déterminante.",
      author: "Responsable du projet",
      role: "Mairie de Cotonou"
    },
    delay: 0.1,
  },
  {
    id: 2,
    title: "Refonte Identité Ruche d'Or",
    subtitle: "La Ruche d'Or",
    category: "Design & Identité",
    description: "Refonte complète de l'identité visuelle d'une entreprise commerciale en croissance, incluant logo, charte graphique et supports de communication.",
    image: "/lovable-uploads/9efd85a7-d43b-417b-b9c8-3f70c6457503.png",
    gallery: [
      "/lovable-uploads/9efd85a7-d43b-417b-b9c8-3f70c6457503.png",
    ],
    services: ["Design graphique", "Identité visuelle", "Supports de communication"],
    objectives: [
      "Créer une identité visuelle moderne et mémorable",
      "Développer une charte graphique complète",
      "Décliner l'identité sur tous les supports (print & digital)",
      "Renforcer la reconnaissance de marque"
    ],
    technologies: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Print professionnel"],
    testimonial: {
      quote: "La nouvelle identité visuelle a transformé notre image de marque. Nos clients nous reconnaissent désormais au premier coup d'œil.",
      author: "Directeur Général",
      role: "La Ruche d'Or"
    },
    delay: 0.2,
  },
  {
    id: 5,
    title: "Relevé Topographique Domaine Viticole",
    category: "Arpentage & Analyse",
    description: "Étude topographique complète d'un domaine viticole avec recommandations pour l'optimisation des parcelles et l'irrigation.",
    image: "/lovable-uploads/49270745-eea2-49da-b9c3-df16cc6d7efb.png",
    gallery: [
      "/lovable-uploads/49270745-eea2-49da-b9c3-df16cc6d7efb.png",
    ],
    services: ["Arpentage topographique", "Cartographie", "Conseil agronomique"],
    objectives: [
      "Réaliser un levé topographique haute précision",
      "Analyser les pentes et le drainage naturel",
      "Optimiser le parcellaire pour la production",
      "Proposer un système d'irrigation adapté"
    ],
    technologies: ["Station totale robotisée", "GPS RTK", "QGIS", "Modèle numérique de terrain"],
    delay: 0.5,
  },
];
