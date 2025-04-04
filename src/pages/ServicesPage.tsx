
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

const ServicesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Preload the background image
    const img = new Image();
    img.src = "/lovable-uploads/f5f2b783-770e-4cb8-9a4b-44dd50597241.png";
    
    // Setup a promise to track image loading
    const backgroundLoaded = new Promise((resolve) => {
      img.onload = () => resolve(true);
      // Fallback if image fails
      setTimeout(() => resolve(false), 1500);
    });
    
    // When background is loaded, finish the loading state
    backgroundLoaded.then(() => {
      setIsLoading(false);
    });
    
    // Fallback in case image loading takes too long
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative transition-opacity duration-500 ${isLoading ? 'opacity-90' : 'opacity-100'}`}>
      <div 
        className="fixed inset-0 -z-10 bg-white"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/f5f2b783-770e-4cb8-9a4b-44dd50597241.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.8s ease-in-out'
        }}
      />
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      <Navbar />
      <div className="pt-32 pb-16">
        <Services />
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
