import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import LegalDocument from '@/components/LegalDocument';

const LegalNotice: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEO
        title="Mentions légales — Skal Services"
        description="Identité légale de Skal Services : IFU, RCCM, siège social et directeur de la publication."
        path="/legal"
      />
      <LegalDocument
        index="06"
        kicker="Document légal"
        title={<>Mentions <span className="italic">légales.</span></>}
        sections={[
          {
            title: "Identité de l'entreprise",
            body: (
              <p>
                <strong>SKAL SERVICES SARL</strong><br />
                Forme juridique : Société à Responsabilité Limitée (SARL)<br />
                Numéro IFU : 0202112334177<br />
                RCCM : RB/ABC/21 A 26495 du 28/01/2021<br />
                Déclaration DGT : 0008803-ABC<br />
                Carte DGC : 0008108-ABC<br />
                Agrément AL : 0008122-ABC<br />
                Siège social : Abomey-Calavi, Tokan, von EPP Tokan, Bénin<br />
                Téléphone : +229 01 97 58 60 22 / +229 01 67 75 07 78<br />
                Email : servicesskal@gmail.com
              </p>
            ),
          },
          {
            title: "Directeur de la publication",
            body: (
              <p>
                TOMETIN Spéro Mariano Astrido Mahussi<br />
                Email : speromarianotometin@gmail.com
              </p>
            ),
          },
          {
            title: "Hébergement du site",
            body: (
              <p>
                Hébergeur : <em>[À personnaliser — ex : Vercel, OVH, Netlify]</em><br />
                Adresse : <em>[À personnaliser]</em><br />
                Contact : <em>[À personnaliser]</em>
              </p>
            ),
          },
          {
            title: "Propriété intellectuelle",
            body: (
              <>
                <p>L'ensemble du contenu de ce site (structure générale, textes, logos, images, photographies, vidéos, sons, illustrations, logiciels) est la propriété exclusive de Skal Services ou de ses partenaires et est protégé par les lois en vigueur relatives à la propriété intellectuelle.</p>
                <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sans l'autorisation écrite préalable de Skal Services.</p>
              </>
            ),
          },
          {
            title: "Limitation de responsabilité",
            body: <p>Skal Services s'efforce de fournir des informations aussi précises que possible. Toutefois, la société ne pourra être tenue responsable des omissions, inexactitudes ou carences dans la mise à jour de ces informations, qu'elles soient de son fait ou de celui des tiers fournissant ces informations.</p>,
          },
          {
            title: "Cookies",
            body: <p>La navigation sur le site est susceptible de provoquer l'installation de cookies sur l'ordinateur de l'utilisateur. Un cookie est un fichier de petite taille qui ne permet pas l'identification de l'utilisateur mais qui enregistre des informations relatives à la navigation d'un ordinateur sur un site. L'utilisateur peut désactiver les cookies via les paramètres de son navigateur.</p>,
          },
          {
            title: "Données personnelles",
            body: (
              <>
                <p>Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité des données vous concernant. Pour exercer ce droit, veuillez nous contacter à : servicesskal@gmail.com</p>
                <p>Pour plus de détails, consultez notre <a href="/privacy">Politique de Confidentialité</a>.</p>
              </>
            ),
          },
          {
            title: "Droit applicable",
            body: <p>Les présentes mentions légales sont régies par le droit béninois. Tout litige relatif à l'utilisation du site sera soumis à la compétence des tribunaux compétents d'Abomey-Calavi, Bénin.</p>,
          },
        ]}
      />
    </>
  );
};

export default LegalNotice;