import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { formatXOF } from '@/lib/projects';

type Line = { description: string; quantity: number; unit_price: number };

export function NewInvoiceDialog({ open, onOpenChange, onCreated }: any) {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    client_id: '', project_id: '', vat_rate: 18, due_date: '',
    payment_terms: '40% à la commande, 60% à la livraison', notes: '',
  });
  const [lines, setLines] = useState<Line[]>([{ description: '', quantity: 1, unit_price: 0 }]);

  useEffect(() => {
    if (!open) return;
    supabase.from('clients').select('id,name,company').then(({ data }) => setClients(data ?? []));
    supabase.from('projects').select('id,name,code,client_id').then(({ data }) => setProjects(data ?? []));
  }, [open]);

  const ht = lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const ttc = ht * (1 + form.vat_rate / 100);

  const submit = async () => {
    if (!form.client_id) return toast.error('Client requis');
    if (lines.length === 0 || lines.every(l => !l.description)) return toast.error('Au moins une ligne');
    setSubmitting(true);
    const { error } = await (supabase as any).from('invoices').insert({
      client_id: form.client_id || null,
      project_id: form.project_id || null,
      vat_rate: form.vat_rate,
      due_date: form.due_date || null,
      payment_terms: form.payment_terms,
      notes: form.notes,
      amount_ht: ht,
      line_items: lines,
      created_by: user?.id,
    });
    setSubmitting(false);
    if (error) return toast.error('Erreur', { description: error.message });
    toast.success('Facture créée');
    onCreated?.();
    onOpenChange(false);
    setLines([{ description: '', quantity: 1, unit_price: 0 }]);
    setForm({ ...form, client_id: '', project_id: '', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nouvelle facture</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Client *</Label>
              <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Choisir…" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Projet</Label>
              <Select value={form.project_id} onValueChange={v => setForm({ ...form, project_id: v })}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>TVA (%)</Label>
              <Input type="number" value={form.vat_rate} onChange={e => setForm({ ...form, vat_rate: Number(e.target.value) })} className="bg-white/5 border-white/10" />
            </div>
            <div>
              <Label>Échéance</Label>
              <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="bg-white/5 border-white/10" />
            </div>
          </div>

          <div>
            <Label>Conditions de paiement</Label>
            <Input value={form.payment_terms} onChange={e => setForm({ ...form, payment_terms: e.target.value })} className="bg-white/5 border-white/10" />
          </div>

          <div className="space-y-2">
            <Label>Lignes</Label>
            {lines.map((l, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <Input placeholder="Description" value={l.description} onChange={e => { const n = [...lines]; n[i].description = e.target.value; setLines(n); }} className="col-span-6 bg-white/5 border-white/10" />
                <Input type="number" placeholder="Qté" value={l.quantity} onChange={e => { const n = [...lines]; n[i].quantity = Number(e.target.value); setLines(n); }} className="col-span-2 bg-white/5 border-white/10" />
                <Input type="number" placeholder="PU" value={l.unit_price} onChange={e => { const n = [...lines]; n[i].unit_price = Number(e.target.value); setLines(n); }} className="col-span-3 bg-white/5 border-white/10" />
                <Button variant="ghost" size="icon" onClick={() => setLines(lines.filter((_, j) => j !== i))} className="col-span-1 text-red-400"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setLines([...lines, { description: '', quantity: 1, unit_price: 0 }])} className="border-white/10 text-white">
              <Plus className="w-3 h-3 mr-1" /> Ajouter une ligne
            </Button>
          </div>

          <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-white/5 border-white/10" />

          <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-white/60"><span>Sous-total HT</span><span>{formatXOF(ht)}</span></div>
            <div className="flex justify-between text-white/60"><span>TVA ({form.vat_rate}%)</span><span>{formatXOF(ttc - ht)}</span></div>
            <div className="flex justify-between text-white font-semibold text-base"><span>Total TTC</span><span>{formatXOF(ttc)}</span></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={submitting} className="bg-orange-500 hover:bg-orange-600">
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
