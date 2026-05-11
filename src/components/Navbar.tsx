import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import skalLogo from '@/assets/skal-logo.png';

const links = [
  { to: '/', label: 'Index' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Travaux' },
  { to: '/expertise', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');
  const location = useLocation();

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: 'Africa/Porto-Novo'
      }).format(d);
      setTime(fmt + ' GMT+1');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b hairline">
      <div className="section-x h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        <Link to="/" className="flex items-center gap-3 group min-w-0" aria-label="Skal Services — Accueil">
          <img
            src={skalLogo}
            alt="Skal Services"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain"
            loading="eager"
            decoding="async"
          />
          <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hidden lg:inline truncate">
            Studio · BJ
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 rounded-full transition-colors ${
                  active ? 'text-foreground bg-[hsl(var(--ink))/0.06]' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden lg:inline">
            {time}
          </span>
          <Link to="/devis" className="btn-ink !py-2 !px-4">Devis →</Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t hairline bg-background animate-fade-in-fast">
          <nav className="section-x py-6 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="display-serif text-2xl sm:text-3xl py-2 hover:text-[hsl(var(--tangerine))] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/devis" onClick={() => setOpen(false)} className="btn-ink mt-4 w-fit">
              Demander un devis →
            </Link>
            <div className="mt-6 pt-4 border-t hairline mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {time}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
