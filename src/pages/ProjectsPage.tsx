
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';

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
      className="optimind-service-card overflow-hidden group animate-fade-in p-0"
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
        <span className="text-xs font-medium text-[hsl(var(--optimind-glow))] mb-2 block">{category}</span>
        <h3 className="text-xl font-semibold mb-1 text-foreground">{title}</h3>
        {subtitle && <h4 className="text-md font-medium mb-2 text-muted-foreground">{subtitle}</h4>}
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <Navbar />
      <div className="pt-32">
        <section className="section-padding relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
                <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Nos Projets</span>
              </div>
              <h2 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
                RÉALISATIONS RÉCENTES
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
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
    </OptimindLayout>
  );
};

export default ProjectsPage;
