
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "Cartographie 3D de Paris",
    category: "Arpentage & Cartographie",
    description: "Création d'une cartographie 3D détaillée du centre-ville de Paris avec modélisation des bâtiments historiques et analyse urbaine.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    delay: 0.1,
  },
  {
    title: "Rebrand Entreprise Tech",
    category: "Design & Identité",
    description: "Refonte complète de l'identité visuelle d'une entreprise tech en croissance, incluant logo, charte graphique et supports de communication.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    delay: 0.2,
  },
  {
    title: "Plateforme de Gestion Territoriale",
    category: "Développement Web & IA",
    description: "Développement d'une plateforme SaaS pour la gestion territoriale intégrant des fonctionnalités d'IA pour l'analyse prédictive.",
    image: "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?q=80&w=2161&auto=format&fit=crop",
    delay: 0.3,
  },
  {
    title: "Application de Tourisme Augmenté",
    category: "Développement Mobile & AR",
    description: "Application mobile utilisant la réalité augmentée pour enrichir l'expérience touristique dans les sites historiques.",
    image: "https://images.unsplash.com/photo-1484712401471-05c7215830eb?q=80&w=2070&auto=format&fit=crop",
    delay: 0.4,
  },
  {
    title: "Relevé Topographique Domaine Viticole",
    category: "Arpentage & Analyse",
    description: "Étude topographique complète d'un domaine viticole avec recommandations pour l'optimisation des parcelles et l'irrigation.",
    image: "https://images.unsplash.com/photo-1596131353736-be8bf050e48e?q=80&w=2070&auto=format&fit=crop",
    delay: 0.5,
  },
  {
    title: "Système de Monitoring Environnemental",
    category: "IoT & Cartographie",
    description: "Conception et déploiement d'un réseau de capteurs IoT pour le monitoring environnemental en zone urbaine avec visualisation cartographique.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    delay: 0.6,
  },
];

const ProjectCard: React.FC<{
  title: string;
  category: string;
  description: string;
  image: string;
  delay: number;
}> = ({ title, category, description, image, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="glass-card rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl opacity-0"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <a href="#" className="text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
              Voir le projet <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-6">
        <span className="text-xs font-medium text-skal-orange mb-2 block">{category}</span>
        <h3 className="text-xl font-semibold mb-3 text-skal-black">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <section className="section-padding bg-white relative z-10 pt-32">
        <div className="container mx-auto">
          <div 
            ref={sectionRef}
            className="text-center mb-16 opacity-0"
          >
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-skal-orange/10">
              <span className="text-skal-orange text-sm font-medium">Nos Projets</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-skal-black">
              Réalisations Récentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez quelques-uns de nos projets récents qui démontrent notre expertise et notre capacité à délivrer des solutions innovantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                category={project.category}
                description={project.description}
                image={project.image}
                delay={project.delay}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
