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

      <div className="pt-24 sm:pt-28 md:pt-32 section-x pb-16 sm:pb-24">
        <Link to="/projects" className="inline-flex items-center mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Retour aux projets
        </Link>

        {/* Editorial title block */}
        <div className="grid grid-cols-12 gap-4 mb-10 sm:mb-14 items-end border-b hairline-strong pb-10">
          <div className="col-span-12 md:col-span-2 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <div className="text-[hsl(var(--tangerine))] mb-2">§ {project.category}</div>
            <div className="tabular-nums">N° {String(project.id).padStart(3, '0')}</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h1 className="display-serif fluid-display-lg font-light leading-[0.9] tracking-[-0.03em]">
              {project.title}
              {project.subtitle && <span className="italic text-foreground/55"> — {project.subtitle}</span>}
            </h1>
          </div>
        </div>

        <div className="animate-fade-in">
            {/* Gallery — full-bleed */}
            <div className="relative h-72 sm:h-[420px] md:h-[560px] overflow-hidden bg-foreground">
              <img 
                src={current.src}
                alt={current.caption || project.title}
                className="w-full h-full object-cover transition-opacity duration-300" 
              />
              {(current.caption || current.description) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[hsl(var(--ink))/0.9] via-[hsl(var(--ink))/0.5] to-transparent p-4 md:p-8 pt-12 text-[hsl(var(--cream))]">
                  {current.caption && (
                    <div className="display-serif text-lg md:text-2xl leading-tight">{current.caption}</div>
                  )}
                  {current.description && (
                    <p className="text-xs md:text-sm text-[hsl(var(--cream))/0.8] mt-2 max-w-3xl leading-relaxed">{current.description}</p>
                  )}
                </div>
              )}
              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(i => (i - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-[hsl(var(--cream))/0.95] text-foreground p-2 rounded-full hover:bg-[hsl(var(--tangerine))] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImage(i => (i + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-[hsl(var(--cream))/0.95] text-foreground p-2 rounded-full hover:bg-[hsl(var(--tangerine))] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute top-4 right-4 mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--cream))] tabular-nums">
                    {String(activeImage + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
                  </div>
                </>
              )}
            </div>

            {/* Editorial body */}
            <div className="grid grid-cols-12 gap-6 mt-14 md:mt-20">
              <div className="col-span-12 md:col-span-5">
                <span className="ticker-tag">§ Synopsis</span>
                <p className="display-serif text-2xl md:text-3xl font-light leading-snug mt-5">
                  {project.description}
                </p>
              </div>

              <div className="col-span-12 md:col-span-6 md:col-start-7 md:mt-12 space-y-12">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 pb-3 border-b hairline">§ Services mobilisés</div>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 border hairline-strong mono text-[10px] uppercase tracking-[0.18em] text-foreground rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 pb-3 border-b hairline">§ Objectifs</div>
                    <ul className="space-y-3">
                      {project.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                          <span className="mono text-[10px] tabular-nums text-[hsl(var(--tangerine))] mt-1">{String(i+1).padStart(2,'0')}</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 pb-3 border-b hairline">§ Technologies</div>
                    <ul className="space-y-3">
                      {project.technologies.map((t, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                          <span className="mono text-[10px] tabular-nums text-[hsl(var(--tangerine))] mt-1">{String(i+1).padStart(2,'0')}</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial — editorial pull-quote */}
            {project.testimonial && (
              <div className="mt-20 md:mt-28 grid grid-cols-12 gap-6 border-t hairline-strong pt-12">
                <div className="col-span-12 md:col-span-2 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  § Témoignage
                </div>
                <div className="col-span-12 md:col-span-9 md:col-start-3">
                  <Quote className="w-10 h-10 text-[hsl(var(--tangerine))] mb-6" strokeWidth={1.2} />
                  <blockquote className="display-serif text-2xl md:text-4xl font-light italic leading-tight">
                    « {project.testimonial.quote} »
                  </blockquote>
                  <div className="mt-8 flex items-baseline gap-4 border-t hairline pt-5">
                    <p className="display-serif text-lg">{project.testimonial.author}</p>
                    <p className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{project.testimonial.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-20 md:mt-28 grid grid-cols-12 gap-6 items-end border-t hairline-strong pt-12">
              <h3 className="col-span-12 md:col-span-7 display-serif text-3xl md:text-5xl font-light leading-tight">
                Vous avez un projet <span className="italic">similaire ?</span>
              </h3>
              <div className="col-span-12 md:col-span-4 md:col-start-9 md:text-right">
                <Link to="/contact" className="btn-ink">
                  Démarrer la conversation
                </Link>
              </div>
            </div>
          </div>
        </div>
      
      <Footer />
    </OptimindLayout>
  );
};

export default ProjectDetailPage;
