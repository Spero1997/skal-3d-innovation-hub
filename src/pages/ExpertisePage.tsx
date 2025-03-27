
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BrainCircuit, Layers, Medal, Target, Lightbulb, Users } from 'lucide-react';

const expertiseList = [
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Intelligence Artificielle",
    description: "Expertise en développement et intégration de solutions d'IA, machine learning et traitement automatisé des données.",
    delay: 0.1,
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Cartographie Avancée",
    description: "Maîtrise des techniques de cartographie 2D et 3D avec des outils de pointe pour la visualisation spatiale.",
    delay: 0.2,
  },
  {
    icon: <Medal className="w-6 h-6" />,
    title: "Design Primé",
    description: "Reconnu pour notre excellence en design avec des créations qui allient esthétique et fonctionnalité.",
    delay: 0.3,
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Géolocalisation Précise",
    description: "Technologies de pointe pour l'arpentage et le positionnement avec une précision de l'ordre du centimètre.",
    delay: 0.4,
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Innovation Web",
    description: "Développement de solutions web innovantes utilisant les technologies les plus récentes et performantes.",
    delay: 0.5,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Consultation Stratégique",
    description: "Conseil expert pour aider votre entreprise à intégrer efficacement les nouvelles technologies dans votre stratégie.",
    delay: 0.6,
  },
];

const ExpertiseCard: React.FC<{
  icon: JSX.Element;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="expertise-card rounded-xl p-6 transition-all duration-500 hover:translate-y-[-5px] animate-fade-in card-3d transform-gpu"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4 p-3 rounded-lg bg-blue-500/20 inline-block text-blue-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-700">{description}</p>
    </div>
  );
};

const ExpertisePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-expertise-gradient">
      <Navbar />
      <section className="section-padding relative z-10 pt-32">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-500/20 backdrop-blur-md border border-white/30">
              <span className="text-white text-sm font-medium drop-shadow-md">Notre Expertise</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white drop-shadow-md">
              Domaines de Spécialisation
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto drop-shadow">
              Notre équipe d'experts vous apporte des compétences pointues dans plusieurs domaines techniques et stratégiques pour répondre à vos besoins les plus exigeants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertiseList.map((expertise, index) => (
              <ExpertiseCard 
                key={index}
                icon={expertise.icon}
                title={expertise.title}
                description={expertise.description}
                delay={expertise.delay}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />

      <style>
        {`
        .expertise-card {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          will-change: transform, box-shadow;
        }
        
        .expertise-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 150, 0.25);
        }
        
        .bg-expertise-gradient {
          background-image: url('/lovable-uploads/a4c72fd7-1a3a-49a1-b21e-c89afae66cd0.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        `}
      </style>
    </div>
  );
};

export default ExpertisePage;
