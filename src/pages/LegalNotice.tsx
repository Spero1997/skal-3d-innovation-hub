
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';

const LegalNotice: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
              <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Informations légales</span>
            </div>
            <h1 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">MENTIONS LÉGALES</h1>
          </div>

          <div className="optimind-service-card rounded-2xl p-8 md:p-12 space-y-10 animate-fade-in text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">1. Identité de l'entreprise</h2>
              <p className="leading-relaxed">
                <strong className="text-foreground">Skal Service</strong><br />
                Forme juridique : <span className="italic">[À personnaliser — ex : SARL, SAS, auto-entrepreneur]</span><br />
                Capital social : <span className="italic">[À personnaliser]</span><br />
                Numéro IFU : 0202112334177<br />
                RCCM : RB/ABC/21 A 26495 du 28/01/2021<br />
                Siège social : Abomey-Calavi, Tokan, von EPP Tokan, Bénin<br />
                Téléphone : +229 01 90315546<br />
                Email : servicesskal@gmail.com
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">2. Directeur de la publication</h2>
              <p className="leading-relaxed">
                TOMETIN Spéro Mariano Astrido Mahussi<br />
                Email : speromarianotometin@gmail.com
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">3. Hébergement du site</h2>
              <p className="leading-relaxed">
                Hébergeur : <span className="italic">[À personnaliser — ex : Vercel, OVH, Netlify]</span><br />
                Adresse : <span className="italic">[À personnaliser]</span><br />
                Contact : <span className="italic">[À personnaliser]</span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">4. Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                L'ensemble du contenu de ce site (structure générale, textes, logos, images, photographies, vidéos, sons, illustrations, logiciels) est la propriété exclusive de Skal Service ou de ses partenaires et est protégé par les lois en vigueur relatives à la propriété intellectuelle.
              </p>
              <p className="leading-relaxed mt-3">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sans l'autorisation écrite préalable de Skal Service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">5. Limitation de responsabilité</h2>
              <p className="leading-relaxed">
                Skal Service s'efforce de fournir des informations aussi précises que possible. Toutefois, la société ne pourra être tenue responsable des omissions, inexactitudes ou carences dans la mise à jour de ces informations, qu'elles soient de son fait ou de celui des tiers fournissant ces informations.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">6. Cookies</h2>
              <p className="leading-relaxed">
                La navigation sur le site est susceptible de provoquer l'installation de cookies sur l'ordinateur de l'utilisateur. Un cookie est un fichier de petite taille qui ne permet pas l'identification de l'utilisateur mais qui enregistre des informations relatives à la navigation d'un ordinateur sur un site. L'utilisateur peut désactiver les cookies via les paramètres de son navigateur.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">7. Données personnelles</h2>
              <p className="leading-relaxed">
                Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité des données vous concernant. Pour exercer ce droit, veuillez nous contacter à l'adresse email suivante : servicesskal@gmail.com
              </p>
              <p className="leading-relaxed mt-3">
                Pour plus de détails, consultez notre <a href="/privacy" className="text-[hsl(var(--optimind-glow))] hover:underline">Politique de Confidentialité</a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">8. Droit applicable</h2>
              <p className="leading-relaxed">
                Les présentes mentions légales sont régies par le droit béninois. Tout litige relatif à l'utilisation du site sera soumis à la compétence des tribunaux compétents d'Abomey-Calavi, Bénin.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default LegalNotice;
