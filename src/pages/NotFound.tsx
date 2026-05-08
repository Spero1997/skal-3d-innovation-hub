
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <OptimindLayout>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-32 pb-16">
        <div className="text-center max-w-md animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 text-foreground">404</h1>
          <h2 className="text-2xl font-medium text-foreground mb-3">Page introuvable</h2>
          <p className="text-muted-foreground mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[hsl(var(--tangerine))] text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <Home size={18} />
              <span>Accueil</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 border border-[hsl(var(--ink)/0.12)] px-6 py-3 rounded-full hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Retour</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default NotFound;
