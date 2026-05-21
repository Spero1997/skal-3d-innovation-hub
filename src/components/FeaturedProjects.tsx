import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';

const FeaturedProjects: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const featured = projects.slice(0, 4);

  return (
    <section ref={ref} className="section-x section-y border-t hairline">
      {/* Editorial title row — asymmetric on every breakpoint */}
      <div className="grid grid-cols-12 gap-x-4 gap-y-8 items-end mb-14 sm:mb-20">
        <div className="col-span-12 md:col-span-2">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
            § Sélection 24—26
          </div>
          <p className="mt-4 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 tabular-nums">
            04 — Travaux
          </p>
        </div>
        <h2 className="col-span-12 md:col-span-8 md:col-start-4 display-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[0.88] tracking-tight">
          Travaux <span className="italic text-foreground/55">récents.</span>
        </h2>
        <Link
          to="/projects"
          className="col-span-12 md:col-span-2 md:col-start-11 md:justify-self-end self-end mono text-[11px] uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:text-[hsl(var(--tangerine))] transition-colors"
        >
          Tout voir <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Editorial list — asymmetric indents at every breakpoint */}
      <div className="border-t hairline-strong">
        {featured.map((p, i) => {
          // alternating editorial indents, visible on ALL screens
          const indents = [
            'col-span-12',
            'col-span-11 col-start-2',
            'col-span-10 col-start-3',
            'col-span-11 col-start-1',
          ];
          const titleSpan = [
            'col-span-8 md:col-span-7',
            'col-span-8 md:col-span-6',
            'col-span-8 md:col-span-6',
            'col-span-8 md:col-span-7',
          ];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid grid-cols-12 border-b hairline-strong"
            >
              <div className={indents[i % indents.length]}>
                <Link
                  to={`/projects/${p.id}`}
                  className="group relative grid grid-cols-12 gap-4 items-center py-8 sm:py-10 md:py-14 hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 px-4 sm:px-6 -mx-4 sm:-mx-6"
                >
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 h-px w-0 bg-[hsl(var(--tangerine))] group-hover:w-full transition-all duration-700"
                  />
                  <div className="col-span-2 sm:col-span-1 mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] opacity-60 tabular-nums self-start pt-2">
                    {String(i + 1).padStart(2, '0')} / 04
                  </div>
                  <h3 className={`${titleSpan[i % titleSpan.length]} display-serif text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight`}>
                    {i % 2 === 1 ? <em className="italic font-light">{p.title}</em> : p.title}
                  </h3>
                  <div className="hidden md:block col-span-2 mono text-[10px] uppercase tracking-[0.25em] opacity-60 self-start pt-2">
                    {p.category}
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-2 overflow-hidden h-16 sm:h-24 md:h-28 ml-auto w-full max-w-[200px]">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                  </div>
                  <ArrowUpRight className="hidden sm:block col-span-1 ml-auto w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500 self-start mt-2" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProjects;
