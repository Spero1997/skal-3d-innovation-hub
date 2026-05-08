
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';

const PrivacyPolicy: React.FC = () => {
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
              <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Confidentialité</span>
            </div>
            <h1 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">POLITIQUE DE CONFIDENTIALITÉ</h1>
            <p className="text-muted-foreground text-sm">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="optimind-service-card rounded-2xl p-8 md:p-12 space-y-10 animate-fade-in text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">1. Introduction</h2>
              <p className="leading-relaxed">
                Skal Service (ci-après « nous ») s'engage à protéger la vie privée des utilisateurs de son site web. La présente politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément à la législation en vigueur au Bénin et aux standards internationaux de protection des données.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">2. Responsable du traitement</h2>
              <p className="leading-relaxed">
                Le responsable du traitement des données est :<br />
                <strong className="text-foreground">Skal Service</strong><br />
                Siège social : Abomey-Calavi, Tokan, von EPP Tokan, Bénin<br />
                Email : servicesskal@gmail.com<br />
                Téléphone : +229 01 90315546
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">3. Données collectées</h2>
              <p className="leading-relaxed mb-3">Nous collectons les types de données suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone — fournies volontairement via nos formulaires de contact ou de demande de devis.</li>
                <li><strong className="text-foreground">Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation, pages visitées, durée de la visite — collectées automatiquement.</li>
                <li><strong className="text-foreground">Cookies :</strong> fichiers de suivi permettant d'améliorer votre expérience de navigation.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">4. Finalités du traitement</h2>
              <p className="leading-relaxed mb-3">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Répondre à vos demandes de contact et de devis</li>
                <li>Améliorer la qualité de notre site web et de nos services</li>
                <li>Vous adresser des communications marketing (uniquement avec votre consentement explicite)</li>
                <li>Respecter nos obligations légales et réglementaires</li>
                <li>Établir des statistiques anonymes de fréquentation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">5. Durée de conservation</h2>
              <p className="leading-relaxed">
                Vos données personnelles sont conservées pendant une durée maximale de <span className="italic">[À personnaliser — ex : 3 ans]</span> à compter de votre dernier contact avec nous, sauf obligation légale de conservation plus longue.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">6. Partage des données</h2>
              <p className="leading-relaxed mb-3">
                Nous ne vendons, ne louons et ne cédons jamais vos données personnelles. Nous pouvons toutefois les partager avec :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nos prestataires techniques (hébergement, outils d'analyse) dans le cadre strict de l'exécution de leurs services</li>
                <li>Les autorités compétentes, en cas d'obligation légale</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">7. Sécurité des données</h2>
              <p className="leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Cela inclut le chiffrement des transmissions (SSL/TLS) et la restriction de l'accès aux données au personnel habilité.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">8. Vos droits</h2>
              <p className="leading-relaxed mb-3">Conformément à la législation applicable, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                <li><strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
                <li><strong className="text-foreground">Droit de suppression :</strong> demander l'effacement de vos données</li>
                <li><strong className="text-foreground">Droit d'opposition :</strong> vous opposer au traitement de vos données à des fins de marketing</li>
                <li><strong className="text-foreground">Droit de portabilité :</strong> recevoir vos données dans un format structuré</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Pour exercer vos droits, contactez-nous à : <a href="mailto:servicesskal@gmail.com" className="text-[hsl(var(--optimind-glow))] hover:underline">servicesskal@gmail.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">9. Cookies</h2>
              <p className="leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer votre navigateur pour refuser les cookies ou être alerté lorsque des cookies sont envoyés. Certaines fonctionnalités du site peuvent ne pas fonctionner correctement sans cookies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">10. Modifications</h2>
              <p className="leading-relaxed">
                Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour actualisée. Nous vous encourageons à consulter cette page régulièrement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground uppercase tracking-wider">11. Contact</h2>
              <p className="leading-relaxed">
                Pour toute question relative à cette politique de confidentialité :<br />
                Email : <a href="mailto:servicesskal@gmail.com" className="text-[hsl(var(--optimind-glow))] hover:underline">servicesskal@gmail.com</a><br />
                Téléphone : +229 01 90315546<br />
                Adresse : Abomey-Calavi, Tokan, von EPP Tokan, Bénin
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default PrivacyPolicy;
