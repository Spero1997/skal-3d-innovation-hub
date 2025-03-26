
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-skal-black text-white py-12 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-white mb-4">
              <span className="flex items-center">
                <span>SK</span>
                <span className="relative">
                  <span className="absolute inset-0 text-skal-orange">▲</span>
                  A
                </span>
                <span>L</span>
              </span>
              <span className="text-white">Service</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Nous combinons expertise technique, créativité et innovation pour donner vie à vos projets avec précision et excellence.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/expertise" className="text-gray-400 hover:text-white transition-colors">Expertise</Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white transition-colors">Projets</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Abomey-Calavi, Tokan,</p>
              <p>von EPP Tokan</p>
              <p className="mt-4">
                <a href="tel:+2290190315546" className="hover:text-white transition-colors">+229 01 90315546</a>
              </p>
              <p>
                <a href="mailto:skalservice.0@gmail.com" className="hover:text-white transition-colors">skalservice.0@gmail.com</a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center md:text-left">
          <div className="md:flex md:justify-between md:items-center">
            <p className="text-gray-400">© {currentYear} Skal Service. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex justify-center md:justify-end space-x-6">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Mentions Légales</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Politique de Confidentialité</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">CGV</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
