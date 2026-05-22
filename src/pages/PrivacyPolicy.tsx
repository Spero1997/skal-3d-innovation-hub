import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import LegalDocument from '@/components/LegalDocument';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const updated = `Mise à jour : ${new Date().toLocaleDateString('fr-FR')}`;

  return (
    <>
      <SEO
        title="Politique de confidentialité — Skal Services"
        description="Comment Skal Services collecte, utilise et protège vos données personnelles."
        path="/privacy"
      />
      <LegalDocument
        index="07"
        kicker="Confidentialité"
        title={<>Politique de <span className="italic">confidentialité.</span></>}
        updated={updated}
        sections={[
          { title: "Introduction", body: <p>Skal Services (ci-après « nous ») s'engage à protéger la vie privée des utilisateurs de son site web. La présente politique décrit comment nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément à la législation en vigueur au Bénin et aux standards internationaux de protection des données.</p> },
          { title: "Responsable du traitement", body: <p>Le responsable du traitement est :<br /><strong>Skal Services</strong><br />Siège social : Abomey-Calavi, Tokan, von EPP Tokan, Bénin<br />Email : servicesskal@gmail.com<br />Téléphone : +229 01 97 58 60 22</p> },
          {
            title: "Données collectées",
            body: (
              <>
                <p>Nous collectons les types de données suivants :</p>
                <ul>
                  <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone — fournies volontairement via nos formulaires.</li>
                  <li><strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation, pages visitées, durée de visite.</li>
                  <li><strong>Cookies :</strong> fichiers de suivi permettant d'améliorer votre expérience.</li>
                </ul>
              </>
            ),
          },
          {
            title: "Finalités du traitement",
            body: (
              <>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Améliorer la qualité de notre site et de nos services</li>
                  <li>Communications marketing (uniquement avec consentement explicite)</li>
                  <li>Respecter nos obligations légales</li>
                  <li>Établir des statistiques anonymes de fréquentation</li>
                </ul>
              </>
            ),
          },
          { title: "Durée de conservation", body: <p>Vos données sont conservées pendant une durée maximale de <em>[à personnaliser — ex : 3 ans]</em> à compter de votre dernier contact, sauf obligation légale plus longue.</p> },
          {
            title: "Partage des données",
            body: (
              <>
                <p>Nous ne vendons, ne louons et ne cédons jamais vos données. Nous pouvons les partager avec :</p>
                <ul>
                  <li>Nos prestataires techniques (hébergement, analyse) dans le strict cadre de leurs services</li>
                  <li>Les autorités compétentes, en cas d'obligation légale</li>
                </ul>
              </>
            ),
          },
          { title: "Sécurité des données", body: <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Cela inclut le chiffrement des transmissions (SSL/TLS) et la restriction de l'accès au personnel habilité.</p> },
          {
            title: "Vos droits",
            body: (
              <>
                <p>Conformément à la législation, vous disposez des droits suivants :</p>
                <ul>
                  <li><strong>Accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Rectification :</strong> corriger des données inexactes</li>
                  <li><strong>Suppression :</strong> demander l'effacement de vos données</li>
                  <li><strong>Opposition :</strong> au traitement à des fins marketing</li>
                  <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré</li>
                </ul>
                <p>Pour exercer vos droits : <a href="mailto:servicesskal@gmail.com">servicesskal@gmail.com</a></p>
              </>
            ),
          },
          { title: "Cookies", body: <p>Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer votre navigateur pour les refuser. Certaines fonctionnalités peuvent ne pas fonctionner correctement sans cookies.</p> },
          { title: "Modifications", body: <p>Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification sera publiée sur cette page avec une date actualisée. Consultez-la régulièrement.</p> },
          { title: "Contact", body: <p>Pour toute question :<br />Email : <a href="mailto:servicesskal@gmail.com">servicesskal@gmail.com</a><br />Téléphone : +229 01 97 58 60 22<br />Adresse : Abomey-Calavi, Tokan, von EPP Tokan, Bénin</p> },
        ]}
      />
    </>
  );
};

export default PrivacyPolicy;