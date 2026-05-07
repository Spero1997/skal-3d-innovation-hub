
import React from 'react';
import { Scene3D } from './Scene3D';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden flex flex-col">
      {/* Top section with text */}
      <div className="container mx-auto px-6 pt-12 pb-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl optimind-heading leading-tight text-foreground max-w-lg animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            VOTRE PARTENAIRE EN CONCEPTION & IA
          </h1>
          
          <p 
            className="text-sm text-muted-foreground max-w-xs animate-fade-in md:text-right md:pt-2"
            style={{ animationDelay: '0.4s' }}
          >
            Nous combinons expertise technique, créativité et innovation pour donner vie à vos projets avec précision et excellence.
          </p>
        </div>

        <div 
          className="flex flex-row gap-4 mt-8 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <Link 
            to="/contact" 
            className="px-6 py-2.5 rounded-full bg-[hsl(var(--optimind-glow))] text-white text-sm font-medium uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_hsl(var(--optimind-glow)/0.3)]"
          >
            Contactez-nous
          </Link>
          <Link 
            to="/services" 
            className="px-6 py-2.5 rounded-full border border-white/20 text-foreground text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Nos Services
          </Link>
        </div>
      </div>

      {/* 3D Scene area */}
      <div className="flex-1 relative min-h-[350px] md:min-h-[450px]">
        <Scene3D />
        {/* Overlay text at bottom left */}
        <div className="absolute bottom-6 left-6 max-w-xs z-10">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Design graphique, cartographie de précision, arpentage topographique et conseil en intelligence artificielle.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
