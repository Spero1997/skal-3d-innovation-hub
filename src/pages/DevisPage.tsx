import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';
import { Send, CheckCircle } from 'lucide-react';

const serviceOptions = [
  "Design graphique & Identité visuelle",
  "Cartographie & SIG",
  "Arpentage topographique",
  "Développement web & mobile",
  "Intelligence artificielle & Data",
  "Conseil & Stratégie digitale",
  "Autre",
];

const DevisPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (formRef.current) formRef.current.reset();
  };

  return (
    <OptimindLayout>
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
              <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Devis gratuit</span>
            </div>
            <h1 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
              DEMANDER UN DEVIS
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Décrivez votre projet et recevez une estimation personnalisée sous 48h. Sans engagement.
            </p>
          </div>

          {submitted ? (
            <div className="optimind-service-card rounded-2xl p-10 text-center animate-fade-in">
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-foreground mb-3">Demande envoyée !</h2>
              <p className="text-muted-foreground mb-6">
                Merci pour votre demande. Notre équipe vous contactera sous 48h avec une proposition détaillée.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-[hsl(var(--optimind-glow))] hover:underline"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="optimind-service-card rounded-2xl p-8 md:p-10 animate-fade-in space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="devis-name" className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="devis-name"
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Votre nom"
                    className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--optimind-glow)/0.3)]"
                  />
                </div>
                <div>
                  <label htmlFor="devis-email" className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="devis-email"
                    name="email"
                    required
                    maxLength={255}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--optimind-glow)/0.3)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="devis-phone" className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="devis-phone"
                  name="phone"
                  maxLength={20}
                  placeholder="+229 XX XX XX XX"
                  className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--optimind-glow)/0.3)]"
                />
              </div>

              <div>
                <label htmlFor="devis-service" className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Service souhaité *
                </label>
                <select
                  id="devis-service"
                  name="service"
                  required
                  className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--optimind-glow)/0.3)] appearance-none"
                >
                  <option value="">— Choisir un service —</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="devis-message" className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Décrivez votre projet *
                </label>
                <textarea
                  id="devis-message"
                  name="message"
                  rows={5}
                  required
                  maxLength={2000}
                  placeholder="Décrivez votre besoin, vos objectifs, vos délais éventuels..."
                  className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--optimind-glow)/0.3)]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-[hsl(var(--optimind-card))] font-medium rounded-full hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                Envoyer ma demande de devis
              </button>

              <p className="text-xs text-muted-foreground text-center">
                En soumettant ce formulaire, vous acceptez notre{' '}
                <a href="/privacy" className="text-[hsl(var(--optimind-glow))] hover:underline">politique de confidentialité</a>.
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default DevisPage;