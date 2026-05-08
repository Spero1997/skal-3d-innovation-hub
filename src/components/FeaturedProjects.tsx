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
      <div className="flex items-end justify-between mb-10 sm:mb-12 flex-wrap gap-6">
        <div>
          <span className="ticker-tag">§ Sélection 2024–2026</span>
          <h2 className="display-serif fluid-display font-light leading-[0.95] mt-4">
            Travaux <span className="italic">récents.</span>
          </h2>
        </div>
        <Link to="/projects" className="btn-ghost">Tout voir →</Link>
      </div>

      <div className="divide-y divide-[hsl(var(--ink))/0.12] border-t border-b hairline">
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              to={`/projects/${p.id}`}
              className="group grid grid-cols-12 gap-3 sm:gap-4 items-center py-5 sm:py-6 md:py-8 hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 px-3 sm:px-4 -mx-3 sm:-mx-4"
            >
              <div className="col-span-1 mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] opacity-60">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="col-span-6 md:col-span-5 display-serif text-lg sm:text-2xl md:text-4xl font-light leading-tight">
                {p.title}
              </h3>
              <div className="hidden md:block col-span-3 mono text-[11px] uppercase tracking-[0.2em] opacity-60">
                {p.category}
              </div>
              <div className="col-span-3 md:col-span-2 overflow-hidden rounded-sm h-12 sm:h-16 md:h-20">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
              </div>
              <ArrowUpRight className="col-span-2 md:col-span-1 ml-auto w-4 h-4 sm:w-5 sm:h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
