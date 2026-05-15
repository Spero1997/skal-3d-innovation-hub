import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  
  const project = projects.find(p => p.id === parseInt(id || '0'));
  const rawGallery = project?.gallery || (project ? [project.image] : []);
  const gallery = rawGallery.map((g) =>
    typeof g === 'string' ? { src: g } : g
  );
  const current = gallery[activeImage];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <OptimindLayout>
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Projet non trouvé</h1>
          <p className="mb-6 text-muted-foreground">Le projet que vous recherchez n'existe pas.</p>
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets
            </Button>
          </Link>
        </div>
        <Footer />
      </OptimindLayout>
    );
  }

  return (
    <OptimindLayout>
      <SEO
        title={`${project.title} — Skal Services`}
        description={project.description.slice(0, 160)}
        path={`/projects/${project.id}`}
        image={`https://skalservice.lovable.app${project.image}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          image: `https://skalservice.lovable.app${project.image}`,
          creator: { '@type': 'Organization', name: 'Skal Services' },
        }}
      />
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/projects" className="inline-flex items-center text-[hsl(var(--optimind-glow))] hover:opacity-80 mb-6 text-sm uppercase tracking-wider">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets
          </Link>
          
          <div className="optimind-service-card rounded-2xl overflow-hidden animate-fade-in p-0">
            {/* Gallery */}
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img 
                src={current.src}
                alt={current.caption || project.title}
                className="w-full h-full object-cover transition-opacity duration-300" 
              />
              {(current.caption || current.description) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 md:p-6 pt-10 text-white">
                  {current.caption && (
                    <div className="text-sm md:text-base font-semibold leading-tight">{current.caption}</div>
                  )}
                  {current.description && (
                    <p className="text-xs md:text-sm text-white/80 mt-1 max-w-3xl">{current.description}</p>
                  )}
                </div>
              )}
              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(i => (i - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImage(i => (i + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <span className="text-xs font-medium text-[hsl(var(--optimind-glow))] mb-2 block uppercase tracking-wider">{project.category}</span>
                <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-foreground">{project.title}</h1>
                {project.subtitle && <h2 className="text-lg md:text-xl font-medium mb-4 text-muted-foreground">{project.subtitle}</h2>}
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-8">{project.description}</p>

              {/* Services utilisés */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground uppercase tracking-wider">Services mobilisés</h3>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((service, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-full bg-[hsl(var(--optimind-glow)/0.1)] text-[hsl(var(--optimind-glow))] text-sm font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground uppercase tracking-wider">Objectifs</h3>
                  <ul className="space-y-3">
                    {project.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--optimind-glow))] mt-2 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground uppercase tracking-wider">Technologies</h3>
                  <ul className="space-y-3">
                    {project.technologies.map((tech, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--optimind-glow))] mt-2 flex-shrink-0" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Testimonial */}
              {project.testimonial && (
                <div className="border border-[hsl(var(--border))] rounded-2xl p-6 md:p-8 mb-8 bg-[hsl(var(--secondary))]">
                  <Quote className="w-8 h-8 text-[hsl(var(--optimind-glow))] mb-4 opacity-50" />
                  <blockquote className="text-foreground italic leading-relaxed mb-4">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{project.testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{project.testimonial.role}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Vous avez un projet similaire ?</h3>
                <Link to="/contact">
                  <Button className="bg-foreground text-[hsl(var(--optimind-card))] hover:opacity-90 rounded-full px-8 uppercase tracking-wider text-sm">
                    Contactez-nous
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </OptimindLayout>
  );
};

export default ProjectDetailPage;
