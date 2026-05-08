import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, PenTool, Palette, Code2, Map, Compass, BrainCircuit } from 'lucide-react';

const services = [
  { num: '01', icon: PenTool, title: 'Design graphique', tag: 'Identité', desc: "Logos, chartes, supports imprimés et digitaux qui ancrent votre marque dans le réel." },
  { num: '02', icon: Palette, title: 'Stratégie de marque', tag: 'Brand', desc: 'Positionnement, voix, narration. Un récit qui tient debout sur dix ans.' },
  { num: '03', icon: Code2, title: 'Web & application', tag: 'Code', desc: 'Sites éditoriaux, e-commerce et applications sur mesure, pensés pour durer.' },
  { num: '04', icon: Map, title: 'Cartographie SIG', tag: 'Géo', desc: 'Cartes thématiques, modélisation 3D du territoire et tableaux de bord SIG.' },
  { num: '05', icon: Compass, title: 'Arpentage', tag: 'Terrain', desc: 'Levés topographiques de précision, implantation et suivi de chantier.' },
  { num: '06', icon: BrainCircuit, title: 'Conseil IA', tag: 'IA', desc: 'Audit, automatisations LLM, analyses prédictives intégrées à vos outils métier.' },
];

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="services" className="px-6 md:px-10 py-24 border-t hairline">
      <div className="grid grid-cols-12 gap-6 mb-14">
        <div className="col-span-12 md:col-span-3">
          <span className="ticker-tag">§ Capacités</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="display-serif text-5xl md:text-7xl font-light leading-[0.95]">
            Six disciplines, <span className="italic">un seul</span><br />
            atelier — <span className="text-[hsl(var(--tangerine))]">à votre service.</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {services.map((s, i) => {
          const Icon = s.icon;
          // Bento sizing: items 0,3 wider; others normal
          const span = i === 0 || i === 3 ? 'md:col-span-5' : 'md:col-span-3.5';
          return (
            <motion.article
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
              className={`col-span-12 md:col-span-4 group relative border hairline rounded-md p-6 bg-[hsl(var(--cream))] hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 cursor-pointer min-h-[260px] flex flex-col`}
            >
              <div className="flex items-start justify-between">
                <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-60">{s.num} / 06</span>
                <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500" />
              </div>

              <Icon className="w-7 h-7 mt-8 stroke-[1.2] text-[hsl(var(--tangerine))]" />

              <h3 className="display-serif text-3xl md:text-4xl font-normal mt-auto pt-6 leading-[0.95]">
                {s.title}
              </h3>
              <p className="text-sm mt-3 leading-relaxed opacity-70 group-hover:opacity-90">
                {s.desc}
              </p>
              <div className="mt-4 mono text-[10px] uppercase tracking-[0.25em] opacity-50">
                / {s.tag}
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-12 flex justify-end">
        <Link to="/services" className="btn-ghost">Toutes les capacités →</Link>
      </div>
    </section>
  );
};

export default Services;
