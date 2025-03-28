
import React from 'react';
import { Code, Compass, Image, Map, PenTool, BrainCircuit } from 'lucide-react';

const services = [
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Design Graphique et Identité",
    description: "Création d'identités visuelles distinctives, de logos impactants et de supports de communication cohérents pour renforcer votre image de marque.",
    delay: 0.1,
  },
  {
    icon: <Image className="w-6 h-6" />,
    title: "Stratégie de Création de Marque",
    description: "Développement de stratégies de marque complètes pour positionner votre entreprise et communiquer efficacement vos valeurs auprès de votre public cible.",
    delay: 0.2,
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Conception et Développement Web",
    description: "Création de sites web modernes, responsifs et optimisés qui reflètent votre identité et offrent une expérience utilisateur exceptionnelle.",
    delay: 0.3,
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Cartographie de Précision",
    description: "Production de cartes professionnelles détaillées pour la planification urbaine, l'analyse environnementale, ou la visualisation de données géospatiales.",
    delay: 0.4,
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: "Arpentage Topographique",
    description: "Services spécialisés d'arpentage utilisant des technologies de pointe pour des mesures précises et des relevés topographiques détaillés.",
    delay: 0.5,
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Conseil en Intelligence Artificielle",
    description: "Accompagnement stratégique pour l'intégration des technologies d'IA dans vos processus métier afin d'optimiser vos opérations et d'innover.",
    delay: 0.6,
  },
];

const ServiceCard: React.FC<{
  icon: JSX.Element;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="service-card rounded-xl p-6 transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] animate-fade-in backdrop-blur-md bg-white/40 border border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.2)] transform-gpu"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4 p-3 rounded-lg bg-skal-orange/20 inline-block text-skal-orange">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-skal-black">{title}</h3>
      <p className="text-slate-800">{description}</p>
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
              icon={service.icon}
              title={service.title}
              description={service.description}
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
