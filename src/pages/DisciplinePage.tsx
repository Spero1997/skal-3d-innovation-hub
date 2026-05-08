import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import { disciplines, getDisciplineBySlug } from '@/data/disciplines';

const DisciplinePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const discipline = slug ? getDisciplineBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!discipline) return <Navigate to="/services" replace />;

  const Icon = discipline.icon;
  const others = disciplines.filter((d) => d.slug !== discipline.slug).slice(0, 3);

  return (
    <OptimindLayout>
      <Navbar />

      <article className="pt-28 sm:pt-32">
        {/* Hero */}
        <header className="section-x pb-12 sm:pb-16 border-b hairline">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-[hsl(var(--tangerine))] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Toutes les capacités
          </Link>

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {discipline.num} / 06 · {discipline.tag}
                </span>
                <span className="h-px flex-1 bg-[hsl(var(--ink))/0.15]" />
                <Icon className="w-6 h-6 text-[hsl(var(--tangerine))] stroke-[1.2]" />
              </div>
              <h1 className="display-serif fluid-display-lg font-light leading-[0.95]">
                {discipline.title}
                <span className="text-[hsl(var(--tangerine))]">.</span>
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 self-end">
              <p className="text-base sm:text-lg text-foreground/70 leading-relaxed">
                {discipline.intro}
              </p>
            </div>
          </div>
        </header>

        {/* Offerings */}
        <section className="section-x section-y border-b hairline">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <span className="ticker-tag">§ Prestations</span>
              <h2 className="display-serif text-3xl sm:text-4xl font-light leading-tight mt-4">
                Ce que nous <span className="italic">livrons.</span>
              </h2>
            </div>
            <ul className="col-span-12 md:col-span-7 md:col-start-6 space-y-px bg-[hsl(var(--ink))/0.12] border hairline">
              {discipline.offerings.map((item) => (
                <li
                  key={item}
                  className="bg-background p-5 sm:p-6 flex items-start gap-4 hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500"
                >
                  <Check className="w-4 h-4 text-[hsl(var(--tangerine))] mt-1 flex-shrink-0" />
                  <span className="display-serif text-lg sm:text-xl font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process */}
        <section className="section-x section-y border-b hairline">
          <div className="grid grid-cols-12 gap-6 mb-10">
            <div className="col-span-12 md:col-span-6">
              <span className="ticker-tag">§ Méthode</span>
              <h2 className="display-serif text-3xl sm:text-4xl font-light leading-tight mt-4">
                Notre <span className="italic">processus.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {discipline.process.map((step) => (
              <div
                key={step.step}
                className="border hairline p-5 sm:p-6 bg-[hsl(var(--cream))] rounded-md min-h-[200px] flex flex-col"
              >
                <span className="mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--tangerine))]">
                  Étape {step.step}
                </span>
                <h3 className="display-serif text-2xl font-light mt-4">{step.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed mt-3">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverables + Tools */}
        <section className="section-x section-y border-b hairline">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <span className="ticker-tag">§ Livrables</span>
              <h3 className="display-serif text-2xl sm:text-3xl font-light mt-4 mb-6">Ce que vous repartez avec.</h3>
              <ul className="space-y-3">
                {discipline.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tangerine))] mt-2.5 flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <span className="ticker-tag">§ Outils</span>
              <h3 className="display-serif text-2xl sm:text-3xl font-light mt-4 mb-6">Notre stack.</h3>
              <div className="flex flex-wrap gap-2">
                {discipline.tools.map((t) => (
                  <span
                    key={t}
                    className="mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 border border-[hsl(var(--ink))/0.2] rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-x section-y">
          <div className="bg-foreground text-[hsl(var(--cream))] rounded-md p-8 sm:p-12 md:p-16 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <h2 className="display-serif text-3xl sm:text-5xl font-light leading-tight">
                Un projet en{' '}
                <span className="italic text-[hsl(var(--tangerine))]">{discipline.title.toLowerCase()}</span> ?
              </h2>
              <p className="text-[hsl(var(--cream))/0.7] mt-4 max-w-md">
                Décrivez votre besoin, recevez un devis chiffré sous 48h ouvrées.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-wrap md:flex-col md:items-end md:justify-end gap-3">
              <Link
                to="/devis"
                className="inline-flex items-center gap-2 px-6 py-3 sm:py-4 bg-[hsl(var(--tangerine))] text-foreground mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:opacity-90 transition-opacity"
              >
                Demander un devis <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 sm:py-4 border border-[hsl(var(--cream))/0.3] text-[hsl(var(--cream))] mono text-[11px] uppercase tracking-[0.18em] rounded-full hover:bg-[hsl(var(--cream))/0.1] transition-colors"
              >
                Nous écrire
              </Link>
            </div>
          </div>
        </section>

        {/* Other disciplines */}
        <section className="section-x section-y border-t hairline">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="ticker-tag">§ Autres disciplines</span>
              <h2 className="display-serif text-2xl sm:text-3xl font-light mt-3">
                Continuer <span className="italic">l'exploration.</span>
              </h2>
            </div>
            <Link to="/services" className="btn-ghost">Toutes les capacités →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((d) => {
              const OIcon = d.icon;
              return (
                <Link
                  key={d.slug}
                  to={`/services/${d.slug}`}
                  className="group border hairline rounded-md p-5 sm:p-6 bg-[hsl(var(--cream))] hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 flex flex-col min-h-[180px]"
                >
                  <div className="flex items-start justify-between">
                    <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-60">{d.num} / 06</span>
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500" />
                  </div>
                  <OIcon className="w-6 h-6 mt-6 stroke-[1.2] text-[hsl(var(--tangerine))]" />
                  <h3 className="display-serif text-2xl font-light mt-auto pt-6 leading-tight">{d.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      </article>

      <Footer />
    </OptimindLayout>
  );
};

export default DisciplinePage;