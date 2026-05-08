import React, { useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, useInView } from 'framer-motion';

const faqItems = [
  { q: 'Quels types de projets prenez-vous en charge ?', a: "Design graphique, identité visuelle, web & mobile, cartographie de précision, arpentage topographique et conseil en intelligence artificielle." },
  { q: 'Quels sont vos tarifs ?', a: 'Devis personnalisé après brief. Estimation détaillée renvoyée sous 48h, transparente, sans frais cachés.' },
  { q: 'Quels délais de livraison ?', a: 'Logo : 5–7 jours. Site web : 2–4 semaines. Cartographie : 1–3 semaines. Calendrier confirmé à la signature.' },
  { q: 'Travaillez-vous hors du Bénin ?', a: "Oui. Clients dans toute l'Afrique de l'Ouest et au-delà, avec une rigueur identique en remote." },
  { q: 'Comment se déroule un projet ?', a: 'Brief → devis → acompte (40 %) → production avec points hebdomadaires → livraison & solde (60 %).' },
  { q: 'Y a-t-il un suivi après livraison ?', a: 'Oui. Maintenance optionnelle pour le web, ajustements offerts pendant 30 jours pour les autres livrables.' },
];

const FAQ: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-x section-y border-t hairline">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4">
          <span className="ticker-tag">§ Questions</span>
          <h2 className="display-serif fluid-display font-light leading-[0.95] mt-4">
            Vous vous <span className="italic">demandez</span>...
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="col-span-12 md:col-span-7 md:col-start-6"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b hairline">
                <AccordionTrigger className="text-left py-6 hover:no-underline group">
                  <div className="flex items-baseline gap-3 sm:gap-6 w-full">
                    <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="display-serif text-lg sm:text-2xl md:text-3xl font-light flex-1 group-hover:text-[hsl(var(--tangerine))] transition-colors">
                      {item.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-foreground/70 leading-relaxed pl-8 sm:pl-[3.5rem] pr-2 pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
