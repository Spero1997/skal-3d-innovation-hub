
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LegalNotice: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-skal-black">Mentions Légales</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Identité de l'entreprise</h2>
          <p>
            <strong>Skal Service</strong><br />
            Adresse: Abomey-Calavi, Tokan, von EPP Tokan<br />
            Téléphone: +229 01 90315546<br />
            Email: skalservice.0@gmail.com
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Hébergement</h2>
          <p>
            Ce site est hébergé par [Nom de l'hébergeur]<br />
            Adresse: [Adresse de l'hébergeur]<br />
            Téléphone: [Téléphone de l'hébergeur]
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Directeur de la publication</h2>
          <p>
            [Nom du directeur de publication]<br />
            Contactable à l'adresse email: [Email du directeur]
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (structure, textes, logos, images, photographies, illustrations) est la propriété exclusive de Skal Service ou de ses partenaires.
            Toute reproduction totale ou partielle de ce contenu est strictement interdite sans autorisation préalable.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Données personnelles</h2>
          <p>
            Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
            Pour exercer ce droit, veuillez nous contacter à l'adresse email suivante: skalservice.0@gmail.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalNotice;
