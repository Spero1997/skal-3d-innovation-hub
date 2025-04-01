
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-skal-black">Politique de Confidentialité</h1>
        
        <div className="prose max-w-none">
          <p className="mb-6">
            Dernière mise à jour: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Skal Service s'engage à protéger la vie privée des utilisateurs de son site web. 
            Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Informations que nous collectons</h2>
          <p>
            Nous pouvons collecter les types d'informations suivants:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Informations que vous nous fournissez (nom, email, téléphone) lorsque vous nous contactez</li>
            <li>Informations techniques (adresse IP, type de navigateur, appareil utilisé)</li>
            <li>Informations de navigation via les cookies</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Utilisation des informations</h2>
          <p>
            Nous utilisons vos informations pour:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Répondre à vos demandes</li>
            <li>Améliorer notre site web et nos services</li>
            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            <li>Se conformer à nos obligations légales</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Partage des informations</h2>
          <p>
            Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Nos prestataires de services</li>
            <li>Les autorités légales si requis par la loi</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre tout accès non autorisé ou toute altération.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Vos droits</h2>
          <p>
            Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles. 
            Pour exercer ces droits, veuillez nous contacter à: skalservice.0@gmail.com
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications de notre politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité périodiquement. 
            Toute modification sera publiée sur cette page.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
          <p>
            Pour toute question concernant cette politique, veuillez nous contacter à: skalservice.0@gmail.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
