
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BrainCircuit, Layers, Medal, Target, Lightbulb, Users } from 'lucide-react';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';

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
  index: number;
  icon: JSX.Element;
  title: string;
  description: string;
}> = ({ index, icon, title, description }) => {
  const num = String(index + 1).padStart(2, '0');
  return (
    <article className="group relative py-10 sm:py-12 border-t hairline-strong">
      <div className="grid grid-cols-12 gap-4 sm:gap-6 items-start">
        <div className="col-span-2 md:col-span-1 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground tabular-nums pt-2">
          {num}
        </div>
        <div className="col-span-10 md:col-span-1 text-[hsl(var(--tangerine))]">
          {icon}
        </div>
        <h3 className="col-span-12 md:col-span-6 display-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[0.95]">
          {title}
        </h3>
        <p className="col-span-12 md:col-span-4 text-sm md:text-base text-foreground/70 leading-relaxed md:pt-3">
          {description}
        </p>
      </div>
      <div className="absolute left-0 right-0 -top-px h-px bg-[hsl(var(--tangerine))] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </article>
  );
};

const ExpertisePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="Expertise — IA, Cartographie, Design | Skal Services"
        description="Notre expertise pluridisciplinaire : intelligence artificielle, cartographie avancée, design primé et géolocalisation de précision."
        path="/expertise"
      />
      <Navbar />
      <PageHero
        index="02"
        kicker="Domaines de spécialisation"
        title={<>Une expertise <span className="italic">pluridisciplinaire,</span><br />pensée pour les projets exigeants.</>}
        lede="IA, cartographie de précision, design primé, géolocalisation centimétrique, web et conseil stratégique — autant de leviers que nous mobilisons sur chaque mission."
      />
      <section className="section-x section-y">
        <div className="border-b hairline-strong">
          {expertiseList.map((e, i) => (
            <ExpertiseCard key={i} index={i} icon={e.icon} title={e.title} description={e.description} />
          ))}
        </div>
      </section>
      <Footer />
    </OptimindLayout>
  );
};

export default ExpertisePage;
