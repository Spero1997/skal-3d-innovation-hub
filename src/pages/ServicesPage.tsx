
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="Services — Design, SIG, Arpentage & IA | Skal Service"
        description="Six expertises au service de vos projets : design graphique, stratégie de marque, web, cartographie SIG, arpentage et conseil IA."
        path="/services"
      />
      <Navbar />
      <div className="pt-32 pb-16">
        <Services />
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default ServicesPage;
