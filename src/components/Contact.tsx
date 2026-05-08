import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowDownRight, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(100, 'Max 100 caractères'),
  email: z.string().trim().email('Email invalide').max(255),
  subject: z.string().trim().min(2, 'Sujet trop court').max(150).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message trop court (min. 10 caractères)').max(2000, 'Max 2000 caractères'),
});

type FormErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const Contact: React.FC = () => {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const update = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error('Merci de corriger les champs en rouge.');
      return;
    }

    setStatus('sending');
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: parsed.data,
      });
      if (error) throw error;
      setStatus('sent');
      toast.success('Message envoyé. Nous revenons vers vous sous 48h.');
      setValues({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
      toast.error("Envoi impossible. Réessayez ou écrivez-nous directement à servicesskal@gmail.com");
    }
  };

  return (
    <section id="contact" className="section-x section-y border-t hairline">
      {/* Editorial visual — notifications clients en temps réel */}
      <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14 xl:-mx-20 mb-16 sm:mb-20">
        <img
          src="/showcase/notifications-2.png"
          alt="Notifications clients SKAL Service en temps réel"
          loading="lazy"
          className="w-full h-[40vh] md:h-[55vh] object-cover"
        />
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>◦ Notifications en temps réel</span>
          <span>Toujours à votre écoute</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-12 sm:mb-16">
        <div className="col-span-12 md:col-span-6">
          <span className="ticker-tag">§ Contact</span>
          <h2 className="display-serif fluid-display font-light leading-[0.95] mt-4">
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
          <ContactRow icon={<Phone className="w-4 h-4" />} label="Téléphone" value="+229 01 97 58 60 22" href="tel:+2290197586022" />
          <ContactRow icon={<Phone className="w-4 h-4" />} label="Téléphone" value="+229 01 67 75 07 78" href="tel:+2290167750778" />
          <ContactRow icon={<Mail className="w-4 h-4" />} label="Email" value="servicesskal@gmail.com" href="mailto:servicesskal@gmail.com" />
          <ContactRow icon={<MapPin className="w-4 h-4" />} label="Atelier" value="Abomey-Calavi, Tokan — Bénin" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="col-span-12 md:col-span-8 border hairline p-5 sm:p-6 md:p-10 bg-[hsl(var(--cream))]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[hsl(var(--ink))/0.12] mb-px">
            <Field id="name" label="Nom" value={values.name} onChange={update('name')} error={errors.name} />
            <Field id="email" label="Email" type="email" value={values.email} onChange={update('email')} error={errors.email} />
          </div>
          <Field id="subject" label="Sujet (optionnel)" value={values.subject} onChange={update('subject')} error={errors.subject} required={false} />
          <Field id="message" label="Message" textarea value={values.message} onChange={update('message')} error={errors.message} />
          <div className="flex items-center justify-between mt-6 sm:mt-8 flex-wrap gap-4">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Réponse sous 48h ouvrées
            </p>
            <button type="submit" disabled={status !== 'idle'} className="btn-ink disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'sending' && (<><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</>)}
              {status === 'sent' && (<><CheckCircle2 className="w-4 h-4" /> Envoyé</>)}
              {status === 'idle' && (<>Envoyer le message <ArrowDownRight className="w-4 h-4" /></>)}
            </button>
          </div>
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

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
}

const Field: React.FC<FieldProps> = ({ id, label, type = 'text', textarea, value, onChange, error, required = true }) => {
  const baseCls = `w-full bg-transparent border-b outline-none py-2 display-serif text-lg sm:text-xl font-light transition-colors ${
    error ? 'border-destructive' : 'hairline focus:border-[hsl(var(--tangerine))]'
  }`;
  return (
    <div className="bg-[hsl(var(--cream))] py-3">
      <label htmlFor={id} className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={id} required={required} rows={5} value={value} onChange={onChange} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${baseCls} resize-none`} />
      ) : (
        <input id={id} name={id} type={type} required={required} value={value} onChange={onChange} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={baseCls} />
      )}
      {error && (
        <p id={`${id}-err`} className="mono text-[10px] uppercase tracking-[0.2em] text-destructive mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Contact;
