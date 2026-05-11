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
            Un atelier <span className="italic">pluridisciplinaire</span>.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/80 max-w-md">
            Skal Services réunit graphistes, géomètres et ingénieurs IA sous le même toit.
            Nous concevons des objets utiles&nbsp;: chartes graphiques qui tiennent la route,
            cartes que l'on lit sans manuel, automatisations qui font gagner des heures.
          </p>
        </motion.div>
      </div>

      <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-[hsl(var(--ink))/0.12] border hairline">
          {principles.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-background p-6 sm:p-8 group hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500"
            >
              <div className="flex items-baseline justify-between mb-6 sm:mb-8">
                <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-60">{p.n}</span>
                <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-60">Principe</span>
              </div>
              <h3 className="display-serif text-2xl sm:text-3xl">{p.t}</h3>
              <p className="text-sm mt-3 opacity-70">{p.d}</p>
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default AboutSection;
