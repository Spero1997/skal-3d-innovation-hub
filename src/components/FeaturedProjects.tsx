import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { projects } from '@/data/projects';

const FeaturedProjects: React.FC = () => {
  const featured = projects.slice(0, 3);

  return (
    <section className="section-padding relative z-10">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
            <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
            PROJETS RÉCENTS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un aperçu de nos réalisations les plus récentes. Chaque projet reflète notre engagement envers l'excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group optimind-service-card rounded-2xl overflow-hidden p-0 animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm flex items-center gap-1">
                    Voir le projet <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-medium text-[hsl(var(--optimind-glow))] uppercase tracking-wider">{project.category}</span>
                <h3 className="text-base font-semibold text-foreground mt-1 mb-1">{project.title}</h3>
                <p className="text-muted-foreground text-xs line-clamp-2">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-foreground text-foreground text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-[hsl(var(--optimind-card))] transition-colors"
          >
            Voir tous les projets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;