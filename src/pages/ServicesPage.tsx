
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import OptimindLayout from '@/components/OptimindLayout';

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <Navbar />
      <div className="pt-32 pb-16">
        <Services />
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default ServicesPage;
