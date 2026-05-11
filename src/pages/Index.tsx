import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import Services from '@/components/Services';
import AIValueSection from '@/components/AIValueSection';
import Contact from '@/components/Contact';
import AboutSection from '@/components/AboutSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import ArticlesGallery from '@/components/ArticlesGallery';
import FAQ from '@/components/FAQ';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const Hero = lazy(() => import('@/components/Hero'));

const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="SKAL SERVICES — Design, Cartographie SIG, Arpentage & IA au Bénin"
        description="Studio béninois : design éditorial, stratégie de marque, web, cartographie SIG, arpentage et conseil en intelligence artificielle. Une équipe, six expertises."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Skal Services',
          url: 'https://skalservice.lovable.app',
          inLanguage: 'fr',
        }}
      />
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Hero />
      </Suspense>
      <AboutSection />
      <Services />
      <AIValueSection />
      <FeaturedProjects />
      <ArticlesGallery />
      <CTABanner />
      <FAQ />
      <Contact />
      <Footer />
    </OptimindLayout>
  );
};

export default Index;
