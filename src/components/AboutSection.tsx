import React, { useRef } from 'react';
import { Target, Eye, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const AboutSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 relative z-10">
      <div>
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-4xl font-display font-bold uppercase tracking-wide mb-4 text-foreground"
          >
            L'EXCELLENCE AU SERVICE DE VOS AMBITIONS
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm"
          >
            Skal Service est un cabinet pluridisciplinaire basé au Bénin, spécialisé en design graphique, 
            cartographie, arpentage topographique et conseil en intelligence artificielle. Nous transformons 
            vos idées en solutions concrètes et innovantes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="optimind-service-card rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-black/[0.04] flex items-center justify-center">
              <Target className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wider">Notre Mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Accompagner les entreprises, collectivités et porteurs de projets dans leur transformation 
              numérique et spatiale avec des solutions sur mesure et une expertise de pointe.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="optimind-service-card rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-black/[0.04] flex items-center justify-center">
              <Eye className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wider">Notre Vision</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Devenir la référence ouest-africaine en matière de services intégrés alliant créativité, 
              technologie et rigueur scientifique pour des résultats qui dépassent les attentes.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="optimind-service-card rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-black/[0.04] flex items-center justify-center">
              <Zap className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wider">Nos Valeurs</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Précision, innovation et engagement. Chaque projet est traité avec la même exigence de qualité, 
              dans le respect des délais et avec une communication transparente.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;