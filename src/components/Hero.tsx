import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scene3D } from './Scene3D';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const buttonsOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  
  const scene3dScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.8]);
  const scene3dY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  
  const overlayTextOpacity = useTransform(scrollYProgress, [0.18, 0.3], [0, 1]);
  const overlayTextY = useTransform(scrollYProgress, [0.18, 0.3], [40, 0]);
  const overlayDescOpacity = useTransform(scrollYProgress, [0.25, 0.38], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full" style={{ minHeight: '200vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Page counter */}
        <motion.div 
          className="absolute top-20 left-6 z-20 text-[11px] text-muted-foreground tracking-wider"
          style={{ opacity: titleOpacity }}
        >
          001 / 005
        </motion.div>

        {/* Hero text section */}
        <motion.div 
          className="absolute top-24 left-6 right-6 z-20 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] text-foreground max-w-md uppercase tracking-wide">
            VOTRE PARTENAIRE EN CONCEPTION & IA
          </h1>
          
          <motion.p 
            className="text-xs text-muted-foreground max-w-[220px] md:text-right md:pt-1 leading-relaxed"
            style={{ opacity: subtitleOpacity }}
          >
            Nous combinons expertise technique, créativité et innovation pour donner vie à vos projets avec précision et excellence.
          </motion.p>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="absolute top-52 md:top-48 left-6 z-20 flex flex-row gap-3"
          style={{ opacity: buttonsOpacity }}
        >
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full bg-foreground text-[hsl(var(--optimind-card))] text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_hsl(var(--optimind-glow)/0.2)]"
          >
            Contactez-nous
          </Link>
          <Link
            to="/services"
            className="px-6 py-2.5 rounded-full border border-black/15 text-foreground text-xs font-medium uppercase tracking-wider hover:bg-black/5 transition-colors"
          >
            Nos Services
          </Link>
        </motion.div>

        {/* 3D Scene area - centered, scales up on scroll */}
        <motion.div 
          className="absolute inset-0 top-[35%] md:top-[30%] flex items-start justify-center z-10"
          style={{ scale: scene3dScale, y: scene3dY }}
        >
          <div className="w-full h-[55vh] md:h-[60vh]">
            <Scene3D />
          </div>
        </motion.div>

        {/* Overlay text that appears on scroll */}
        <motion.div 
          className="absolute bottom-24 left-6 z-20 max-w-sm"
          style={{ opacity: overlayTextOpacity, y: overlayTextY }}
        >
          <h2 className="text-xl md:text-3xl font-display font-bold uppercase tracking-wide text-foreground leading-tight">
            VOTRE CABINET PLURIDISCIPLINAIRE AU BÉNIN.
          </h2>
          <motion.p 
            className="text-xs text-muted-foreground mt-2 max-w-[240px] leading-relaxed"
            style={{ opacity: overlayDescOpacity }}
          >
            Nous livrons des services complets de design, cartographie et IA sous un même toit.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;