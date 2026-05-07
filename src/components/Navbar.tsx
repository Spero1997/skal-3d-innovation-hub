import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/services', label: 'SERVICES' },
  { to: '/projects', label: 'PROJETS' },
  { to: '/expertise', label: 'EXPERTISE' },
  { to: '/contact', label: 'CONTACT' },
  { to: '/devis', label: 'DEVIS' },
];

const mobileLinks = [
  { to: '/devis', label: 'DEMANDER UN DEVIS' },
  { to: '/contact', label: 'NOUS CONTACTER' },
  { to: '/services', label: 'NOS SERVICES' },
  { to: '/projects', label: 'NOS RÉALISATIONS' },
  { to: '/expertise', label: 'NOTRE EXPERTISE' },
  { to: '/legal', label: 'MENTIONS LÉGALES' },
  { to: '/privacy', label: 'CONFIDENTIALITÉ' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Trap focus inside mobile menu & handle Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isMenuOpen || !menuRef.current) return;

    if (e.key === 'Escape') {
      setIsMenuOpen(false);
      toggleRef.current?.focus();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-focus first link when menu opens
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const first = menuRef.current.querySelector<HTMLElement>('a[href]');
      first?.focus();
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--optimind-card))] border-b border-[hsl(var(--border))]">
      {/* Subtle gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--optimind-glow))] to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2"
          >
            <img 
              src="/lovable-uploads/1f7a8d37-3d09-4661-a1c6-b81a7614539c.png" 
              alt="SKAL Service Logo" 
              className="h-8"
            />
            <span className="font-display font-bold uppercase tracking-[0.2em] text-sm text-foreground">
              SKAL SERVICE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--optimind-glow))] rounded-md"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-nav"
          role="dialog"
          aria-label="Menu de navigation mobile"
          className="md:hidden bg-[hsl(var(--optimind-card))] border-t border-[hsl(var(--border))] p-6 animate-fade-in-fast"
        >
          <nav aria-label="Navigation mobile" className="flex flex-col space-y-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors py-3 border-b border-[hsl(var(--border)/0.3)] last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--optimind-glow))] rounded-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-5 border-t border-[hsl(var(--border))] space-y-3">
            <a href="tel:+2290190315546" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--optimind-glow))] rounded-sm">
              <Phone className="w-4 h-4 text-[hsl(var(--optimind-glow))]" /> +229 01 90315546
            </a>
            <a href="mailto:skalservice.0@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--optimind-glow))] rounded-sm">
              <Mail className="w-4 h-4 text-[hsl(var(--optimind-glow))]" /> skalservice.0@gmail.com
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
