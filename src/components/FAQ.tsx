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
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 md:col-span-4 md:sticky md:top-24 md:self-start">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
            § Questions
          </div>
          <h2 className="display-serif text-5xl sm:text-6xl md:text-7xl font-light leading-[0.9] tracking-tight mt-6">
            Vous vous<br />
            <span className="italic text-foreground/55">demandez</span>...
          </h2>
          <p className="mt-6 text-sm text-foreground/65 leading-relaxed max-w-xs">
            Six questions essentielles avant de démarrer.
            Réponse personnalisée sous 48h pour le reste.
          </p>
          <p className="mt-8 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 tabular-nums">
            06 — Réponses
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="col-span-12 md:col-span-7 md:col-start-6"
        >
          <Accordion type="single" collapsible className="w-full border-t hairline-strong">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b hairline-strong">
                <AccordionTrigger className="text-left py-6 sm:py-8 hover:no-underline group">
                  <div className="grid grid-cols-12 gap-3 sm:gap-6 w-full items-baseline">
                    <span className="col-span-2 sm:col-span-1 display-serif italic text-3xl sm:text-4xl font-light text-foreground/20 group-hover:text-[hsl(var(--tangerine))] transition-colors duration-500 tabular-nums leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="col-span-10 sm:col-span-11 display-serif text-xl sm:text-3xl md:text-4xl font-light leading-[1.1] group-hover:text-[hsl(var(--tangerine))] transition-colors">
                      {item.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-foreground/70 leading-relaxed pl-10 sm:pl-[5.5rem] pr-2 pb-8">
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
