import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { disciplines } from '@/data/disciplines';
import { domains } from '@/data/domains';
import AutoVideo from './media/AutoVideo';

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { pathname } = useLocation();
  const onServicesPage = pathname === '/services';

  return (
    <section ref={ref} id="services" className="section-x section-y border-t hairline">
      {/* 4 domaines — bento éditorial asymétrique (7/5 puis 5/7) */}
      <div className="mb-24 sm:mb-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-end mb-12 sm:mb-16">
          <div className="col-span-12 md:col-span-2">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
              § Disciplines
            </div>
            <p className="mt-4 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 tabular-nums">
              04 — Domaines
            </p>
          </div>
          <h2 className="col-span-12 md:col-span-8 md:col-start-4 display-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[0.92] tracking-tight">
            Quatre expertises,<br />
            <span className="italic text-foreground/55">un seul</span> interlocuteur.
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4 sm:gap-5">
          {domains.map((d, i) => {
            const DIcon = d.icon;
            // Bento layout: 7/5, 5/7 — alternated, with vertical offsets for asymmetry
            const bento = [
              'col-span-12 md:col-span-7 md:row-span-2 min-h-[300px] md:min-h-[440px]',
              'col-span-12 md:col-span-5 min-h-[200px] md:min-h-[210px]',
              'col-span-12 md:col-span-5 md:mt-0 min-h-[200px] md:min-h-[210px]',
              'col-span-12 md:col-span-7 md:-mt-px min-h-[260px] md:min-h-[300px]',
            ];
            const isLarge = i === 0 || i === 3;
            return (
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                className={bento[i]}
              >
                <Link
                  to={`/domaines/${d.slug}`}
                  className="group relative h-full w-full border hairline-strong p-6 sm:p-8 md:p-10 bg-[hsl(var(--cream))] hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-700 cursor-pointer flex flex-col overflow-hidden"
                >
                  {/* corner accent */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 w-8 h-px bg-[hsl(var(--tangerine))] transition-all duration-700 group-hover:w-full"
                  />
                  <div className="flex items-start justify-between">
                    <span className="mono text-[10px] uppercase tracking-[0.3em] opacity-60 tabular-nums">
                      {d.num} / 04{d.flagship ? ' · ★' : ''}
                    </span>
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-500" />
                  </div>
                  <DIcon className={`${isLarge ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'} mt-6 stroke-[1.1] text-[hsl(var(--tangerine))]`} />
                  <h3 className={`display-serif font-light mt-auto pt-8 leading-[0.92] tracking-tight ${isLarge ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-2xl sm:text-3xl md:text-4xl'}`}>
                    {d.title}
                  </h3>
                  <p className={`mt-4 leading-relaxed opacity-70 group-hover:opacity-90 ${isLarge ? 'text-base max-w-md' : 'text-sm max-w-xs'}`}>
                    {d.tagline}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Editorial pairing — text LEFT, video RIGHT */}
      <div className="grid grid-cols-12 gap-6 md:gap-10 items-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="col-span-12 md:col-span-5 order-1"
        >
          <span className="ticker-tag">§ Capacités</span>
          <h2 className="display-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] mt-6">
            Six disciplines, <span className="italic">un seul</span><br />
            atelier — <span className="text-[hsl(var(--tangerine))]">à votre service.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 max-w-md">
            Du design éditorial à l'intelligence artificielle, en passant par la cartographie
            et la topographie&nbsp;: une équipe, six expertises, un seul interlocuteur.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="col-span-12 md:col-span-7 order-2"
        >
          <AutoVideo
            src="/showcase/v2.mp4"
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {disciplines.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <Link
                to={`/services/${s.slug}`}
                aria-label={`En savoir plus sur ${s.title}`}
                className="group relative border hairline rounded-md p-5 sm:p-6 bg-[hsl(var(--cream))] hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 cursor-pointer min-h-[240px] sm:min-h-[260px] flex flex-col h-full"
              >
              <div className="flex items-start justify-between">
                <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-60">{s.num} / 06</span>
                <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500" />
              </div>

              <Icon className="w-6 h-6 sm:w-7 sm:h-7 mt-6 sm:mt-8 stroke-[1.2] text-[hsl(var(--tangerine))]" />

              <h3 className="display-serif text-2xl sm:text-3xl md:text-4xl font-normal mt-auto pt-6 leading-[0.95]">
                {s.title}
              </h3>
              <p className="text-sm mt-3 leading-relaxed opacity-70 group-hover:opacity-90">
                {s.desc}
              </p>
              <div className="mt-4 mono text-[10px] uppercase tracking-[0.25em] opacity-50">
                / {s.tag}
              </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {!onServicesPage && (
        <div className="mt-12 flex justify-end">
          <Link to="/services" className="btn-ghost">Toutes les capacités →</Link>
        </div>
      )}
    </section>
  );
};

export default Services;
