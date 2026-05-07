
import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';

const Hero = lazy(() => import('@/components/Hero'));

const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Hero />
      </Suspense>
      <Footer />
    </OptimindLayout>
  );
};

export default Index;
