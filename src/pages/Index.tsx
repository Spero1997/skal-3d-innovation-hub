
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simple preloading mechanism
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Short timeout to ensure smooth transition
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative transition-opacity duration-300 ${isLoading ? 'opacity-95' : 'opacity-100'}`}>
      <div className="fixed inset-0 -z-10 bg-white"></div>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Index;
