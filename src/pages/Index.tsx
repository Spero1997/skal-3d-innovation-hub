
import React, { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Lazy load the Hero component which contains the 3D scene
const Hero = lazy(() => import('@/components/Hero'));

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Preload the background image
    const img = new Image();
    img.src = "/lovable-uploads/09498611-bf02-4ce5-810c-ffa7798e8158.png";
    img.onload = () => setIsLoading(false);
    
    // Fallback in case image loading takes too long
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative transition-opacity duration-300 ${isLoading ? 'opacity-95' : 'opacity-100'}`}>
      <div 
        className="fixed inset-0 -z-10 bg-white"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/09498611-bf02-4ce5-810c-ffa7798e8158.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      ></div>
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-skal-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Hero />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
