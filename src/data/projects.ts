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
      quote: "L'équipe de Skal Services a parfaitement compris nos besoins et a livré un travail de qualité exceptionnelle, bien au-delà de nos attentes.",
      author: "ACAKPO Charnel",
      role: "Chargé de la communication, La Ruche d'Or"
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
  {
    id: 7,
    title: "Plans architecturaux résidentiels",
    subtitle: "Maisons familiales — Élégance & Confort",
    category: "Architecture & Design d'intérieur",
    description: "Conception de plans de maisons individuelles à usage résidentiel : agencements optimisés, circulations fluides, ventilation croisée et lumière naturelle. Chaque plan est pensé pour le climat ouest-africain et le mode de vie des occupants (espaces jour, espaces nuit, terrasses).",
    image: "/lovable-uploads/plan-maison-2.png",
    gallery: [
      "/lovable-uploads/plan-maison-1.png",
      "/lovable-uploads/plan-maison-2.png",
      "/lovable-uploads/plan-maison-3.png",
      "/lovable-uploads/plan-maison-4.png",
    ],
    services: ["Conception architecturale", "Plans 2D cotés", "Aménagement intérieur"],
    objectives: [
      "Proposer des agencements harmonieux entre espaces jour et espaces nuit",
      "Optimiser la lumière naturelle et la ventilation croisée",
      "Intégrer terrasses et espaces de vie extérieurs",
      "Livrer des plans cotés exploitables pour le chantier",
    ],
    technologies: ["AutoCAD", "SketchUp", "Rendu 2D coloré", "Plans cotés à l'échelle"],
    delay: 0.7,
  },
  {
    id: 8,
    title: "Plan de lotissement — 18 parcelles",
    category: "Urbanisme & Lotissement",
    description: "Étude et découpage d'un domaine en 18 parcelles à usage d'habitation. Définition des dimensions, des accès et de la voirie de desserte, en conformité avec les règles d'urbanisme locales.",
    image: "/lovable-uploads/plan-lotissement.jpeg",
    gallery: ["/lovable-uploads/plan-lotissement.jpeg"],
    services: ["Lotissement", "Arpentage", "Urbanisme opérationnel"],
    objectives: [
      "Découper le domaine en parcelles régulières et commercialisables",
      "Définir les voies d'accès et la trame viaire",
      "Optimiser la surface utile pour chaque lot",
      "Préparer le dossier technique pour homologation",
    ],
    technologies: ["AutoCAD", "QGIS", "GPS de précision", "Calculs de surfaces"],
    delay: 0.8,
  },
  {
    id: 9,
    title: "Bornage et plan topographique — Titre foncier 2 ha",
    category: "Arpentage & Bornage",
    description: "Levé topographique et bornage contradictoire d'une propriété de 2 hectares pour l'établissement d'un titre foncier. Matérialisation des limites par bornes (B1 à B14), calcul des distances et de la surface, production du plan officiel à l'échelle 1/1500.",
    image: "/lovable-uploads/plan-bornage.jpeg",
    gallery: ["/lovable-uploads/plan-bornage.jpeg"],
    services: ["Bornage", "Levé topographique", "Plan pour titre foncier"],
    objectives: [
      "Matérialiser les limites par 14 bornes contradictoires",
      "Calculer la surface exacte de la propriété (2 ha)",
      "Produire un plan conforme aux exigences cadastrales",
      "Constituer le dossier pour titre foncier",
    ],
    technologies: ["Station totale", "GPS différentiel", "AutoCAD", "Covadis"],
    delay: 0.9,
  },
  {
    id: 10,
    title: "Cartographie thématique du Bénin",
    subtitle: "Cartes administrative, sanitaire, climatique et d'occupation du sol",
    category: "Cartographie & SIG",
    description: "Production d'un atlas thématique du Bénin pour des besoins d'études et d'aide à la décision : carte administrative (départements et communes), localisation des établissements de santé sur Cotonou et l'Atlantique, zonage climatique avec diagrammes ombrothermiques, et carte d'occupation du sol issue d'images Landsat.",
    image: "/lovable-uploads/carte-administrative-benin.jpeg",
    gallery: [
      "/lovable-uploads/carte-administrative-benin.jpeg",
      "/lovable-uploads/carte-hopitaux-cotonou.jpeg",
      "/lovable-uploads/carte-climat-benin.jpeg",
      "/lovable-uploads/carte-occupation-sol-benin.jpeg",
    ],
    services: ["Cartographie SIG", "Télédétection", "Mise en page cartographique"],
    objectives: [
      "Produire une carte administrative actualisée du Bénin",
      "Cartographier l'offre hospitalière de Cotonou et environs",
      "Caractériser les domaines climatiques avec données pluviométriques",
      "Analyser l'occupation du sol à partir d'imagerie satellitaire Landsat",
    ],
    technologies: ["QGIS / ArcGIS", "Imagerie Landsat TM", "Données IGN / PAPDFGC", "Mise en page cartographique"],
    delay: 1.0,
  },
  {
    id: 11,
    title: "Carte pédologique du Bénin",
    subtitle: "Cartographie nationale des sols",
    category: "Cartographie & SIG",
    description: "Production d'une carte pédologique couvrant l'ensemble du territoire béninois. Identification et représentation des principales unités de sol (sols ferrugineux tropicaux, ferralitiques, hydromorphes, minéraux bruts…) à partir des données CENAP, pour un usage en agronomie, aménagement et études environnementales.",
    image: "/lovable-uploads/carte-pedologique-benin.jpeg",
    gallery: ["/lovable-uploads/carte-pedologique-benin.jpeg"],
    services: ["Cartographie thématique", "SIG", "Mise en page cartographique"],
    objectives: [
      "Représenter les grandes unités pédologiques du Bénin",
      "Faciliter la lecture par une légende détaillée et une symbologie claire",
      "Fournir un support exploitable pour études agricoles et environnementales",
      "Intégrer les limites administratives et le réseau routier de référence",
    ],
    technologies: ["QGIS / ArcGIS", "Données CENAP", "Géoréférencement", "Mise en page A3 cartographique"],
    delay: 1.1,
  },
  {
    id: 12,
    title: "Levés et implantations sur le terrain",
    subtitle: "Portfolio d'interventions topographiques",
    category: "Topographie & Implantation",
    description: "Ensemble d'interventions terrain réalisées par Skal Services au Bénin : levés GPS de précision, relevés en zones humides, implantation de bâtiments et de voiries, suivi de carrière et production de fonds cartographiques. Chaque intervention combine matériel professionnel et restitution numérique exploitable par les bureaux d'études.",
    image: "/lovable-uploads/portfolio-terrain.jpeg",
    gallery: ["/lovable-uploads/portfolio-terrain.jpeg"],
    services: [
      "Levés topographiques",
      "Morcellement de domaine",
      "SIG & cartographie",
      "Implantation d'ouvrages (bâtiment, route, carrière)",
      "Vente et location d'appareils topographiques",
    ],
    objectives: [
      "Réaliser des levés haute précision en milieu urbain et rural",
      "Implanter bâtiments, voiries et ouvrages avec rigueur métrique",
      "Suivre l'avancement de carrières et terrassements",
      "Restituer les données sous forme exploitable (DWG, SIG, plans)",
    ],
    technologies: ["GPS RTK", "Station totale", "AutoCAD / Covadis", "QGIS", "Drone topographique"],
    delay: 1.2,
  },
  {
    id: 13,
    title: "Optimisation logistique & cartographie d'itinéraires",
    subtitle: "Mission pour TCHESSI Junior — Logistique",
    category: "SIG & Conseil",
    description: "Accompagnement d'un professionnel de la logistique dans la cartographie de ses tournées et l'optimisation de ses itinéraires de livraison. Production de cartes opérationnelles, analyse des temps de parcours et recommandations sur la planification quotidienne.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    services: ["Cartographie SIG", "Conseil opérationnel", "Optimisation d'itinéraires"],
    objectives: [
      "Cartographier l'ensemble des points de collecte et de livraison",
      "Optimiser les tournées pour réduire kilométrage et temps de parcours",
      "Fournir des fiches d'itinéraire claires aux chauffeurs",
      "Mettre en place un suivi simple des performances",
    ],
    technologies: ["QGIS", "Google Maps API", "OpenRouteService", "Tableurs analytiques"],
    testimonial: {
      quote: "Leur expertise en cartographie et leur conseil en IA nous ont permis d'optimiser considérablement nos processus. Un partenaire de confiance.",
      author: "TCHESSI Junior",
      role: "Logisticien",
    },
    delay: 1.3,
  },
  {
    id: 14,
    title: "Identité visuelle & présence digitale — MEL SHOP",
    subtitle: "Mission pour MEL SHOP",
    category: "Design & Communication",
    description: "Création de l'identité visuelle de MEL SHOP et déploiement de ses supports de communication digitale : logo, charte, visuels réseaux sociaux et catalogues produits. L'objectif : structurer une image de marque cohérente et professionnelle pour soutenir la croissance commerciale.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop",
    services: ["Identité visuelle", "Design graphique", "Community management"],
    objectives: [
      "Concevoir un logo et une charte graphique mémorables",
      "Structurer la présence sur les réseaux sociaux",
      "Produire des visuels produits cohérents",
      "Renforcer la notoriété de la marque",
    ],
    technologies: ["Adobe Illustrator", "Adobe Photoshop", "Canva Pro", "Meta Business Suite"],
    testimonial: {
      quote: "Un professionnalisme remarquable et une réactivité constante. Skal Services a transformé notre vision en réalité avec une précision impressionnante.",
      author: "DANNON Imelda",
      role: "Directrice Générale, MEL SHOP",
    },
    delay: 1.4,
  },
  {
    id: 15,
    title: "Relevés et plans techniques — TECOMAV-ALU",
    subtitle: "Mission pour TECOMAV-ALU",
    category: "Topographie & Plans techniques",
    description: "Réalisation de relevés métriques et de plans techniques pour TECOMAV-ALU, spécialisée en aluminium et menuiserie technique. Production de plans cotés exploitables en atelier pour le dimensionnement et la fabrication des ouvrages.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2076&auto=format&fit=crop",
    services: ["Relevés métriques", "Plans techniques cotés", "Conseil en implantation"],
    objectives: [
      "Effectuer des relevés précis sur sites clients",
      "Produire des plans cotés directement exploitables en atelier",
      "Fiabiliser le dimensionnement des ouvrages aluminium",
      "Réduire les erreurs de fabrication et de pose",
    ],
    technologies: ["AutoCAD", "Distance-mètre laser", "Station totale", "Plans 2D cotés"],
    testimonial: {
      quote: "Service exceptionnel et résultats à la hauteur de nos attentes. Je recommande vivement leur expertise pour tous vos projets.",
      author: "GUENDEHOU Côme",
      role: "Directeur, TECOMAV-ALU",
    },
    delay: 1.5,
  },
];
