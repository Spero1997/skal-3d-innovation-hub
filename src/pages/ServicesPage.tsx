
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/lovable-uploads/f5f2b783-770e-4cb8-9a4b-44dd50597241.png")' }}
      />
      <Navbar />
      <div className="pt-32">
        <Services />
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
