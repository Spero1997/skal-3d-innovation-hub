
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';

const TermsOfSale: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="Conditions générales de vente — Skal Services"
        description="CGV de Skal Services : commande, paiement (40% / 60%), livraison et garanties."
        path="/terms"
      />
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--tangerine)/0.1)]">
              <span className="text-[hsl(var(--tangerine))] text-sm font-medium">Vente</span>
            </div>
            <h1 className="text-3xl md:text-4xl display-serif mb-4 text-foreground">Conditions Générales de Vente</h1>
          </div>

          <div className="optimind-service-card rounded-2xl p-8 md:p-12 space-y-10 animate-fade-in text-muted-foreground">
            <p className="text-sm">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">1. Préambule</h2>
              <p className="leading-relaxed">
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Skal Services et ses clients.
                Toute commande implique l'acceptation sans réserve des présentes CGV.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">2. Services</h2>
              <p className="leading-relaxed">
                Skal Services propose des services dans les domaines suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Développement web et mobile</li>
                <li>Design UI/UX</li>
                <li>Services cartographiques</li>
                <li>Conseil en stratégie digitale</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">3. Commandes</h2>
              <p className="leading-relaxed">
                Les commandes sont validées après acceptation d'un devis détaillé précisant les prestations,
                délais et tarifs. Tout devis signé par le client vaut engagement ferme.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">4. Tarifs et paiement</h2>
              <p className="leading-relaxed">
                Les tarifs sont exprimés en FCFA, hors taxes. Les modalités de paiement sont les suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>40% à la commande</li>
                <li>60% à la livraison</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Tout retard de paiement entraînera des pénalités calculées au taux légal en vigueur.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">5. Délais d'exécution</h2>
              <p className="leading-relaxed">
                Les délais d'exécution sont donnés à titre indicatif et peuvent varier en fonction
                de la complexité du projet et de la réactivité du client dans la validation des étapes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">6. Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                Skal Services reste propriétaire des droits de propriété intellectuelle sur les travaux réalisés
                jusqu'au paiement intégral du prix. Le transfert des droits est précisé dans un contrat spécifique.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">7. Responsabilité</h2>
              <p className="leading-relaxed">
                La responsabilité de Skal Services est limitée au montant des prestations facturées.
                Skal Services ne pourra être tenue responsable des contenus fournis par le client.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">8. Résiliation</h2>
              <p className="leading-relaxed">
                En cas de manquement par l'une des parties à ses obligations, le contrat pourra être résilié
                après mise en demeure restée sans effet pendant 30 jours.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">9. Loi applicable et juridiction</h2>
              <p className="leading-relaxed">
                Les présentes CGV sont soumises au droit béninois. En cas de litige, les tribunaux
                d'Abomey-Calavi seront seuls compétents.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default TermsOfSale;
