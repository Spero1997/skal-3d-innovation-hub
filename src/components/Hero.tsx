
import React, { useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the 3D scene to improve initial page load
const Scene3D = lazy(() => import('./Scene3D').then(module => ({default: module.Scene3D})));

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!heroRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return; // Skip parallax on mobile for better performance

      const { clientX, clientY } = e;
      const { width, height } = heroRef.current!.getBoundingClientRect();
      
      const x = (clientX / width - 0.5) * 10;
      const y = (clientY / height - 0.5) * 10;
      
      heroRef.current!.style.setProperty('--x', `${x}px`);
      heroRef.current!.style.setProperty('--y', `${y}px`);
    };
    
    heroRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      heroRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center section-padding pt-40"
      style={{ 
        '--x': '0px',
        '--y': '0px',
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-skal-gray/80 to-white/80 z-10" />
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-orange-500/20" />}>
          <Scene3D />
        </Suspense>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div 
            className="inline-block px-4 py-1 mb-10 rounded-full bg-skal-orange/10 animate-fade-in"
            style={{ animationDelay: '0.1s' }} // Reduced delay
          >
            <span className="text-skal-orange text-sm font-medium">Innovation et Précision</span>
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight text-skal-black mb-6 animate-fade-in"
            style={{ animationDelay: '0.2s' }} // Reduced delay
          >
            Votre Partenaire en Conception, Arpentage, Cartographie et IA
          </h1>
          
          <p 
            className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.3s' }} // Reduced delay
          >
            Chez Skal Service, nous combinons expertise technique, créativité et innovation pour donner vie à vos projets avec précision et excellence.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: '0.4s' }} // Reduced delay
          >
            <Link 
              to="/services" 
              className="px-8 py-3 rounded-md bg-skal-orange text-white font-medium hover:bg-skal-orange/90 transition-colors"
            >
              Découvrir nos services
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 rounded-md bg-transparent border border-skal-black text-skal-black font-medium hover:bg-skal-black hover:text-white transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <Link to="/services" className="text-skal-black opacity-70 hover:opacity-100 transition-opacity">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
