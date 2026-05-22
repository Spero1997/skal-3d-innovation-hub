import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';
import { ArrowDownRight, CheckCircle2, Loader2, Paperclip, X } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const serviceOptions = [
  "Architecture & BTP",
  "Géomatique & SIG / Cartographie",
  "Graphisme & IA / Identité visuelle",
  "Web & Digital",
  "Conseil & Stratégie",
  "Autre",
];

const budgetOptions = [
  "Moins de 500 000 FCFA",
  "500 000 – 1 500 000 FCFA",
  "1 500 000 – 5 000 000 FCFA",
  "5 000 000 – 15 000 000 FCFA",
  "Plus de 15 000 000 FCFA",
  "À définir ensemble",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const devisSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  service: z.string().min(1, "Choisissez un service"),
  budget: z.string().optional().or(z.literal('')),
  message: z.string().trim().min(10, "Décrivez votre besoin (10 caractères min)").max(2000),
});

const DevisPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_FILE_SIZE) {
      toast.error("Fichier trop volumineux (max 10 Mo)");
      e.target.value = '';
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get('name') ?? ''),
      company: String(fd.get('company') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      service: String(fd.get('service') ?? ''),
      budget: String(fd.get('budget') ?? ''),
      message: String(fd.get('message') ?? ''),
    };

    const parsed = devisSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Formulaire invalide";
      toast.error(first);
      return;
    }

    setLoading(true);
    try {
      const id = crypto.randomUUID();
      let filePath: string | null = null;

      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${id}/${safeName}`;
        const { error: upErr } = await supabase.storage
          .from('devis-files')
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        filePath = path;
      }

      const { error: insErr } = await supabase.from('devis_requests').insert({
        id,
        name: parsed.data.name,
        company: parsed.data.company || null,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        service: parsed.data.service,
        budget: parsed.data.budget || null,
        message: parsed.data.message,
        file_path: filePath,
      });
      if (insErr) throw insErr;

      // Email de confirmation (envoyé si l'infrastructure email est active)
      try {
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'devis-confirmation',
            recipientEmail: parsed.data.email,
            idempotencyKey: `devis-confirm-${id}`,
            templateData: {
              name: parsed.data.name,
              service: parsed.data.service,
            },
          },
        });
      } catch (emailErr) {
        console.warn('Email de confirmation non envoyé:', emailErr);
      }

      setSubmitted(true);
      formRef.current?.reset();
      setFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-transparent border-b hairline display-serif text-lg sm:text-xl font-light py-2 outline-none focus:border-[hsl(var(--tangerine))] transition-colors";
  const labelCls = "block mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5";

  return (
    <OptimindLayout>
      <SEO
        title="Demander un devis gratuit — Skal Services"
        description="Décrivez votre projet et recevez une estimation personnalisée sous 48h. Sans engagement."
        path="/devis"
      />
      <Navbar />
      <PageHero
        index="04"
        kicker="Devis gratuit"
        title={<>Décrivez votre projet,<br /><span className="italic">recevez une estimation sous 48h.</span></>}
        lede="Sans engagement. Un seul interlocuteur revient vers vous avec un premier retour qualifié et une proposition chiffrée."
      />
      <div className="section-x section-y">
        <div className="grid grid-cols-12 gap-6">
          {submitted ? (
          <div className="col-span-12 md:col-span-8 md:col-start-3 border hairline-strong bg-[hsl(var(--cream))] p-10 md:p-16 text-center animate-fade-in">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-6 text-[hsl(var(--tangerine))]" strokeWidth={1.2} />
            <h2 className="display-serif text-3xl md:text-4xl font-light mb-4">Demande envoyée.</h2>
            <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                Merci pour votre demande. Un email de confirmation vous a été envoyé. Notre équipe vous contactera sous 48h avec une proposition détaillée.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mono text-[10px] uppercase tracking-[0.25em] text-foreground hover:text-[hsl(var(--tangerine))] transition-colors"
              >
                → Envoyer une autre demande
              </button>
            </div>
          ) : (
            <>
            {/* Asymmetric meta column */}
            <aside className="col-span-12 md:col-span-3 md:sticky md:top-24 md:self-start">
              <span className="ticker-tag">§ Formulaire</span>
              <p className="display-serif text-xl md:text-2xl font-light mt-4 leading-snug">
                Plus votre brief est <span className="italic">précis</span>, plus notre retour le sera.
              </p>
              <ul className="mt-8 space-y-3 mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <li className="flex gap-3 border-t hairline pt-3"><span className="text-[hsl(var(--tangerine))] tabular-nums">01</span> Réponse sous 48h</li>
                <li className="flex gap-3 border-t hairline pt-3"><span className="text-[hsl(var(--tangerine))] tabular-nums">02</span> Sans engagement</li>
                <li className="flex gap-3 border-t hairline pt-3"><span className="text-[hsl(var(--tangerine))] tabular-nums">03</span> Premier RDV offert</li>
              </ul>
            </aside>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="col-span-12 md:col-span-8 md:col-start-5 border hairline-strong bg-[hsl(var(--cream))] p-6 sm:p-10 md:p-14 animate-fade-in space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="devis-name" className={labelCls}>Nom complet *</label>
                  <input id="devis-name" name="name" type="text" required maxLength={100} placeholder="Votre nom" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="devis-company" className={labelCls}>Société / Organisation</label>
                  <input id="devis-company" name="company" type="text" maxLength={150} placeholder="Optionnel" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="devis-email" className={labelCls}>Email *</label>
                  <input id="devis-email" name="email" type="email" required maxLength={255} placeholder="votre@email.com" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="devis-phone" className={labelCls}>Téléphone</label>
                  <input id="devis-phone" name="phone" type="tel" maxLength={30} placeholder="+229 XX XX XX XX" className={inputCls} />
                </div>
              </div>

              <div>
                <label htmlFor="devis-service" className={labelCls}>Service souhaité *</label>
                <select id="devis-service" name="service" required className={`${inputCls} appearance-none`}>
                  <option value="">— Choisir un service —</option>
                  {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="devis-budget" className={labelCls}>Budget estimé</label>
                <select id="devis-budget" name="budget" className={`${inputCls} appearance-none`}>
                  <option value="">— Optionnel —</option>
                  {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="devis-message" className={labelCls}>Décrivez votre besoin *</label>
                <textarea id="devis-message" name="message" rows={6} required maxLength={2000}
                  placeholder="Décrivez votre projet, vos objectifs, vos délais éventuels..."
                  className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>Pièce jointe (cahier des charges, plan, brief…)</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label htmlFor="devis-file" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border hairline-strong mono text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors rounded-full">
                    <Paperclip className="w-4 h-4" />
                    {file ? "Changer le fichier" : "Joindre un fichier"}
                  </label>
                  <input id="devis-file" type="file" onChange={handleFileChange} className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.dwg,.dxf,.xlsx,.xls" />
                  {file && (
                    <div className="flex items-center gap-2 mono text-[11px] text-muted-foreground truncate">
                      <span className="truncate max-w-[180px]">{file.name}</span>
                      <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3">PDF, image, DWG, ZIP… 10 Mo max.</p>
              </div>

              <div className="border-t hairline pt-6 flex items-center justify-between flex-wrap gap-4">
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground max-w-xs">
                  En soumettant ce formulaire, vous acceptez notre{' '}
                  <a href="/privacy" className="underline hover:text-[hsl(var(--tangerine))]">politique de confidentialité</a>.
                </p>
                <button type="submit" disabled={loading} className="btn-ink disabled:opacity-50">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</> : <>Envoyer ma demande <ArrowDownRight className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </OptimindLayout>
  );
};

export default DevisPage;
