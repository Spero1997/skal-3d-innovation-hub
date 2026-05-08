import React, { useRef, useState, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { articles } from '@/data/articles';

type Filter = 'all' | 'article' | 'case-study';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'case-study', label: 'Études de cas' },
  { id: 'article', label: 'Articles' },
];

const ArticlesGallery: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');

  const items = useMemo(
    () => (filter === 'all' ? articles : articles.filter((a) => a.type === filter)),
    [filter]
  );

  return (
    <section id="insights" ref={ref} className="px-6 md:px-10 py-24 border-t hairline">
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-7">
          <span className="ticker-tag">§ Insights & Réalisations</span>
          <h2 className="display-serif text-5xl md:text-7xl font-light leading-[0.95] mt-4">
            Articles & <span className="italic">études de cas.</span>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
          <p className="text-base text-foreground/70 leading-relaxed">
            Un aperçu de nos chantiers récents et des réflexions de l'équipe sur la cartographie, le foncier et la conduite de projet.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-10 flex-wrap">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`mono text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-colors duration-300 ${
                active
                  ? 'bg-foreground text-[hsl(var(--cream))] border-foreground'
                  : 'border-[hsl(var(--ink))/0.2] hover:border-foreground'
              }`}
              aria-pressed={active}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a, i) => (
          <motion.article
            key={a.id}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={inView || reduceMotion ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            className="group relative border hairline bg-[hsl(var(--cream))] overflow-hidden flex flex-col"
          >
            <div className="relative overflow-hidden aspect-[4/3] bg-muted">
              <img
                src={a.image}
                alt={a.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <span className="absolute top-3 left-3 mono text-[10px] uppercase tracking-[0.2em] bg-foreground text-[hsl(var(--cream))] px-2.5 py-1 rounded-full">
                {a.tag ?? (a.type === 'case-study' ? 'Étude de cas' : 'Article')}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{a.category}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" />{a.readTime}</span>
              </div>

              <h3 className="display-serif text-2xl font-light leading-tight">
                {a.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{a.excerpt}</p>

              <div className="flex items-center justify-between pt-4 mt-auto border-t hairline">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.date}</span>
                <span className="inline-flex items-center gap-1.5 mono text-[10px] uppercase tracking-[0.2em] group-hover:text-[hsl(var(--tangerine))] transition-colors">
                  Lire <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-500" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default ArticlesGallery;