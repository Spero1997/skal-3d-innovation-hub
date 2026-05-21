import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AutoVideo from './media/AutoVideo';

const principles = [
  { n: '01', t: 'Précision', d: 'Chaque pixel, chaque coordonnée, chaque ligne de code à sa place.' },
  { n: '02', t: 'Lenteur juste', d: 'Nous prenons le temps de comprendre avant de produire.' },
  { n: '03', t: 'Transparence', d: 'Devis clair, points hebdomadaires, pas de surprises.' },
];

const AboutSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-x section-y border-t hairline">
      {/* Marquee strip */}
      <div className="overflow-hidden -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14 xl:-mx-20 mb-14 sm:mb-20 border-y hairline py-4 sm:py-6 bg-foreground text-[hsl(var(--cream))]">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-8 sm:gap-12 px-6 display-serif text-4xl sm:text-5xl md:text-7xl font-light whitespace-nowrap">
              <span className="text-[hsl(var(--tangerine))]">Design</span><span className="opacity-30">●</span>
              <span className="italic">Précision</span><span className="opacity-30">●</span>
              <span className="text-[hsl(var(--tangerine))]">Cartographie</span><span className="opacity-30">●</span>
              <span className="italic">Innovation</span><span className="opacity-30">●</span>
              <span className="text-[hsl(var(--tangerine))]">Topographie</span><span className="opacity-30">●</span>
              <span className="italic">Stratégie</span><span className="opacity-30">●</span>
              <span className="text-[hsl(var(--tangerine))]">Intelligence Artificielle</span><span className="opacity-30">●</span>
              <span className="italic">Transparence</span><span className="opacity-30">●</span>
              <span className="italic">Sur-mesure</span><span className="opacity-30">●</span>
              <span className="italic">Engagement</span><span className="opacity-30">●</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial pairing — video LEFT, text RIGHT */}
      <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="col-span-12 md:col-span-7"
        >
          <AutoVideo
            src="/showcase/v1.mp4"
            className="w-full h-[50vh] md:h-[70vh] object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="col-span-12 md:col-span-5"
        >
          <span className="ticker-tag">§ Studio</span>
          <h2 className="display-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[0.95] mt-6">
            Un guichet unique <span className="italic">multidisciplinaire</span>.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/80 max-w-md">
            <strong>SKAL SERVICES SARL</strong> est une société multidisciplinaire immatriculée
            au Bénin, rayonnant sur l'Afrique de l'Ouest. Architecture &amp; BTP, géomatique &amp;
            cartographie, graphisme &amp; IA, web &amp; digital&nbsp;: là où d'autres se spécialisent
            sur un seul métier, nous réunissons toutes ces expertises sous le même toit.
            Un seul interlocuteur au lieu de quatre prestataires&nbsp;— c'est notre avantage
            concurrentiel.
          </p>
        </motion.div>
      </div>

      {/* Principles — asymmetric editorial rail (5 / 4 / 3 of 12) with staggered vertical offsets */}
      <div className="mt-20 sm:mt-28 lg:mt-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">
          <div className="col-span-12 md:col-span-2">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
              § Principes
            </div>
            <p className="mt-4 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
              03 — Méthode
            </p>
          </div>

          {principles.map((p, i) => {
            // Asymmetric column allocation: 5 / 4 / 3 — progressive vertical offsets
            const spans = ['md:col-span-4', 'md:col-span-3 md:col-start-6', 'md:col-span-3 md:col-start-10'];
            const offsets = ['md:mt-0', 'md:mt-16', 'md:mt-32'];
            // Mobile: alternating indent so the column doesn't feel like a generic stack
            const mobileIndent = ['ml-0', 'ml-6 sm:ml-12', 'ml-12 sm:ml-24'];
            return (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
                className={`col-span-12 ${spans[i]} ${offsets[i]} ${mobileIndent[i]} md:ml-0 group`}
              >
                <div className="border-t hairline-strong pt-4 sm:pt-5 transition-colors duration-500 group-hover:border-[hsl(var(--tangerine))]">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="display-serif italic text-5xl sm:text-6xl font-light text-foreground/15 group-hover:text-[hsl(var(--tangerine))] transition-colors duration-500 leading-none">
                      {p.n}
                    </span>
                  </div>
                  <h3 className="display-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1] tracking-tight">
                    {p.t}.
                  </h3>
                  <p className="text-sm sm:text-[15px] mt-5 text-foreground/65 leading-relaxed max-w-xs">
                    {p.d}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
