import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { disciplines } from '@/data/disciplines';
import AutoVideo from './media/AutoVideo';

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { pathname } = useLocation();
  const onServicesPage = pathname === '/services';

  return (
    <section ref={ref} id="services" className="section-x section-y border-t hairline">
      <div className="grid grid-cols-12 gap-6 mb-10 sm:mb-14">
        <div className="col-span-12 md:col-span-3">
          <span className="ticker-tag">§ Capacités</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="display-serif fluid-display font-light leading-[0.95]">
            Six disciplines, <span className="italic">un seul</span><br />
            atelier — <span className="text-[hsl(var(--tangerine))]">à votre service.</span>
          </h2>
        </div>
      </div>

      {/* Cinematic full-bleed video — atelier en production */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-12 sm:mb-16 grid grid-cols-12 gap-6"
      >
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <AutoVideo
            src="/showcase/v2.mp4"
            className="w-full h-auto max-h-[80vh] object-contain bg-foreground/5"
          />
        </div>
      </motion.div>

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
