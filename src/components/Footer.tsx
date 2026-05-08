import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-foreground text-[hsl(var(--cream))] section-x pt-12 sm:pt-16 pb-8 relative overflow-hidden">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7">
          <h3 className="display-serif fluid-display-lg font-light leading-[0.85] break-words">
            Skal<span className="text-[hsl(var(--tangerine))]">.</span><br />
            <span className="italic">Service</span>
          </h3>
          <p className="mt-6 max-w-md text-[hsl(var(--cream))/0.6] text-sm leading-relaxed">
            Studio béninois — design éditorial, cartographie SIG, arpentage et conseil en intelligence artificielle.
          </p>
        </div>

        <div className="col-span-6 md:col-span-2 md:col-start-9">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--cream))/0.5] mb-4">Studio</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-[hsl(var(--tangerine))] transition-colors">Services</Link></li>
            <li><Link to="/expertise" className="hover:text-[hsl(var(--tangerine))] transition-colors">Expertise</Link></li>
            <li><Link to="/projects" className="hover:text-[hsl(var(--tangerine))] transition-colors">Travaux</Link></li>
            <li><Link to="/contact" className="hover:text-[hsl(var(--tangerine))] transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-2">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--cream))/0.5] mb-4">Joindre</div>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:+2290190315546" className="hover:text-[hsl(var(--tangerine))] transition-colors">+229 01 90 31 55 46</a></li>
            <li><a href="mailto:skalservice.0@gmail.com" className="hover:text-[hsl(var(--tangerine))] transition-colors break-all">skalservice.0@gmail.com</a></li>
            <li className="text-[hsl(var(--cream))/0.6]">Abomey-Calavi, Tokan</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 pt-6 border-t border-[hsl(var(--cream))/0.15] flex flex-wrap items-center justify-between gap-4 mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[hsl(var(--cream))/0.5]">
        <span>© {year} Skal Service · Tous droits réservés</span>
        <div className="flex flex-wrap gap-3 sm:gap-6">
          <Link to="/legal" className="hover:text-[hsl(var(--cream))]">Mentions légales</Link>
          <Link to="/privacy" className="hover:text-[hsl(var(--cream))]">Confidentialité</Link>
          <Link to="/terms" className="hover:text-[hsl(var(--cream))]">CGV</Link>
        </div>
        <span>Made in Cotonou · BJ</span>
      </div>
    </footer>
  );
};

export default Footer;
