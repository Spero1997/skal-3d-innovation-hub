
import React, { useEffect, useRef } from 'react';
import { Scene3D } from './Scene3D';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
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
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center section-padding pt-24"
      style={{ 
        '--x': '0px',
        '--y': '0px',
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-skal-gray/80 to-white/90 z-10" />
        <Scene3D />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div 
            className="inline-block px-4 py-1 mb-6 rounded-full bg-skal-blue/10 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-skal-blue text-sm font-medium">Innovation et Précision</span>
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight text-skal-dark mb-6 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Votre Partenaire en Conception, Arpentage, Cartographie et IA
          </h1>
          
          <p 
            className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            Chez Skal Service, nous combinons expertise technique, créativité et innovation pour donner vie à vos projets avec précision et excellence.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <a 
              href="#services" 
              className="px-8 py-3 rounded-md bg-skal-blue text-white font-medium hover:bg-skal-blue/90 transition-colors"
            >
              Découvrir nos services
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 rounded-md bg-transparent border border-skal-dark text-skal-dark font-medium hover:bg-skal-dark hover:text-white transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <a href="#services" className="text-skal-dark opacity-70 hover:opacity-100 transition-opacity">
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
        </a>
      </div>
    </section>
  );
};

export default Hero;
