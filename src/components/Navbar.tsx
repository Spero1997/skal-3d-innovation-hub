import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
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
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

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
    <>
    <header className="sticky top-0 z-50 w-full bg-background/75 backdrop-blur-xl border-b hairline">
      <div className="section-x h-12 sm:h-14 flex items-center justify-between gap-4 sm:gap-8">
        <Link to="/" className="flex items-center gap-3 group min-w-0" aria-label="Skal Services — Accueil">
          <img
            src={skalLogo}
            alt="Skal Services"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            loading="eager"
            decoding="async"
          />
          <span className="mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground hidden lg:inline truncate border-l hairline pl-3">
            Studio multidisciplinaire · Bénin
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 lg:gap-10">
          {links.map((l, i) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                data-active={active}
                className="nav-link inline-flex items-center gap-2 py-2"
              >
                <span className="opacity-40 text-[9px]">0{i + 1}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <span className="mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground hidden xl:inline tabular-nums">
            {time}
          </span>
          <Link
            to="/devis"
            className="group inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] py-2 pl-4 pr-2 border hairline-strong rounded-full hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500"
          >
            Devis
            <span className="w-6 h-6 rounded-full bg-[hsl(var(--tangerine))] text-foreground flex items-center justify-center text-[10px] transition-transform duration-500 group-hover:rotate-45">→</span>
          </Link>
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
          <nav className="section-x py-10 flex flex-col gap-0">
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground pb-4 mb-2 border-b hairline">
              § Navigation
            </div>
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-4 border-b hairline last:border-b-0"
                style={{ paddingLeft: `${i * 12}px` }}
              >
                <span className="mono text-[10px] tabular-nums text-muted-foreground/60">0{i + 1}</span>
                <span className="display-serif text-4xl sm:text-5xl font-light leading-none group-hover:italic group-hover:text-[hsl(var(--tangerine))] transition-all duration-300">
                  {l.label}
                </span>
              </Link>
            ))}
            <Link
              to="/devis"
              onClick={() => setOpen(false)}
              className="group inline-flex items-center justify-between mt-8 px-5 py-4 bg-foreground text-[hsl(var(--cream))] rounded-full mono text-[11px] uppercase tracking-[0.22em]"
            >
              Demander un devis
              <span className="w-7 h-7 rounded-full bg-[hsl(var(--tangerine))] text-foreground flex items-center justify-center transition-transform group-hover:rotate-45">→</span>
            </Link>
            <div className="mt-8 pt-4 border-t hairline mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground tabular-nums">
              {time}
            </div>
          </nav>
        </div>
      )}
    </header>
      {!isHome && (
        <div className="sticky top-12 sm:top-14 z-40 w-full bg-background/70 backdrop-blur-md border-b hairline">
          <div className="section-x h-10 flex items-center">
            <button
              type="button"
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
              className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
