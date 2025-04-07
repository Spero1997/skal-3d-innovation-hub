
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Afficher le CTA après un certain défilement
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Nettoyage
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <Button 
        className="bg-skal-orange hover:bg-skal-orange/90 text-white font-medium px-6 py-6 rounded-full shadow-lg flex items-center gap-2"
        onClick={() => window.location.href = '/contact'}
      >
        Discutons de votre projet <ArrowRight className="ml-1 w-4 h-4" />
      </Button>
    </div>
  );
};

export default FloatingCTA;
