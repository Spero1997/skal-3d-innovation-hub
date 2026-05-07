import React from 'react';
import { Target, Eye, Zap } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="section-padding relative z-10">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
            <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Qui sommes-nous</span>
          </div>
          <h2 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
            L'EXCELLENCE AU SERVICE DE VOS AMBITIONS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Skal Service est un cabinet pluridisciplinaire basé au Bénin, spécialisé en design graphique, 
            cartographie, arpentage topographique et conseil en intelligence artificielle. Nous transformons 
            vos idées en solutions concrètes et innovantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="optimind-service-card rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[hsl(var(--optimind-glow)/0.1)] flex items-center justify-center">
              <Target className="w-7 h-7 text-[hsl(var(--optimind-glow))]" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wider">Notre Mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Accompagner les entreprises, collectivités et porteurs de projets dans leur transformation 
              numérique et spatiale avec des solutions sur mesure et une expertise de pointe.
            </p>
          </div>

          <div className="optimind-service-card rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[hsl(var(--optimind-glow)/0.1)] flex items-center justify-center">
              <Eye className="w-7 h-7 text-[hsl(var(--optimind-glow))]" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wider">Notre Vision</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Devenir la référence ouest-africaine en matière de services intégrés alliant créativité, 
              technologie et rigueur scientifique pour des résultats qui dépassent les attentes.
            </p>
          </div>

          <div className="optimind-service-card rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[hsl(var(--optimind-glow)/0.1)] flex items-center justify-center">
              <Zap className="w-7 h-7 text-[hsl(var(--optimind-glow))]" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wider">Nos Valeurs</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Précision, innovation et engagement. Chaque projet est traité avec la même exigence de qualité, 
              dans le respect des délais et avec une communication transparente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;