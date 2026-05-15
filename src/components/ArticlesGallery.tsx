import React, { useRef, useState, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';
import { articles } from '@/data/articles';

type Filter = 'all' | 'article' | 'case-study';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'case-study', label: 'Études de cas' },
  { id: 'article', label: 'Articles' },
];

const typeConfig = {
  'case-study': {
    badgeBg: 'bg-[hsl(var(--tangerine))]',
    badgeText: 'text-white',
    thumbBar: 'bg-[hsl(var(--tangerine))]',
    hoverGlow: 'group-hover:shadow-[0_20px_60px_-15px_hsl(var(--tangerine)/0.35)]',
    overlayLabel: 'Voir l\'étude',
  },
  'article': {
    badgeBg: 'bg-foreground',
    badgeText: 'text-[hsl(var(--cream))]',
    thumbBar: 'bg-foreground',
    hoverGlow: 'group-hover:shadow-[0_20px_60px_-15px_hsl(var(--ink)/0.25)]',
    overlayLabel: 'Lire l\'article',
  },
};

const ArticlesGallery: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = useMemo(
    () => (filter === 'all' ? articles : articles.filter((a) => a.type === filter)),
    [filter]
  );

  return (
    <section id="insights" ref={ref} className="section-x section-y border-t hairline">
      <div className="grid grid-cols-12 gap-6 mb-10 sm:mb-12">
        <div className="col-span-12 md:col-span-7">
          <span className="ticker-tag">§ Insights & Réalisations</span>
          <h2 className="display-serif fluid-display font-light leading-[0.95] mt-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((a, i) => {
          const config = typeConfig[a.type];
          const isHovered = hoveredId === a.id;

          return (
            <motion.article
              key={a.id}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={inView || reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredId(a.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative border hairline bg-[hsl(var(--cream))] overflow-hidden flex flex-col rounded-sm transition-shadow duration-500 ${config.hoverGlow}`}
            >
              {/* Image container with hover overlay */}
              <div className="relative overflow-hidden aspect-[4/3] bg-muted">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isHovered && !reduceMotion ? 'grayscale-0 scale-110' : 'grayscale'
                  }`}
                />

                {/* Dark gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 flex items-end justify-center pb-6 ${
                    isHovered && !reduceMotion ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 text-foreground text-xs font-medium backdrop-blur-sm shadow-lg">
                    <Eye className="w-3.5 h-3.5" />
                    {config.overlayLabel}
                  </span>
                </div>

                {/* Type badge */}
                <span className={`absolute top-3 left-3 mono text-[10px] uppercase tracking-[0.2em] ${config.badgeBg} ${config.badgeText} px-2.5 py-1 rounded-full shadow-sm`}>
                  {a.tag ?? (a.type === 'case-study' ? 'Étude de cas' : 'Article')}
                </span>

                {/* Thumbnail indicator strip */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        isHovered && !reduceMotion
                          ? idx === 0
                            ? `${config.thumbBar} opacity-100`
                            : 'bg-white/50 opacity-100'
                          : 'bg-white/30 opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{a.category}</span>
                </div>

                <h3 className="display-serif text-xl sm:text-2xl font-light leading-tight">
                  {a.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                  {a.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t hairline">
                  <span className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {a.date}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isHovered ? 'text-[hsl(var(--tangerine))]' : ''
                  }`}>
                    Lire{' '}
                    <ArrowUpRight
                      className={`w-3.5 h-3.5 transition-transform duration-500 ${
                        isHovered && !reduceMotion ? 'rotate-45' : ''
                      }`}
                    />
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default ArticlesGallery;
