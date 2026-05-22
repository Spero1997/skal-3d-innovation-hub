
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="Services — Design, SIG, Arpentage & IA | Skal Services"
        description="Six expertises au service de vos projets : design graphique, stratégie de marque, web, cartographie SIG, arpentage et conseil IA."
        path="/services"
      />
      <Navbar />
      <PageHero
        index="01"
        kicker="Catalogue des services"
        title={<>Six expertises,<br /><span className="italic">une seule signature.</span></>}
        lede="Design graphique, stratégie de marque, web, cartographie SIG, arpentage et conseil IA — orchestrés par un guichet unique au service de vos projets."
      />
      <Services />
      <Footer />
    </OptimindLayout>
  );
};

export default ServicesPage;
