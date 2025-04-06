
import React from 'react';
import { Code, Compass, Image, Map, PenTool, BrainCircuit } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

const services = [
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Design Graphique et Identité",
    description: "Création d'identités visuelles distinctives, de logos impactants et de supports de communication cohérents pour renforcer votre image de marque.",
    detailedDescription: [
      "Création de logos professionnels qui capturent l'essence de votre entreprise",
      "Développement d'une charte graphique complète (couleurs, typographies, applications)",
      "Conception de supports imprimés (cartes de visite, brochures, affiches)",
      "Design d'emballages et de PLV pour une visibilité maximale",
      "Infographies et illustrations personnalisées pour communiquer vos idées complexes"
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    delay: 0.1,
  },
  {
    icon: <Image className="w-6 h-6" />,
    title: "Stratégie de Création de Marque",
    description: "Développement de stratégies de marque complètes pour positionner votre entreprise et communiquer efficacement vos valeurs auprès de votre public cible.",
    detailedDescription: [
      "Analyse de marché et identification de votre positionnement unique",
      "Définition de la personnalité et des valeurs de votre marque",
      "Élaboration d'une stratégie de communication multicanal cohérente",
      "Développement de messages clés et d'une voix de marque distinctive",
      "Création de guides de marque complets pour assurer une cohérence globale"
    ],
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2000&auto=format&fit=crop",
    delay: 0.2,
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Conception et Développement Web",
    description: "Création de sites web modernes, responsifs et optimisés qui reflètent votre identité et offrent une expérience utilisateur exceptionnelle.",
    detailedDescription: [
      "Sites vitrines professionnels parfaitement adaptés à votre image de marque",
      "Boutiques en ligne performantes avec gestion des stocks et paiements sécurisés",
      "Applications web sur mesure pour répondre à vos besoins spécifiques",
      "Sites responsifs optimisés pour tous les appareils et navigateurs",
      "Optimisation SEO pour une meilleure visibilité dans les moteurs de recherche"
    ],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2000&auto=format&fit=crop",
    delay: 0.3,
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Cartographie de Précision",
    description: "Production de cartes professionnelles détaillées pour la planification urbaine, l'analyse environnementale, ou la visualisation de données géospatiales.",
    detailedDescription: [
      "Cartographie numérique haute définition pour projets d'aménagement",
      "Cartes thématiques pour visualiser des données démographiques ou environnementales",
      "Modélisation 3D de terrains et d'environnements urbains",
      "Systèmes d'information géographique (SIG) personnalisés",
      "Cartes interactives pour sites web et applications mobiles"
    ],
    image: "https://images.unsplash.com/photo-1477936821694-ec4233a9a1a0?q=80&w=2000&auto=format&fit=crop",
    delay: 0.4,
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: "Arpentage Topographique",
    description: "Services spécialisés d'arpentage utilisant des technologies de pointe pour des mesures précises et des relevés topographiques détaillés.",
    detailedDescription: [
      "Levés topographiques de terrains pour projets de construction",
      "Relevés d'intérieur de bâtiments et modélisation 3D",
      "Mesures de volumes et calculs de déblais/remblais",
      "Implantation de points d'appui pour projets d'ingénierie",
      "Suivi de l'évolution des chantiers et contrôle de conformité"
    ],
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2000&auto=format&fit=crop",
    delay: 0.5,
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Conseil en Intelligence Artificielle",
    description: "Accompagnement stratégique pour l'intégration des technologies d'IA dans vos processus métier afin d'optimiser vos opérations et d'innover.",
    detailedDescription: [
      "Audit de vos processus et identification des opportunités d'implémentation d'IA",
      "Conception de solutions sur mesure utilisant le machine learning et l'analyse prédictive",
      "Automatisation intelligente des tâches répétitives pour gagner en productivité",
      "Analyse avancée de données pour aide à la décision",
      "Formation et accompagnement de vos équipes dans l'adoption des technologies d'IA"
    ],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
    delay: 0.6,
  },
];

const ServiceCard: React.FC<{
  icon: JSX.Element;
  title: string;
  description: string;
  detailedDescription: string[];
  image: string;
  delay: number;
  index: number;
}> = ({ icon, title, description, detailedDescription, image, delay, index }) => {
  return (
    <div 
      className="service-card rounded-xl overflow-hidden transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] animate-fade-in backdrop-blur-md bg-white/50 border border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.2)] transform-gpu"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </AspectRatio>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-skal-orange/80 text-white mr-3">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-slate-800 mb-4">{description}</p>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">En détail</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {detailedDescription.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-skal-orange mr-2 mt-1">•</span>
                      <CardDescription className="text-sm text-slate-700">{item}</CardDescription>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="section-padding relative z-10">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-skal-orange/20 backdrop-blur-sm border border-white/30">
            <span className="text-white text-sm font-medium">Nos Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white drop-shadow-md">
            Expertise Complète pour Vos Projets
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto drop-shadow">
            Nous offrons une gamme complète de services spécialisés pour répondre à tous vos besoins en conception, arpentage, cartographie et conseil en IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              index={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              detailedDescription={service.detailedDescription}
              image={service.image}
              delay={service.delay}
            />
          ))}
        </div>
      </div>

      <style>{`
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          transform: translateZ(0);
          will-change: transform, box-shadow;
        }
        
        .service-card:hover {
          transform: translateY(-5px) translateZ(0);
        }
      `}</style>
    </section>
  );
};

export default Services;
