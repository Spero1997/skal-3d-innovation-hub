import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';

const CTABanner: React.FC = () => {
  return (
    <section className="px-6 md:px-10 py-24">
      <div className="bg-foreground text-[hsl(var(--cream))] rounded-md p-10 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--tangerine))/0.15] rounded-full blur-[150px] pointer-events-none" />
        <div className="grid grid-cols-12 gap-6 relative">
          <div className="col-span-12 md:col-span-8">
            <span className="ticker-tag" style={{ color: 'hsl(var(--cream)/0.6)' }}>§ Prochaine étape</span>
            <h2 className="display-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] mt-6">
              Parlons de<br />
              <span className="italic text-[hsl(var(--tangerine))]">votre projet.</span>
            </h2>
            <p className="mt-8 text-base md:text-lg max-w-md text-[hsl(var(--cream))/0.7] leading-relaxed">
              Devis gratuit sous 48h. Première consultation offerte, sans engagement,
              pour évaluer ensemble la faisabilité.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:flex-col md:items-end md:justify-end gap-3">
            <Link to="/devis" className="inline-flex items-center gap-2 px-6 py-4 bg-[hsl(var(--tangerine))] text-foreground mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:opacity-90 transition-opacity">
              Devis gratuit <ArrowDownRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-4 border border-[hsl(var(--cream))/0.3] text-[hsl(var(--cream))] mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:bg-[hsl(var(--cream))/0.1] transition-colors">
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
