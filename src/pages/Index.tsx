
import React, { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Lazy load the Hero component which contains the 3D scene
const Hero = lazy(() => import('@/components/Hero'));

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't scroll to top on initial load (it's unnecessary and causes jank)
    if (window.location.hash) {
      // If there's a hash, let the browser handle scrolling to the element
      return;
    }
    
    // Optimize background image loading
    const bgImg = new Image();
    bgImg.src = "/lovable-uploads/09498611-bf02-4ce5-810c-ffa7798e8158.png";
    bgImg.fetchPriority = "high";
    
    // Use load event and add a timeout to ensure we don't wait too long
    const loadTimeout = setTimeout(() => setIsLoading(false), 400);
    bgImg.onload = () => {
      clearTimeout(loadTimeout);
      setIsLoading(false);
    };
    
    return () => clearTimeout(loadTimeout);
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
          <div className="w-12 h-12 border-4 border-skal-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Hero />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
