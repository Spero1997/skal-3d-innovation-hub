import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';
import { Send, CheckCircle, Loader2, Paperclip, X } from 'lucide-react';
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

  const inputCls = "w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--optimind-glow)/0.3)]";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

  return (
    <OptimindLayout>
      <SEO
        title="Demander un devis gratuit — Skal Services"
        description="Décrivez votre projet et recevez une estimation personnalisée sous 48h. Sans engagement."
        path="/devis"
      />
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
              <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Devis gratuit</span>
            </div>
            <h1 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">DEMANDER UN DEVIS</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Décrivez votre projet et recevez une estimation personnalisée sous 48h. Sans engagement.
            </p>
          </div>

          {submitted ? (
            <div className="optimind-service-card rounded-2xl p-10 text-center animate-fade-in">
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-foreground mb-3">Demande envoyée !</h2>
              <p className="text-muted-foreground mb-6">
                Merci pour votre demande. Un email de confirmation vous a été envoyé. Notre équipe vous contactera sous 48h avec une proposition détaillée.
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
                <textarea id="devis-message" name="message" rows={5} required maxLength={2000}
                  placeholder="Décrivez votre projet, vos objectifs, vos délais éventuels..."
                  className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Pièce jointe (cahier des charges, plan, brief…)</label>
                <div className="flex items-center gap-3">
                  <label htmlFor="devis-file" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm hover:bg-[hsl(var(--secondary))]/70 transition">
                    <Paperclip className="w-4 h-4" />
                    {file ? "Changer le fichier" : "Joindre un fichier"}
                  </label>
                  <input id="devis-file" type="file" onChange={handleFileChange} className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.dwg,.dxf,.xlsx,.xls" />
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                      <span className="truncate max-w-[180px]">{file.name}</span>
                      <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">PDF, image, DWG, ZIP… 10 Mo max.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-[hsl(var(--optimind-card))] font-medium rounded-full hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Envoi en cours…" : "Envoyer ma demande de devis"}
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
