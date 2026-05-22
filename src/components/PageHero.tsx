import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeroProps {
  index: string;          // e.g. "01"
  kicker: string;         // e.g. "Catalogue"
  title: React.ReactNode; // supports italic spans
  lede?: React.ReactNode;
  meta?: string;          // small mono label, right column
}

const PageHero: React.FC<PageHeroProps> = ({ index, kicker, title, lede, meta }) => {
  return (
    <header className="section-x pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 border-b hairline">
      {/* Breadcrumb / index row */}
      <div className="grid grid-cols-12 gap-4 mb-10 sm:mb-14 items-baseline">
        <div className="col-span-6 md:col-span-4 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground tabular-nums">
          <span className="text-[hsl(var(--tangerine))]">§</span> {index} — {kicker}
        </div>
        <div className="col-span-6 md:col-span-4 md:col-start-9 md:text-right mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {meta ?? (
            <Link to="/" className="hover:text-foreground transition-colors">← Accueil</Link>
          )}
        </div>
      </div>

      {/* Title with asymmetric offset */}
      <div className="grid grid-cols-12 gap-4 items-end">
        <h1 className="col-span-12 md:col-span-10 md:col-start-2 display-serif fluid-display leading-[0.88] font-light tracking-[-0.03em]">
          {title}
        </h1>
      </div>

      {lede && (
        <div className="grid grid-cols-12 gap-4 mt-10 sm:mt-14">
          <p className="col-span-12 md:col-span-5 md:col-start-7 text-base md:text-lg leading-relaxed text-foreground/75">
            {lede}
          </p>
        </div>
      )}
    </header>
  );
};

export default PageHero;