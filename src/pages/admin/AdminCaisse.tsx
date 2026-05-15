import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { ArrowDownCircle, ArrowUpCircle, Loader2, Wallet, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatXOF, formatDate } from '@/lib/projects';

export default function AdminCaisse() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ amount: '', label: '', movement_date: new Date().toISOString().slice(0, 10) });

  const load = async () => {
    setLoading(true);
    const [{ data: m }, { data: s }] = await Promise.all([
      supabase.from('cash_movements').select('*').order('movement_date', { ascending: false }).limit(100),
      supabase.from('finance_summary').select('caisse_balance').maybeSingle(),
    ]);
    setMovements(m ?? []);
    setBalance(Number(s?.caisse_balance ?? 0));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.label.trim() || !form.amount) { toast.error('Libellé et montant requis'); return; }
    setSaving(true);
    const { error } = await supabase.from('cash_movements').insert({
      direction: 'sortie', amount: Number(form.amount),
      label: form.label.trim(), movement_date: form.movement_date,
      created_by: user?.id,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Sortie enregistrée');
    setForm({ amount: '', label: '', movement_date: new Date().toISOString().slice(0, 10) });
    setOpen(false);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Caisse entreprise</h1>
          <p className="text-sm text-white/50 mt-1">15% prélevés automatiquement sur chaque revenu encaissé.</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="outline" className="border-white/10 text-white hover:bg-white/5">
          <Minus className="w-4 h-4 mr-2" /> Enregistrer une sortie
        </Button>
      </div>

      <Card className="p-8 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold">Solde actuel</p>
            <p className="text-3xl md:text-4xl font-bold text-white mt-1 tabular-nums">{formatXOF(balance)}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Mouvements</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>
        ) : movements.length === 0 ? (
          <div className="p-12 text-center text-white/40">Aucun mouvement.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {movements.map((m) => (
              <div key={m.id} className="p-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  m.direction === 'entree' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {m.direction === 'entree' ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{m.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{formatDate(m.movement_date)}</p>
                </div>
                <p className={`text-base font-bold tabular-nums ${
                  m.direction === 'entree' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {m.direction === 'entree' ? '+' : '−'}{formatXOF(Number(m.amount))}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#111] border-white/10 text-white">
          <DialogHeader><DialogTitle>Sortie de caisse</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs text-white/60">Libellé *</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Achat fournitures, loyer…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-white/60">Montant *</Label>
                <Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-white/60">Date</Label>
                <Input type="date" value={form.movement_date} onChange={(e) => setForm({ ...form, movement_date: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 text-white hover:bg-white/5">Annuler</Button>
            <Button onClick={submit} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}