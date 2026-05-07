import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/services', label: 'SERVICES' },
  { to: '/projects', label: 'PROJETS' },
  { to: '/expertise', label: 'EXPERTISE' },
  { to: '/contact', label: 'CONTACT' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--optimind-card))] border-b border-[hsl(var(--border))]">
      {/* Subtle gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--optimind-glow))] to-transparent opacity-50" />
      
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[hsl(var(--optimind-card))] border-t border-[hsl(var(--border))] p-4 animate-fade-in-fast">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
