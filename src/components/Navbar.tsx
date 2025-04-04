import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const marqueeText = "TECHNOLOGIES MODERNES • CONCEPTION • ARPENTAGE • CARTOGRAPHIE • IA • INNOVATION • PRÉCISION • EXPERTISE • SOLUTIONS GÉOMATIQUES DE POINTE";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'py-4 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      {/* Bande défilante horizontale */}
      <div className="marquee bg-skal-orange text-white py-1 px-2 text-sm font-medium">
        <div className="marquee-content" data-content={marqueeText}>
          {marqueeText}
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-skal-black"
          >
            <img 
              src="/lovable-uploads/1f7a8d37-3d09-4661-a1c6-b81a7614539c.png" 
              alt="SKAL Service Logo" 
              className={`h-10 ${
                isScrolled 
                  ? 'opacity-100' 
                  : 'opacity-0 absolute'
              }`}
            />
            <span className={`font-bold ${
              isScrolled 
                ? 'opacity-0 absolute' 
                : 'opacity-100'
            }`}>
              SKAL Service
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/services"
              className="text-sm font-medium text-gray-700 hover:text-skal-orange transition-colors"
            >
              Services
            </Link>
            <Link
              to="/expertise"
              className="text-sm font-medium text-gray-700 hover:text-skal-orange transition-colors"
            >
              Expertise
            </Link>
            <Link
              to="/projects"
              className="text-sm font-medium text-gray-700 hover:text-skal-orange transition-colors"
            >
              Projets
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-gray-700 hover:text-skal-orange transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-skal-orange transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white glass-card absolute top-full left-0 right-0 p-4 animate-fade-in-fast">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/services"
              className="text-base font-medium text-gray-700 hover:text-skal-orange transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/expertise"
              className="text-base font-medium text-gray-700 hover:text-skal-orange transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Expertise
            </Link>
            <Link
              to="/projects"
              className="text-base font-medium text-gray-700 hover:text-skal-orange transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Projets
            </Link>
            <Link
              to="/contact"
              className="text-base font-medium text-gray-700 hover:text-skal-orange transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
