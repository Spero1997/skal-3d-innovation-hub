
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BrainCircuit, Layers, Medal, Target, Lightbulb, Users } from 'lucide-react';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';

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
      className="optimind-service-card animate-fade-in"
      style={{ 
        animationDelay: `${delay}s`,
      }}
    >
      <div className="mb-4 p-3 rounded-lg bg-[hsl(var(--optimind-glow)/0.1)] inline-block text-[hsl(var(--optimind-glow))]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const ExpertisePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="Expertise — IA, Cartographie, Design | Skal Service"
        description="Notre expertise pluridisciplinaire : intelligence artificielle, cartographie avancée, design primé et géolocalisation de précision."
        path="/expertise"
      />
      <Navbar />
      <div className="pt-32">
        <section className="section-padding relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
                <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Notre Expertise</span>
              </div>
              <h2 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
                DOMAINES DE SPÉCIALISATION
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
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
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default ExpertisePage;
