import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import LegalDocument from '@/components/LegalDocument';

const TermsOfSale: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const updated = `Mise à jour : ${new Date().toLocaleDateString('fr-FR')}`;

  return (
    <>
      <SEO
        title="Conditions générales de vente — Skal Services"
        description="CGV de Skal Services : commande, paiement (40% / 60%), livraison et garanties."
        path="/terms"
      />
      <LegalDocument
        index="08"
        kicker="Vente"
        title={<>Conditions générales <span className="italic">de vente.</span></>}
        updated={updated}
        sections={[
          { title: "Préambule", body: <p>Les présentes CGV régissent les relations contractuelles entre Skal Services et ses clients. Toute commande implique l'acceptation sans réserve des présentes CGV.</p> },
          {
            title: "Services",
            body: (
              <>
                <p>Skal Services propose des services dans les domaines suivants :</p>
                <ul>
                  <li>Architecture &amp; BTP</li>
                  <li>Géomatique &amp; SIG / Cartographie</li>
                  <li>Graphisme &amp; IA / Identité visuelle</li>
                  <li>Web &amp; Digital</li>
                  <li>Conseil &amp; Stratégie</li>
                </ul>
              </>
            ),
          },
          { title: "Commandes", body: <p>Les commandes sont validées après acceptation d'un devis détaillé précisant les prestations, délais et tarifs. Tout devis signé par le client vaut engagement ferme.</p> },
          {
            title: "Tarifs et paiement",
            body: (
              <>
                <p>Les tarifs sont exprimés en FCFA, hors taxes. Modalités :</p>
                <ul>
                  <li>40% à la commande</li>
                  <li>60% à la livraison</li>
                </ul>
                <p>Tout retard de paiement entraînera des pénalités calculées au taux légal en vigueur.</p>
              </>
            ),
          },
          { title: "Délais d'exécution", body: <p>Les délais sont donnés à titre indicatif et peuvent varier selon la complexité du projet et la réactivité du client dans la validation des étapes.</p> },
          { title: "Propriété intellectuelle", body: <p>Skal Services reste propriétaire des droits de propriété intellectuelle sur les travaux réalisés jusqu'au paiement intégral du prix. Le transfert des droits est précisé dans un contrat spécifique.</p> },
          { title: "Responsabilité", body: <p>La responsabilité de Skal Services est limitée au montant des prestations facturées. Skal Services ne pourra être tenue responsable des contenus fournis par le client.</p> },
          { title: "Résiliation", body: <p>En cas de manquement par l'une des parties à ses obligations, le contrat pourra être résilié après mise en demeure restée sans effet pendant 30 jours.</p> },
          { title: "Loi applicable et juridiction", body: <p>Les présentes CGV sont soumises au droit béninois. En cas de litige, les tribunaux d'Abomey-Calavi seront seuls compétents.</p> },
        ]}
      />
    </>
  );
};

export default TermsOfSale;