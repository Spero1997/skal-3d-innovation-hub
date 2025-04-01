
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfSale: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-skal-black">Conditions Générales de Vente</h1>
        
        <div className="prose max-w-none">
          <p className="mb-6">
            Dernière mise à jour: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Préambule</h2>
          <p>
            Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Skal Service et ses clients.
            Toute commande implique l'acceptation sans réserve des présentes CGV.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Services</h2>
          <p>
            Skal Service propose des services dans les domaines suivants:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Développement web et mobile</li>
            <li>Design UI/UX</li>
            <li>Services cartographiques</li>
            <li>Conseil en stratégie digitale</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Commandes</h2>
          <p>
            Les commandes sont validées après acceptation d'un devis détaillé précisant les prestations,
            délais et tarifs. Tout devis signé par le client vaut engagement ferme.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Tarifs et paiement</h2>
          <p>
            Les tarifs sont exprimés en FCFA, hors taxes. Les modalités de paiement sont les suivantes:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>40% à la commande</li>
            <li>30% à mi-projet</li>
            <li>30% à la livraison</li>
          </ul>
          <p>
            Tout retard de paiement entraînera des pénalités calculées au taux légal en vigueur.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Délais d'exécution</h2>
          <p>
            Les délais d'exécution sont donnés à titre indicatif et peuvent varier en fonction
            de la complexité du projet et de la réactivité du client dans la validation des étapes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Propriété intellectuelle</h2>
          <p>
            Skal Service reste propriétaire des droits de propriété intellectuelle sur les travaux réalisés
            jusqu'au paiement intégral du prix. Le transfert des droits est précisé dans un contrat spécifique.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Responsabilité</h2>
          <p>
            La responsabilité de Skal Service est limitée au montant des prestations facturées.
            Skal Service ne pourra être tenue responsable des contenus fournis par le client.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Résiliation</h2>
          <p>
            En cas de manquement par l'une des parties à ses obligations, le contrat pourra être résilié
            après mise en demeure restée sans effet pendant 30 jours.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Loi applicable et juridiction</h2>
          <p>
            Les présentes CGV sont soumises au droit béninois. En cas de litige, les tribunaux
            d'Abomey-Calavi seront seuls compétents.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfSale;
