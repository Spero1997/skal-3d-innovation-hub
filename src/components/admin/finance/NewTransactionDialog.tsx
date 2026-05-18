import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatXOF } from '@/lib/projects';

type Project = { id: string; name: string; code: string | null };

export function NewTransactionDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<'revenu' | 'depense'>('revenu');
  const [form, setForm] = useState({
    project_id: 'none',
    amount: '',
    description: '',
    category: '',
    status: 'encaissee',
    transaction_date: new Date().toISOString().slice(0, 10),
    distribution_case: 'cas1_interne' as 'cas1_interne' | 'cas2_forfait' | 'cas3_au_cout' | 'ai',
    prestataire_name: '',
    prestataire_cost: '',
  });

  useEffect(() => {
    if (!open) return;
    supabase.from('projects').select('id,name,code').order('name').then(({ data }) => {
      setProjects((data ?? []) as Project[]);
    });
  }, [open]);

  const amount = Number(form.amount) || 0;
  const preview = (() => {
    if (type !== 'revenu' || amount <= 0) return null;
    if (form.distribution_case === 'ai') return null;
    const caisse = Math.round(amount * 0.15);
    if (form.distribution_case === 'cas1_interne') {
      const spero = Math.round(amount * 0.70);
      return { caisse, spero, prestataire: 0, associe: amount - caisse - spero };
    }
    if (form.distribution_case === 'cas2_forfait') {
      const prestataire = Math.round(amount * 0.35);
      const spero = Math.round(amount * 0.35);
      return { caisse, spero, prestataire, associe: amount - caisse - prestataire - spero };
    }
    const prestataire = Number(form.prestataire_cost) || 0;
    const net = amount - caisse - prestataire;
    if (net < 0) return null;
    const spero = Math.round(net / 2);
    return { caisse, spero, prestataire, associe: net - spero };
  })();

  const submit = async () => {
    if (!form.amount || Number(form.amount) <= 0) { toast.error('Montant invalide'); return; }
    if (type === 'revenu' && form.status === 'encaissee' && form.distribution_case === 'cas3_au_cout' && !form.prestataire_cost) {
      toast.error('Coût prestataire requis pour le cas 3'); return;
    }
    setSaving(true);
    const payload: any = {
      project_id: form.project_id === 'none' ? null : form.project_id,
      type, amount: Number(form.amount),
      description: form.description.trim() || null,
      category: form.category.trim() || null,
      status: form.status, transaction_date: form.transaction_date,
      created_by: user?.id,
    };
    if (type === 'revenu') {
      if (form.distribution_case === 'ai') {
        payload.distribution_case = null;
      } else {
        payload.distribution_case = form.distribution_case;
        payload.prestataire_name = form.prestataire_name.trim() || null;
        payload.prestataire_cost = form.distribution_case === 'cas3_au_cout'
          ? Number(form.prestataire_cost) || 0 : 0;
      }
    }
    const { error } = await supabase.from('transactions').insert(payload);
    setSaving(false);
    if (error) { toast.error('Erreur', { description: error.message }); return; }
    toast.success(form.distribution_case === 'ai' && type === 'revenu' && form.status === 'encaissee'
      ? 'Transaction enregistrée — caisse 15% bookée, suggestion IA à générer dans Validations'
      : 'Transaction enregistrée');
    onOpenChange(false);
    onCreated();
    setForm({
      project_id: 'none', amount: '', description: '', category: '',
      status: 'encaissee', transaction_date: new Date().toISOString().slice(0, 10),
      distribution_case: 'cas1_interne', prestataire_name: '', prestataire_cost: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction</DialogTitle>
          <DialogDescription className="text-white/40">
            La répartition est calculée automatiquement pour les revenus encaissés.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as any)}>
          <TabsList className="bg-[#0a0a0a] border border-white/5 grid grid-cols-2 w-full">
            <TabsTrigger value="revenu" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">Revenu</TabsTrigger>
            <TabsTrigger value="depense" className="data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400">Dépense</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <Field label="Projet">
            <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white max-h-60">
                <SelectItem value="none">Aucun</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.code ? `[${p.code}] ` : ''}{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date">
            <Input type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>

          <Field label="Montant (XOF) *">
            <Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Statut">
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="encaissee">Encaissée</SelectItem>
                <SelectItem value="prevue">Prévue</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Description">
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 text-white" />
            </Field>
          </div>

          {type === 'revenu' && (
            <>
              <div className="md:col-span-2">
                <Field label="Cas de répartition">
                  <Select value={form.distribution_case} onValueChange={(v) => setForm({ ...form, distribution_case: v as typeof form.distribution_case })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      <SelectItem value="cas1_interne">Cas 1 — Interne (15% / 70% / 15%)</SelectItem>
                      <SelectItem value="cas2_forfait">Cas 2 — Prestataire forfait (15% / 35% / 35% / 15%)</SelectItem>
                      <SelectItem value="cas3_au_cout">Cas 3 — Prestataire au coût (15% / coût / 50-50)</SelectItem>
                      <SelectItem value="ai">🤖 Laisser l'IA décider (caisse 15% garantie)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {form.distribution_case !== 'cas1_interne' && form.distribution_case !== 'ai' && (
                <>
                  <Field label="Nom prestataire (interne)">
                    <Input value={form.prestataire_name} onChange={(e) => setForm({ ...form, prestataire_name: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Confidentiel" />
                  </Field>
                  {form.distribution_case === 'cas3_au_cout' && (
                    <Field label="Coût prestataire (XOF)">
                      <Input type="number" min="0" value={form.prestataire_cost} onChange={(e) => setForm({ ...form, prestataire_cost: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                    </Field>
                  )}
                </>
              )}

              {preview && (
                <div className="md:col-span-2 p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold">Aperçu de la répartition</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <Row label="Caisse (15%)" value={preview.caisse} color="text-orange-400" />
                    {preview.prestataire > 0 && <Row label="Prestataire" value={preview.prestataire} color="text-fuchsia-400" />}
                    <Row label="Spero" value={preview.spero} color="text-blue-400" />
                    <Row label="Associé" value={preview.associe} color="text-emerald-400" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-white hover:bg-white/5">Annuler</Button>
          <Button onClick={submit} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-white/60">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60">{label}</span>
      <span className={`tabular-nums font-semibold ${color}`}>{formatXOF(value)}</span>
    </div>
  );
}