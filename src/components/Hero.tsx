import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Asterisk } from 'lucide-react';
import LiveClock from './LiveClock';
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
            <span> SIG/topographie </span>
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

      {/* 3D logo — full-bleed cinematic stage */}
      <div className="mt-14 md:mt-20 -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14 xl:-mx-20">
        <div className="relative h-[480px] md:h-[640px] w-full bg-foreground overflow-hidden">
          <Scene3D />

          {/* Editorial overlay — caption + CTA */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pb-8 md:pb-10">
            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-6">
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--tangerine))]">
                  § Notre signature, en mouvement
                </span>
                <p className="display-serif text-2xl md:text-4xl font-light leading-[1.05] text-[hsl(var(--cream))] mt-3 max-w-xl">
                  Précision, <span className="italic">matière</span>,
                  <br className="hidden md:block" /> rigueur éditoriale.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-9 md:flex md:justify-end pointer-events-auto">
                <Link
                  to="/devis"
                  className="group inline-flex items-center gap-2 px-6 py-4 bg-[hsl(var(--tangerine))] text-foreground mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:opacity-90 transition-opacity"
                >
                  Lancer votre projet
                  <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
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
