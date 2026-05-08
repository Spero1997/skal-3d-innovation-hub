import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Asterisk } from 'lucide-react';
import { Scene3D } from './Scene3D';

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section ref={ref} className="relative section-x pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden">
      {/* Top meta row */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hidden md:inline">
          <LiveClock />
        </span>
      </div>

      {/* MASSIVE editorial title */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 items-end">
        <motion.h1
          style={{ y }}
          className="col-span-12 display-serif fluid-display-xl leading-[0.85] font-light tracking-[-0.04em]"
        >
          <span className="block">Concevoir,</span>
          <span className="block italic font-normal">
            cartographier
            <motion.span style={{ rotate }} className="inline-block ml-3 align-middle">
              <Asterisk className="inline-block w-[0.6em] h-[0.6em] text-[hsl(var(--tangerine))]" strokeWidth={1.2} />
            </motion.span>
          </span>
          <span className="block">
            &amp; <span className="scribble-underline">automatiser</span>.
          </span>
        </motion.h1>
      </div>

      {/* Bottom metadata row */}
      <div className="grid grid-cols-12 gap-6 mt-10 sm:mt-12 md:mt-16">
        <div className="col-span-12 md:col-span-5">
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 max-w-md">
            Un studio béninois indépendant qui mêle <em className="display-serif">design éditorial</em>,
            <span className="mono text-sm"> SIG/topographie </span>
            et conseil en intelligence artificielle. Une équipe, un toit, six disciplines.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link to="/devis" className="btn-ink">
              Démarrer un projet <ArrowDownRight className="w-4 h-4" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              Voir les travaux
            </Link>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-7 grid grid-cols-3 gap-3 sm:gap-4 mt-2">
          <Stat n="120+" label="Projets livrés" />
          <Stat n="48h" label="Délai devis" />
          <Stat n="06" label="Disciplines" />
        </div>

        <div className="col-span-12 md:col-span-2 flex md:justify-end items-end mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Scroll ↓
        </div>
      </div>

      {/* 3D anchor at bottom */}
      <div className="mt-12 sm:mt-16 md:mt-24 relative h-[45vh] sm:h-[55vh] md:h-[70vh] min-h-[320px] border-t hairline pt-6">
        <div className="absolute top-6 left-0 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground pr-4">
          Fig. 01 — Réseau neural · rendu temps réel
        </div>
        <Scene3D />
      </div>
    </section>
  );
};

const Stat: React.FC<{ n: string; label: string }> = ({ n, label }) => (
  <div className="border-t hairline pt-3">
    <div className="display-serif text-2xl sm:text-3xl md:text-4xl">{n}</div>
    <div className="mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>
  </div>
);

export default Hero;
