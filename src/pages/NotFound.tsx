
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-skal-gray/80 to-white/95 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-6 text-skal-black">404</h1>
        <h2 className="text-2xl font-medium text-skal-black mb-3">Page introuvable</h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-skal-orange text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            <Home size={18} />
            <span>Accueil</span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
