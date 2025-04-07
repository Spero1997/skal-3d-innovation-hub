
import React, { useState } from 'react';
import { Code, Compass, Image, Map, PenTool, BrainCircuit, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TrustIndicators from './TrustIndicators';
import { Progress } from '@/components/ui/progress';

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
    image: "https://images.unsplash.com/photo-1477936821694-ec4233a900cd?q=80&w=2000&auto=format&fit=crop",
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
  const [isOpen, setIsOpen] = useState(false);

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
        
        <Collapsible 
          open={isOpen} 
          onOpenChange={setIsOpen}
          className="w-full mb-4"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline"
              className="w-full border-skal-orange text-skal-orange hover:bg-skal-orange hover:text-white justify-center"
            >
              {isOpen ? "Fermer" : "En détail"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
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
          </CollapsibleContent>
        </Collapsible>

        <div className="flex gap-3 mt-2">
          <Button 
            className="flex-1 bg-skal-orange hover:bg-skal-orange/90 text-white"
            onClick={() => window.location.href = '/contact'}
          >
            Demander un devis
          </Button>
          <Button 
            variant="outline" 
            className="border-skal-orange text-skal-orange hover:bg-skal-orange hover:text-white"
            onClick={() => window.location.href = '/contact'}
          >
            Contactez-nous
          </Button>
        </div>
      </div>
    </div>
  );
};

// Nouvelle section FAQ
const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Quels sont les délais moyens pour vos prestations ?",
      answer: "Nos délais varient selon la complexité du projet. Pour un projet de design graphique ou de développement web standard, comptez entre 2 et 4 semaines. Pour des projets d'arpentage ou de cartographie, les délais sont généralement de 1 à 2 semaines. Nous pouvons également proposer un service accéléré pour les projets urgents."
    },
    {
      question: "Comment se déroule votre processus de travail ?",
      answer: "Notre processus commence toujours par une consultation approfondie pour comprendre vos besoins. Nous établissons ensuite un cahier des charges détaillé, suivi d'une proposition et d'un devis. Après validation, nous entamons la phase de production avec des points d'étape réguliers pour vous tenir informé et recueillir vos retours. Une fois le projet finalisé, nous offrons un suivi post-livraison pour garantir votre satisfaction."
    },
    {
      question: "Proposez-vous des forfaits ou uniquement du sur-mesure ?",
      answer: "Nous proposons à la fois des forfaits pour les services les plus courants (création de logo, site vitrine, etc.) et des solutions entièrement personnalisées pour répondre à des besoins spécifiques. Nos forfaits permettent de bénéficier de tarifs avantageux tout en garantissant un service de qualité professionnelle."
    },
    {
      question: "Comment garantissez-vous la confidentialité de mes données ?",
      answer: "La sécurité de vos données est notre priorité. Nous utilisons des protocoles de cryptage avancés, des systèmes de sauvegarde sécurisés, et nous signons systématiquement des accords de confidentialité. Tous nos services sont conformes au RGPD et nous vous garantissons que vos informations ne sont jamais partagées avec des tiers sans votre autorisation explicite."
    },
    {
      question: "Assurez-vous la formation à l'utilisation des outils développés ?",
      answer: "Absolument ! Nous incluons systématiquement une formation adaptée dans nos prestations pour que vous puissiez maîtriser parfaitement les outils que nous développons. Des sessions de formation personnalisées, des tutoriels vidéo et une documentation complète sont fournis. Notre équipe reste également disponible pour répondre à vos questions après la livraison du projet."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-lg">
      <h3 className="text-2xl font-semibold text-center mb-8 text-skal-black">Questions Fréquentes</h3>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <Collapsible key={index} open={openItem === index} onOpenChange={() => toggleItem(index)}>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 text-left">
                <h4 className="text-lg font-medium text-skal-black">{item.question}</h4>
                <ArrowRight className={`w-5 h-5 text-skal-orange transition-transform ${openItem === index ? 'rotate-90' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 bg-gray-50 border-t border-gray-200">
                  <p className="text-slate-700">{item.answer}</p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

// Nouvelle section pour l'offre limitée
const OffreLimitee = () => {
  return (
    <div className="mb-8 p-4 bg-gradient-to-r from-skal-orange/90 to-skal-orange rounded-lg shadow-lg text-white mx-auto max-w-full lg:max-w-3xl animate-pulse-slow">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
        <div className="flex items-center">
          <Badge variant="secondary" className="bg-white text-skal-orange mr-3">OFFRE SPÉCIALE</Badge>
          <span className="font-semibold text-sm md:text-base whitespace-nowrap">1ère analyse IA gratuite pour les 10 premiers clients de chaque mois !</span>
        </div>
        <Button 
          variant="secondary" 
          className="whitespace-nowrap bg-white hover:bg-white/90 text-skal-orange"
          onClick={() => window.location.href = '/contact'}
        >
          J'en profite maintenant
        </Button>
      </div>
    </div>
  );
};

// Nouvelle section pour la barre de progression
const DemandeProgress = () => {
  // On simule que 5 demandes ont été traitées sur un maximum de 20
  const traites = 5;
  const capaciteMax = 20;
  const pourcentage = (traites / capaciteMax) * 100;

  return (
    <div className="mb-12 mt-8 bg-white/70 backdrop-blur-sm rounded-lg p-6 max-w-lg mx-auto border border-white/20 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-slate-700">Demandes traitées aujourd'hui</p>
        <Badge variant="outline" className="text-skal-orange border-skal-orange">
          {traites}/{capaciteMax}
        </Badge>
      </div>
      <Progress value={pourcentage} className="h-2 bg-gray-200" />
      <p className="text-xs text-slate-500 mt-2 text-center">Capacité disponible : {capaciteMax - traites} demandes restantes aujourd'hui</p>
    </div>
  );
};

// Section de sécurité avec badges
const SecurityBadges = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-300 px-3 py-1 rounded-full">
        Données 100% sécurisées
      </Badge>
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 px-3 py-1 rounded-full">
        Paiements sécurisés
      </Badge>
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300 px-3 py-1 rounded-full">
        Conformité RGPD
      </Badge>
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-full">
        Confidentialité garantie
      </Badge>
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
            Découvrez notre gamme de services professionnels conçus pour transformer vos idées en réalité et propulser votre entreprise vers le succès.
          </p>
          
          <div className="mt-8 p-4 bg-skal-orange/90 rounded-lg shadow-lg text-white mx-auto max-w-sm md:max-w-md lg:max-w-lg">
            <span className="font-semibold mr-2">Notre garantie :</span> 
            Satisfaction complète ou remboursement intégral sur tous nos services
          </div>
        </div>

        <OffreLimitee />
        <SecurityBadges />
        <DemandeProgress />

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
        
        <FAQSection />
        
        <div className="mt-20">
          <TrustIndicators />
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
        
        @media (max-width: 768px) {
          .service-card .flex {
            flex-direction: column;
          }
          
          .service-card .flex-1 {
            width: 100%;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;
