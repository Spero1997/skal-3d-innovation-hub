import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Asterisk, MapPin } from 'lucide-react';
import LiveClock from './LiveClock';
import { Scene3D } from './Scene3D';
import { shortDisciplineImages } from '@/assets/disciplines';

const DISCIPLINES = [
  'Architecture & BTP',
  'Géomatique & SIG',
  'Graphisme & IA',
  'Web & Digital',
  'Conseil stratégique',
];

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scrollLabelY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* ── ROW 2 — Monumental editorial title with index numerals ── */}
      <div className="section-x pt-10 sm:pt-14 md:pt-20 pb-12 sm:pb-16">
        <motion.div style={{ y }} className="grid grid-cols-12 gap-x-3 sm:gap-x-6 gap-y-1">
          <TitleLine n="01" word="Concevoir," />
          <TitleLine
            n="02"
            italic
            word={
              <>
                cartographier
                <motion.span style={{ rotate }} className="inline-block ml-2 sm:ml-3 align-middle">
                  <Asterisk className="inline-block w-[0.45em] h-[0.45em] text-[hsl(var(--tangerine))]" strokeWidth={1.2} />
                </motion.span>
              </>
            }
          />
          <TitleLine n="03" word={<>&amp; <span className="scribble-underline">automatiser</span>.</>} />
        </motion.div>
      </div>

      {/* ── ROW 3 — Manifesto + CTA + vertical discipline ticker ── */}
      <div className="section-x pb-14 sm:pb-20 grid grid-cols-12 gap-6 md:gap-10 border-b hairline-strong">
        <div className="col-span-12 md:col-span-5">
          <span className="ticker-tag mb-5">§ Manifeste</span>
          <p className="display-serif text-xl sm:text-2xl md:text-3xl font-light leading-snug mt-5">
            Le <em>guichet unique</em> du Bénin pour vos projets :
            architecture, géomatique, graphisme &amp; IA, web.
            Un seul interlocuteur, <span className="italic text-[hsl(var(--tangerine))]">quatre expertises</span> — rayonnement Afrique de l'Ouest.
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

        {/* Stats — vertical stacked column */}
        <div className="col-span-6 md:col-span-2 md:col-start-7 flex flex-col gap-8 md:gap-12 pt-2">
          <StatStacked n="120" suffix="+" label="Projets livrés" />
          <StatStacked n="48" suffix="h" label="Délai devis" dot />
          <StatStacked n="06" label="Disciplines" />
        </div>

        {/* Spacious vertical discipline marquee */}
        <div className="col-span-6 md:col-span-4 md:col-start-9 relative h-72 md:h-[440px] overflow-hidden border-l hairline">
          <div
            className="absolute inset-0"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
            }}
          >
            <div className="vertical-marquee flex flex-col gap-10 md:gap-14 pl-6 md:pl-10 pt-4">
              {[...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
                <div key={i} className="group flex items-center gap-5 whitespace-nowrap">
                  <span className="w-11 h-11 shrink-0 rounded-full overflow-hidden border hairline p-[2px] transition-colors duration-500 group-hover:border-[hsl(var(--tangerine))]">
                    {shortDisciplineImages[d] ? (
                      <img
                        src={shortDisciplineImages[d]}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full grayscale transition-all duration-500 group-hover:grayscale-0"
                      />
                    ) : (
                      <span className="block w-full h-full rounded-full bg-[hsl(var(--tangerine-soft))]" />
                    )}
                  </span>
                  <span className="mono text-[11px] md:text-xs font-medium uppercase tracking-[0.28em] text-foreground transition-colors duration-500 group-hover:text-[hsl(var(--tangerine))]">
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 4 — Full-bleed 3D cinematic stage with editorial overlay ── */}
      <div className="relative">
        <div className="relative h-[420px] sm:h-[560px] md:h-[720px] w-full bg-foreground overflow-hidden">
          <Scene3D />

          {/* Top-left chapter mark */}
          <div className="absolute top-6 left-4 sm:left-6 md:left-10 lg:left-14 xl:left-20 z-20 mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.6]">
            <span className="text-[hsl(var(--tangerine))]">§</span> Chapitre 01 — Signature
          </div>
          {/* Top-right meta */}
          <div className="hidden md:block absolute top-6 right-10 lg:right-14 xl:right-20 z-20 mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.5] text-right">
            Bénin · 2026<br />
            Identité en mouvement
          </div>

          {/* Side rail numbering */}
          <div className="hidden md:flex absolute left-10 lg:left-14 xl:left-20 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.45] tabular-nums">
            <span>01</span>
            <span className="h-10 w-px bg-[hsl(var(--cream))/0.3]" />
            <span>02</span>
            <span className="h-10 w-px bg-[hsl(var(--cream))/0.3]" />
            <span>03</span>
          </div>

          {/* Bottom editorial overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pb-8 md:pb-12">
            <div className="grid grid-cols-12 gap-6 items-end border-t border-[hsl(var(--cream))/0.18] pt-6 md:pt-8">
              <div className="col-span-12 md:col-span-6">
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--tangerine))]">
                  § Notre signature, en mouvement
                </span>
                <p className="display-serif text-2xl md:text-5xl font-light leading-[1.02] text-[hsl(var(--cream))] mt-3 max-w-xl">
                  Précision, <span className="italic">matière</span>,<br className="hidden md:block" /> rigueur éditoriale.
                </p>
              </div>
              <div className="hidden md:block col-span-3 col-start-7 mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--cream))/0.5] leading-relaxed">
                3D temps réel<br />
                rendu cinématique<br />
                ↻ rotation continue
              </div>
              <div className="col-span-12 md:col-span-3 md:col-start-10 md:flex md:justify-end pointer-events-auto">
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

        {/* Animated scroll cue */}
        <motion.div
          style={{ y: scrollLabelY }}
          className="section-x py-6 flex items-center justify-between mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span>Scroll pour explorer</span>
          <span className="h-px flex-1 mx-6 bg-[hsl(var(--ink))/0.15]" />
          <span className="tabular-nums">↓ 04 sections</span>
        </motion.div>
      </div>
    </section>
  );
};

const TitleLine: React.FC<{ n: string; word: React.ReactNode; italic?: boolean }> = ({ n, word, italic }) => (
  <div className="col-span-12 flex items-start gap-3 sm:gap-5 md:gap-7 border-t hairline first:border-t-0 pt-2 md:pt-3">
    <span className="mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--tangerine))] tabular-nums pt-3 md:pt-6 shrink-0">
      {n}
    </span>
    <span
      className={`display-serif fluid-display-xl leading-[0.85] font-light tracking-[-0.04em] ${italic ? 'italic font-normal' : ''}`}
    >
      {word}
    </span>
  </div>
);

const StatStacked: React.FC<{ n: string; label: string; suffix?: string; dot?: boolean }> = ({ n, label, suffix, dot }) => (
  <div className="flex flex-col">
    <div className="flex items-baseline">
      <span className="display-serif text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-none">
        {n}
      </span>
      {suffix && (
        <span className="display-serif text-3xl md:text-4xl font-light ml-1 leading-none" style={{ color: suffix === '+' ? 'hsl(var(--tangerine))' : undefined }}>
          {suffix}
        </span>
      )}
      {dot && <span className="w-2 h-2 rounded-full bg-[hsl(var(--tangerine))] ml-2 mb-2 self-end" />}
    </div>
    <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-3">{label}</span>
  </div>
);

export default Hero;
