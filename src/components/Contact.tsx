import React, { useRef } from 'react';
import { Mail, MapPin, Phone, ArrowDownRight } from 'lucide-react';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre message. Nous revenons vers vous sous 48h.');
    formRef.current?.reset();
  };

  return (
    <section id="contact" className="px-6 md:px-10 py-24 border-t hairline">
      <div className="grid grid-cols-12 gap-6 mb-16">
        <div className="col-span-12 md:col-span-6">
          <span className="ticker-tag">§ Contact</span>
          <h2 className="display-serif text-5xl md:text-7xl font-light leading-[0.95] mt-4">
            Écrivez-nous, <span className="italic">simplement.</span>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
          <p className="text-base text-foreground/70 leading-relaxed">
            Décrivez votre projet en quelques lignes. Nous revenons vers vous sous 48h ouvrées avec un premier retour qualifié.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 space-y-px bg-[hsl(var(--ink))/0.12] border hairline">
          <ContactRow icon={<Phone className="w-4 h-4" />} label="Téléphone" value="+229 01 90 31 55 46" href="tel:+2290190315546" />
          <ContactRow icon={<Mail className="w-4 h-4" />} label="Email" value="skalservice.0@gmail.com" href="mailto:skalservice.0@gmail.com" />
          <ContactRow icon={<MapPin className="w-4 h-4" />} label="Atelier" value="Abomey-Calavi, Tokan — Bénin" />
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="col-span-12 md:col-span-8 border hairline p-6 md:p-10 bg-[hsl(var(--cream))]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[hsl(var(--ink))/0.12] mb-px">
            <Field id="name" label="Nom" />
            <Field id="email" label="Email" type="email" />
          </div>
          <Field id="subject" label="Sujet" />
          <Field id="message" label="Message" textarea />
          <button type="submit" className="btn-ink mt-8">
            Envoyer le message <ArrowDownRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

const ContactRow: React.FC<{ icon: React.ReactNode; label: string; value: string; href?: string }> = ({ icon, label, value, href }) => {
  const content = (
    <div className="bg-background p-6 flex items-start gap-4 hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500">
      <div className="opacity-60">{icon}</div>
      <div>
        <div className="mono text-[10px] uppercase tracking-[0.25em] opacity-60 mb-1">{label}</div>
        <div className="display-serif text-xl">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{content}</a> : <div>{content}</div>;
};

const Field: React.FC<{ id: string; label: string; type?: string; textarea?: boolean }> = ({ id, label, type = 'text', textarea }) => (
  <div className="bg-[hsl(var(--cream))] py-3">
    <label htmlFor={id} className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-1.5">
      {label}
    </label>
    {textarea ? (
      <textarea id={id} name={id} required rows={5} className="w-full bg-transparent border-b hairline focus:border-[hsl(var(--tangerine))] outline-none py-2 display-serif text-xl font-light resize-none transition-colors" />
    ) : (
      <input id={id} name={id} type={type} required className="w-full bg-transparent border-b hairline focus:border-[hsl(var(--tangerine))] outline-none py-2 display-serif text-xl font-light transition-colors" />
    )}
  </div>
);

export default Contact;
