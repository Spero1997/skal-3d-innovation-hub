import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import skalLogo from '@/assets/skal-logo.png';
import LiveClock from './LiveClock';

const disciplines = [
  'Architecture & BTP',
  'Géomatique & SIG',
  'Graphisme & IA',
  'Web & Digital',
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-foreground text-[hsl(var(--cream))] section-x pt-20 sm:pt-28 lg:pt-36 pb-8 relative overflow-hidden">
      {/* Colophon line */}
      <div className="mono text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.4] mb-12 sm:mb-16 flex items-center gap-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tangerine))]" />
        Colophon — Édition {year}
        <span className="flex-1 h-px bg-[hsl(var(--cream))/0.15]" />
        <span className="hidden sm:inline">Vol. 01 · Bénin → Afrique de l'Ouest</span>
      </div>

      {/* Masthead — asymmetric 12-col grid */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        {/* Wordmark + manifesto */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <img
            src={skalLogo}
            alt="Skal Services"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain brightness-0 invert"
            loading="lazy"
          />
          <p className="mt-8 max-w-sm text-[hsl(var(--cream))/0.65] text-sm leading-relaxed">
            <span className="display-serif italic text-[hsl(var(--cream))]">SKAL SERVICES SARL</span> — guichet
            unique multidisciplinaire. Quatre métiers réunis sous un même toit, un seul interlocuteur,
            quatre expertises livrées avec la même rigueur.
          </p>
        </div>

        {/* Disciplines index — offset like a publication TOC */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-7">
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.4] mb-5 pb-3 border-b border-[hsl(var(--cream))/0.15]">
            § Disciplines
          </div>
          <ul className="space-y-3 display-serif text-lg sm:text-xl font-light leading-tight">
            {disciplines.map((d, i) => (
              <li key={d} className="flex items-baseline gap-3">
                <span className="mono text-[10px] tabular-nums text-[hsl(var(--cream))/0.4]">0{i + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation + joindre stacked */}
        <div className="col-span-12 lg:col-span-3 lg:col-start-10 grid grid-cols-2 lg:grid-cols-1 gap-12 lg:gap-10">
          <div>
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.4] mb-5 pb-3 border-b border-[hsl(var(--cream))/0.15]">
              § Index
            </div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300">Services</Link></li>
              <li><Link to="/expertise" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300">Studio</Link></li>
              <li><Link to="/projects" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300">Travaux</Link></li>
              <li><Link to="/contact" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300">Contact</Link></li>
              <li><Link to="/devis" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300">Devis</Link></li>
            </ul>
          </div>
          <div>
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.4] mb-5 pb-3 border-b border-[hsl(var(--cream))/0.15]">
              § Joindre
            </div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="tel:+2290197586022" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300 tabular-nums">+229 01 97 58 60 22</a></li>
              <li><a href="tel:+2290167750778" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300 tabular-nums">+229 01 67 75 07 78</a></li>
              <li><a href="mailto:servicesskal@gmail.com" className="hover:text-[hsl(var(--tangerine))] transition-colors duration-300 break-all">servicesskal@gmail.com</a></li>
              <li className="text-[hsl(var(--cream))/0.6]">Abomey-Calavi · Tokan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal registry — minimal mono row */}
      <div className="mt-20 sm:mt-28 pt-8 border-t border-[hsl(var(--cream))/0.15]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mono text-[9px] uppercase tracking-[0.25em] text-[hsl(var(--cream))/0.5]">
          <div>
            <div className="text-[hsl(var(--cream))/0.3] mb-1">RCCM</div>
            <div className="text-[hsl(var(--cream))/0.7] tabular-nums">RB/ABC/21 A 26495</div>
          </div>
          <div>
            <div className="text-[hsl(var(--cream))/0.3] mb-1">IFU</div>
            <div className="text-[hsl(var(--cream))/0.7] tabular-nums">0202112334177</div>
          </div>
          <div>
            <div className="text-[hsl(var(--cream))/0.3] mb-1">Agréments</div>
            <div className="text-[hsl(var(--cream))/0.7]">DGT · DGC · AL</div>
          </div>
          <div>
            <div className="text-[hsl(var(--cream))/0.3] mb-1">Siège</div>
            <div className="text-[hsl(var(--cream))/0.7]">Bénin, BJ</div>
          </div>
        </div>
      </div>

      {/* Bottom rail */}
      <div className="mt-10 pt-6 border-t border-[hsl(var(--cream))/0.1] flex flex-wrap items-center justify-between gap-4 mono text-[9px] uppercase tracking-[0.25em] text-[hsl(var(--cream))/0.4]">
        <span>© {year} Skal Services · Tous droits réservés</span>
        <div className="flex flex-wrap gap-5">
          <Link to="/legal" className="hover:text-[hsl(var(--cream))] transition-colors">Mentions légales</Link>
          <Link to="/privacy" className="hover:text-[hsl(var(--cream))] transition-colors">Confidentialité</Link>
          <Link to="/terms" className="hover:text-[hsl(var(--cream))] transition-colors">CGV</Link>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--tangerine))] transition-colors"
            aria-label="Accès sécurisé"
          >
            <Lock className="w-2.5 h-2.5" />
            Accès sécurisé
          </Link>
        </div>
        <span className="tabular-nums"><LiveClock /></span>
      </div>
    </footer>
  );
};

export default Footer;
