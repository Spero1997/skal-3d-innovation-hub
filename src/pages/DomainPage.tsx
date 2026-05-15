import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import { domains, getDomainBySlug } from '@/data/domains';
import SEO from '@/components/SEO';

const DomainPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const domain = slug ? getDomainBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!domain) return <Navigate to="/services" replace />;

  const Icon = domain.icon;
  const others = domains.filter((d) => d.slug !== domain.slug);

  return (
    <OptimindLayout>
      <SEO
        title={`${domain.title} — Skal Services`}
        description={`${domain.tagline}. ${domain.intro.slice(0, 130)}…`}
        path={`/domaines/${domain.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: domain.title,
          description: domain.tagline,
          provider: { '@type': 'Organization', name: 'SKAL SERVICES SARL' },
          areaServed: ['BJ', 'TG', 'NE', 'CI'],
        }}
      />
      <Navbar />

      <article className="pt-28 sm:pt-32">
        {/* Hero */}
        <header className="section-x pb-12 sm:pb-16 border-b hairline">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-[hsl(var(--tangerine))] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour aux services
          </Link>

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Domaine {domain.num} / 04
                </span>
                {domain.flagship && (
                  <span className="inline-flex items-center gap-1.5 mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--tangerine))] border border-[hsl(var(--tangerine))/0.4] px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-[hsl(var(--tangerine))]" />
                    Domaine phare
                  </span>
                )}
                <span className="h-px flex-1 bg-[hsl(var(--ink))/0.15]" />
                <Icon className="w-6 h-6 text-[hsl(var(--tangerine))] stroke-[1.2]" />
              </div>
              <h1 className="display-serif fluid-display-lg font-light leading-[0.95]">
                {domain.title}
                <span className="text-[hsl(var(--tangerine))]">.</span>
              </h1>
              <p className="display-serif italic text-xl sm:text-2xl text-foreground/70 mt-4">
                {domain.tagline}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 self-end">
              <p className="text-base sm:text-lg text-foreground/70 leading-relaxed">
                {domain.intro}
              </p>
            </div>
          </div>
        </header>

        {/* Offres */}
        <section className="section-x section-y border-b hairline">
          <div className="grid grid-cols-12 gap-6 mb-10">
            <div className="col-span-12 md:col-span-5">
              <span className="ticker-tag">§ Notre offre</span>
              <h2 className="display-serif text-3xl sm:text-4xl font-light leading-tight mt-4">
                Ce que nous <span className="italic">proposons.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domain.offerings.map((o) => (
              <div
                key={o.title}
                className="border hairline rounded-md p-5 sm:p-6 bg-background hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 group"
              >
                <div className="flex items-start gap-3 mb-2">
                  <Check className="w-4 h-4 text-[hsl(var(--tangerine))] mt-1.5 flex-shrink-0" />
                  <span className="display-serif text-lg sm:text-xl font-light">{o.title}</span>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed ml-7 group-hover:text-[hsl(var(--cream))/0.7]">
                  {o.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="section-x section-y border-b hairline">
          <div className="grid grid-cols-12 gap-6 mb-10">
            <div className="col-span-12 md:col-span-6">
              <span className="ticker-tag">§ Méthode</span>
              <h2 className="display-serif text-3xl sm:text-4xl font-light leading-tight mt-4">
                Étapes du <span className="italic">projet.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domain.process.map((step) => (
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

        {/* Exemples */}
        <section className="section-x section-y border-b hairline bg-[hsl(var(--cream))]">
          <div className="grid grid-cols-12 gap-6 mb-10">
            <div className="col-span-12 md:col-span-6">
              <span className="ticker-tag">§ Réalisations</span>
              <h2 className="display-serif text-3xl sm:text-4xl font-light leading-tight mt-4">
                Quelques <span className="italic">exemples.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {domain.examples.map((ex) => {
              const Card = (
                <div className="group border hairline rounded-md overflow-hidden bg-background hover:shadow-lg transition-all duration-500 h-full flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden bg-[hsl(var(--ink))/0.05]">
                    <img
                      src={ex.image}
                      alt={ex.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="display-serif text-xl font-light leading-tight">{ex.title}</h3>
                    <p className="text-sm text-foreground/70 mt-2">{ex.caption}</p>
                    {ex.href && (
                      <span className="mt-auto pt-4 inline-flex items-center gap-1 mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--tangerine))]">
                        Voir le projet <ArrowUpRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
              return ex.href ? (
                <Link key={ex.title} to={ex.href}>{Card}</Link>
              ) : (
                <div key={ex.title}>{Card}</div>
              );
            })}
          </div>
        </section>

        {/* Livrables + Outils */}
        <section className="section-x section-y border-b hairline">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <span className="ticker-tag">§ Livrables</span>
              <h3 className="display-serif text-2xl sm:text-3xl font-light mt-4 mb-6">Ce que vous repartez avec.</h3>
              <ul className="space-y-3">
                {domain.deliverables.map((d) => (
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
                {domain.tools.map((t) => (
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
                <span className="italic text-[hsl(var(--tangerine))]">{domain.title.toLowerCase()}</span> ?
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

        {/* Autres domaines */}
        <section className="section-x section-y border-t hairline">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="ticker-tag">§ Autres domaines</span>
              <h2 className="display-serif text-2xl sm:text-3xl font-light mt-3">
                Nos autres <span className="italic">expertises.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((d) => {
              const OIcon = d.icon;
              return (
                <Link
                  key={d.slug}
                  to={`/domaines/${d.slug}`}
                  className="group border hairline rounded-md p-5 sm:p-6 bg-[hsl(var(--cream))] hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 flex flex-col min-h-[180px]"
                >
                  <div className="flex items-start justify-between">
                    <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-60">{d.num} / 04</span>
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500" />
                  </div>
                  <OIcon className="w-6 h-6 mt-6 stroke-[1.2] text-[hsl(var(--tangerine))]" />
                  <h3 className="display-serif text-xl sm:text-2xl font-light mt-auto pt-6 leading-tight">{d.title}</h3>
                  <p className="text-sm opacity-70 mt-2">{d.tagline}</p>
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

export default DomainPage;