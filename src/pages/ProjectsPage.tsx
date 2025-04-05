
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';

const ProjectCard: React.FC<{
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  image: string;
  delay: number;
}> = ({ id, title, subtitle, category, description, image, delay }) => {
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
            <Link 
              to={`/projects/${id}`} 
              className="text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm"
            >
              Voir le projet <ExternalLink className="w-4 h-4" />
            </Link>
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
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  id={project.id}
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
