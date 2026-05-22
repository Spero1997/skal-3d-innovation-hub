import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';

export interface LegalSection {
  title: string;
  body: React.ReactNode;
}

interface LegalDocumentProps {
  index: string;       // "05"
  kicker: string;      // "Document légal"
  title: React.ReactNode;
  updated?: string;    // "Mise à jour : 22/05/2026"
  sections: LegalSection[];
}

const LegalDocument: React.FC<LegalDocumentProps> = ({ index, kicker, title, updated, sections }) => {
  return (
    <OptimindLayout>
      <Navbar />

      {/* Editorial header */}
      <header className="section-x pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 border-b hairline-strong">
        <div className="grid grid-cols-12 gap-4 mb-8 items-baseline">
          <div className="col-span-6 md:col-span-4 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground tabular-nums">
            <span className="text-[hsl(var(--tangerine))]">§</span> {index} — {kicker}
          </div>
          <div className="col-span-6 md:col-span-4 md:col-start-9 md:text-right mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {updated ?? `Mise à jour : ${new Date().toLocaleDateString('fr-FR')}`}
          </div>
        </div>
        <h1 className="display-serif fluid-display font-light leading-[0.9] tracking-[-0.03em]">
          {title}
        </h1>
      </header>

      {/* Two-column editorial body */}
      <article className="section-x section-y">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* Sticky TOC */}
          <aside className="col-span-12 md:col-span-3 md:sticky md:top-24 md:self-start">
            <span className="ticker-tag">§ Sommaire</span>
            <ol className="mt-6 space-y-3">
              {sections.map((s, i) => (
                <li key={i} className="border-t hairline pt-3">
                  <a
                    href={`#sec-${i + 1}`}
                    className="flex gap-3 mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-[hsl(var(--tangerine))] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="col-span-12 md:col-span-8 md:col-start-5">
            {sections.map((s, i) => (
              <section
                key={i}
                id={`sec-${i + 1}`}
                className="border-t hairline-strong first:border-t-0 first:pt-0 pt-10 md:pt-14 pb-10 md:pb-14 scroll-mt-24"
              >
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--tangerine))] tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="display-serif text-2xl sm:text-3xl md:text-4xl font-light leading-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="prose-legal text-foreground/80 leading-relaxed space-y-4 max-w-prose">
                  {s.body}
                </div>
              </section>
            ))}

            <div className="mt-12 border-t hairline pt-8 flex items-center justify-between flex-wrap gap-4">
              <Link to="/" className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors">
                ← Retour à l'accueil
              </Link>
              <Link to="/contact" className="btn-ghost">
                Une question ? Nous écrire
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </OptimindLayout>
  );
};

export default LegalDocument;