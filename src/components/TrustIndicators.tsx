import React from 'react';
import { Star } from 'lucide-react';

const registry = [
  { label: 'Forme', value: 'SARL' },
  { label: 'RCCM', value: 'RB/ABC/21 A 26495' },
  { label: 'IFU', value: '0202112334177' },
  { label: 'Agréments', value: 'DGT · DGC · AL' },
];

const stats = [
  { value: '100', suffix: '%', label: 'Satisfaction' },
  { value: '15', suffix: '+', label: "Années" },
  { value: '50', suffix: '+', label: 'Clients' },
  { value: '48', suffix: 'h', label: 'Délai devis' },
];

const testimonials = [
  { quote: "L'équipe a parfaitement compris nos besoins et a livré un travail de qualité exceptionnelle, bien au-delà de nos attentes.", author: 'ACAKPO Charnel', company: "Communication, La Ruche d'Or" },
  { quote: "Leur expertise en cartographie et leur conseil en IA nous ont permis d'optimiser considérablement nos processus.", author: 'TCHESSI Junior', company: 'Logisticien' },
  { quote: "Un professionnalisme remarquable. Skal a transformé notre vision en réalité avec une précision impressionnante.", author: 'DANNON Imelda', company: 'Directrice, MEL SHOP' },
  { quote: "Service exceptionnel et résultats à la hauteur. Je recommande vivement leur expertise pour tous vos projets.", author: 'GUENDEHOU Côme', company: 'Directeur, TECOMAV-ALU' },
];

const TrustIndicators: React.FC = () => (
  <div className="py-16 sm:py-20">
    {/* Registry — editorial colophon */}
    <div className="grid grid-cols-12 gap-x-6 gap-y-8 mb-20 sm:mb-28">
      <div className="col-span-12 md:col-span-3">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
          § Registre légal
        </div>
        <p className="mt-4 text-sm text-foreground/65 leading-relaxed max-w-xs">
          Société immatriculée au Bénin, intervenant sur toute l'Afrique de l'Ouest.
        </p>
      </div>
      <div className="col-span-12 md:col-span-8 md:col-start-5 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
        {registry.map((r) => (
          <div key={r.label} className="border-t hairline-strong pt-4">
            <div className="mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{r.label}</div>
            <div className="display-serif text-base sm:text-lg md:text-xl font-light mt-2 break-words leading-tight">{r.value}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Stats — asymmetric editorial rail */}
    <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end mb-20 sm:mb-28">
      <div className="col-span-12 md:col-span-3">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
          § Chiffres clés
        </div>
      </div>
      {stats.map((s, i) => {
        const offsets = ['md:mt-0', 'md:mt-10', 'md:mt-20', 'md:mt-6'];
        return (
          <div
            key={s.label}
            className={`col-span-6 md:col-span-2 ${i === 0 ? 'md:col-start-5' : ''} ${offsets[i]} border-t hairline-strong pt-5`}
          >
            <div className="display-serif text-5xl sm:text-6xl md:text-7xl font-light leading-none tabular-nums">
              {s.value}<span className="text-[hsl(var(--tangerine))] italic">{s.suffix}</span>
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-3">{s.label}</div>
          </div>
        );
      })}
    </div>

    {/* Testimonials — editorial pull-quotes asymmetric */}
    <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">
      <div className="col-span-12 md:col-span-3">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pb-3 border-b hairline-strong">
          § Témoignages
        </div>
        <h3 className="display-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[0.95] tracking-tight mt-6">
          La parole<br /><span className="italic text-foreground/55">des clients.</span>
        </h3>
      </div>
      <div className="col-span-12 md:col-span-8 md:col-start-5 grid grid-cols-12 gap-x-5 gap-y-10">
        {testimonials.map((t, i) => {
          const spans = [
            'col-span-12 sm:col-span-7',
            'col-span-12 sm:col-span-5 sm:mt-12',
            'col-span-12 sm:col-span-5 sm:col-start-2',
            'col-span-12 sm:col-span-6 sm:mt-8',
          ];
          return (
            <figure key={i} className={`${spans[i]} group`}>
              <div className="border-t hairline-strong pt-5">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, k) => (
                    <Star key={k} className="w-3 h-3 fill-[hsl(var(--tangerine))] text-[hsl(var(--tangerine))]" />
                  ))}
                </div>
                <blockquote className="display-serif text-lg sm:text-xl md:text-2xl font-light italic leading-[1.3]">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-5 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {t.author} <span className="opacity-50">— {t.company}</span>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  </div>
);

export default TrustIndicators;
