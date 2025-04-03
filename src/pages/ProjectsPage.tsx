import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "Projets Poumons verts de Cotonou",
    subtitle: "Création du Parc urbain de Fifadji / Houéyihô",
    category: "Urbanisme & Environnement",
    description: "Le projet Poumon vert consiste à regénérer des zones naturelles dans la ville de Cotonou (Fifadji et Houéyihô), un grand parc urbain de 83 hectares pour contenir en partie les besoins d'assainissement, d'espace vert, d'écotourisme et de distraction.",
    image: "/lovable-uploads/83485b7c-e7fb-40f0-808e-fa101e256af0.png",
    delay: 0.1,
  },
  {
    title: "Refonte Identité Ruche d'Or",
    subtitle: "La Ruche d'Or",
    category: "Design & Identité",
    description: "Refonte complète de l'identité visuelle d'une entreprise commerciale en croissance, incluant logo, charte graphique et supports de communication.",
    image: "/lovable-uploads/9efd85a7-d43b-417b-b9c8-3f70c6457503.png",
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
  subtitle?: string;
  category: string;
  description: string;
  image: string;
  delay: number;
}> = ({ title, subtitle, category, description, image, delay }) => {
  return (
    <div 
      className="glass-card rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl animate-fade-in"
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
        <h3 className="text-xl font-semibold mb-1 text-skal-black">{title}</h3>
        {subtitle && <h4 className="text-md font-medium mb-2 text-gray-600">{subtitle}</h4>}
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Preload the background image
    const img = new Image();
    img.src = "/lovable-uploads/ecc4cd20-90cc-4af6-8781-13a25c8c2314.png";
    img.onload = () => setIsLoading(false);
    
    // Fallback in case image loading takes too long
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <div 
        className="fixed inset-0 -z-10 bg-white"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/ecc4cd20-90cc-4af6-8781-13a25c8c2314.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      <Navbar />
      <div className="pt-32">
        <section className="section-padding relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
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
                  subtitle={project.subtitle}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                  delay={project.delay}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
