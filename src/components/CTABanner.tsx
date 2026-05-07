import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTABanner: React.FC = () => {
  return (
    <section className="py-16 px-4 relative z-10">
      <div className="px-0">
        <div className="rounded-2xl bg-foreground p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[hsl(var(--optimind-glow)/0.15)] rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wider text-white mb-4 relative z-10">
            Prêt à donner vie à votre projet ?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8 text-sm relative z-10">
            Obtenez un devis gratuit et personnalisé sous 48h. Sans engagement, 
            avec une première consultation offerte pour comprendre vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/devis"
              className="px-8 py-3 rounded-full bg-[hsl(var(--optimind-card))] text-foreground text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-colors flex items-center gap-2 shadow-lg"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 rounded-full border border-white/20 text-white text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;