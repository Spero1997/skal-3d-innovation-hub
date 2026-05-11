import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';
import AutoVideo from './media/AutoVideo';

const CTABanner: React.FC = () => {
  return (
    <section className="section-x section-y">
      {/* Editorial paired layout — image + cinematic video CTA */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 md:col-span-5">
          <img
            src="/showcase/listening.png"
            alt="SKAL Services est à votre écoute"
            loading="lazy"
            className="w-full h-full max-h-[640px] object-cover"
          />
        </div>

        <div className="col-span-12 md:col-span-7 relative overflow-hidden text-[hsl(var(--cream))] min-h-[480px] md:min-h-[560px] flex flex-col justify-center p-6 sm:p-10 md:p-14 lg:p-16">
          {/* Background video */}
          <AutoVideo
            src="/showcase/v3.mp4"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          {/* Dark gradient scrim for legibility */}
          <div
            aria-hidden
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                'linear-gradient(120deg, hsl(var(--ink)/0.85) 0%, hsl(var(--ink)/0.65) 50%, hsl(var(--ink)/0.4) 100%)',
            }}
          />
          {/* Tangerine glow */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[hsl(var(--tangerine))/0.25] rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-[1]"
          />
          <div className="relative z-10">
            <span className="ticker-tag" style={{ color: 'hsl(var(--cream)/0.6)' }}>§ Prochaine étape</span>
            <h2 className="display-serif fluid-display-lg font-light leading-[0.95] mt-6">
              Parlons de<br />
              <span className="italic text-[hsl(var(--tangerine))]">votre projet.</span>
            </h2>
            <p className="mt-6 sm:mt-8 text-base md:text-lg max-w-md text-[hsl(var(--cream))/0.85] leading-relaxed">
              Devis gratuit sous 48h. Première consultation offerte, sans engagement,
              pour évaluer ensemble la faisabilité.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/devis" className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-4 bg-[hsl(var(--tangerine))] text-foreground mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:opacity-90 transition-opacity">
                Devis gratuit <ArrowDownRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-4 border border-[hsl(var(--cream))/0.3] text-[hsl(var(--cream))] mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:bg-[hsl(var(--cream))/0.1] transition-colors">
                Nous écrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
