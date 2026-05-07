import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: "Quels types de projets prenez-vous en charge ?",
    answer: "Nous intervenons sur des projets de design graphique, identité visuelle, développement web & mobile, cartographie de précision, arpentage topographique et conseil en intelligence artificielle. Que vous soyez une entreprise, une collectivité ou un porteur de projet, nous avons une solution adaptée."
  },
  {
    question: "Combien coûte un projet avec Skal Service ?",
    answer: "Chaque projet est unique. Nous établissons un devis personnalisé après analyse de vos besoins. Nos tarifs sont compétitifs et transparents. Demandez un devis gratuit via notre formulaire pour obtenir une estimation sous 48h."
  },
  {
    question: "Quels sont vos délais de livraison ?",
    answer: "Les délais varient selon la complexité du projet. Un logo peut être livré en 5-7 jours, un site web en 2-4 semaines, et un projet de cartographie en 1-3 semaines. Nous nous engageons toujours sur un calendrier précis dès la validation du devis."
  },
  {
    question: "Travaillez-vous avec des clients hors du Bénin ?",
    answer: "Absolument ! Nous collaborons avec des clients dans toute l'Afrique de l'Ouest et au-delà. Nos outils de travail à distance nous permettent d'assurer la même qualité de service quel que soit votre emplacement."
  },
  {
    question: "Comment se déroule un projet type ?",
    answer: "Notre processus suit 4 étapes : 1) Analyse de vos besoins et devis gratuit, 2) Validation et versement de l'acompte (40%), 3) Réalisation avec points d'étape réguliers, 4) Livraison finale et solde (60%). Vous êtes impliqué à chaque étape."
  },
  {
    question: "Proposez-vous un service après-vente ?",
    answer: "Oui, nous assurons un suivi post-livraison. Pour les sites web, nous proposons des contrats de maintenance. Pour les autres services, nous restons disponibles pour des ajustements et conseils pendant 30 jours après la livraison."
  },
];

const FAQ: React.FC = () => {
  return (
    <section className="section-padding relative z-10">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
            <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
            QUESTIONS FRÉQUENTES
          </h2>
          <p className="text-muted-foreground">
            Retrouvez les réponses aux questions les plus posées par nos clients.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 animate-fade-in">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="optimind-service-card rounded-2xl border-none px-6"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-5 text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;