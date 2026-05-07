
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <Navbar />
      <div className="pt-32 pb-0">
        <Contact />
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default ContactPage;
