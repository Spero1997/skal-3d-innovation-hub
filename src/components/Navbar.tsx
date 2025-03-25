
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-skal-dark"
          >
            <span className="text-skal-blue">Skal</span> Service
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Services', 'Expertise', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 hover:text-skal-blue transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="bg-skal-blue text-white px-5 py-2 rounded-md hover:bg-opacity-90 transition-colors">
              Contact Us
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-skal-blue transition-colors"
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
            {['Services', 'Expertise', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-base font-medium text-gray-700 hover:text-skal-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button 
              className="bg-skal-blue text-white w-full px-5 py-2 rounded-md hover:bg-opacity-90 transition-colors mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
