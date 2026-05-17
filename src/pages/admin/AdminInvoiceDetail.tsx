import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatXOF, formatDate } from '@/lib/projects';
import { toast } from 'sonner';

export default function AdminInvoiceDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState<any>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [paying, setPaying] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from('invoices')
      .select('*, clients(*), projects(name, code)').eq('id', id).maybeSingle();
    setInv(data);
  };
  useEffect(() => { load(); }, [id]);

  if (!inv) return <div className="p-8 text-white/40">Chargement…</div>;
  const lines = (inv.line_items as any[]) ?? [];
  const ttc = Number(inv.amount_ttc ?? 0);
  const paid = Number(inv.amount_paid ?? 0);
  const remaining = Math.max(0, ttc - paid);

  const openPay = () => {
    setPayAmount(String(remaining));
    setPayOpen(true);
  };

  const confirmPay = async () => {
    const amt = Number(payAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error('Montant invalide');
      return;
    }
    if (amt > remaining + 0.01) {
      toast.error(`Le montant dépasse le restant (${formatXOF(remaining)})`);
      return;
    }
    setPaying(true);
    try {
      const newPaid = +(paid + amt).toFixed(2);
      const newStatus = newPaid + 0.01 >= ttc ? 'payee' : 'partiellement_payee';
      const { error } = await (supabase as any)
        .from('invoices')
        .update({ amount_paid: newPaid, status: newStatus })
        .eq('id', inv.id);
      if (error) throw error;

      // Notifications → direction + project manager
      try {
        const recipients = new Set<string>();
        const { data: dirs } = await (supabase as any)
          .from('user_roles')
          .select('user_id')
          .in('role', ['super_admin', 'associe', 'comptable']);
        (dirs ?? []).forEach((r: any) => r.user_id && recipients.add(r.user_id));
        if (inv.project_id) {
          const { data: p } = await (supabase as any)
            .from('projects').select('manager_id').eq('id', inv.project_id).maybeSingle();
          if (p?.manager_id) recipients.add(p.manager_id);
        }
        const title = newStatus === 'payee' ? 'Facture payée' : 'Paiement partiel reçu';
        const body = `${inv.number} — ${formatXOF(amt)} (${formatXOF(newPaid)} / ${formatXOF(ttc)})`;
        const link = `/admin/factures/${inv.id}`;
        const rows = Array.from(recipients).map(user_id => ({
          user_id, type: 'transaction', title, body, link,
        }));
        if (rows.length) await (supabase as any).from('notifications').insert(rows);
      } catch (e) {
        console.warn('notifications insert failed', e);
      }

      toast.success(newStatus === 'payee' ? 'Facture marquée payée' : 'Paiement enregistré');
      setPayOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message ?? 'Erreur');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/admin/factures"><Button variant="ghost" className="text-white/60"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button></Link>
        <div className="flex gap-2">
          {inv.status !== 'payee' && (
            <Button onClick={openPay} variant="outline" className="border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Enregistrer un paiement
            </Button>
          )}
          <Button onClick={() => window.print()} className="bg-orange-500 hover:bg-orange-600">
            <Printer className="w-4 h-4 mr-2" /> Imprimer / PDF
          </Button>
        </div>
      </div>

      {/* KPIs paiement */}
      <div className="grid grid-cols-3 gap-3 print:hidden">
        <div className="rounded-lg border border-white/5 bg-[#111]/80 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Facturé TTC</p>
          <p className="text-lg font-bold text-white mt-1">{formatXOF(ttc)}</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-[#111]/80 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Encaissé</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">{formatXOF(paid)}</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-[#111]/80 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Restant</p>
          <p className="text-lg font-bold text-orange-400 mt-1">{formatXOF(remaining)}</p>
        </div>
      </div>

      <div className="bg-white text-black p-10 rounded-lg shadow-2xl print:shadow-none print:rounded-none print:p-12">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="w-12 h-12 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-lg mb-3">S</div>
            <p className="font-bold text-lg">SKAL SERVICES SARL</p>
            <p className="text-xs text-gray-600">Cotonou, Bénin</p>
            <p className="text-xs text-gray-600">servicesskal@gmail.com</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-500">FACTURE</p>
            <p className="font-mono text-sm mt-1">{inv.number}</p>
            <p className="text-xs text-gray-600 mt-2">Date : {formatDate(inv.issue_date)}</p>
            {inv.due_date && <p className="text-xs text-gray-600">Échéance : {formatDate(inv.due_date)}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Facturé à</p>
            <p className="font-semibold">{inv.clients?.name ?? '—'}</p>
            {inv.clients?.company && <p className="text-sm">{inv.clients.company}</p>}
            {inv.clients?.address && <p className="text-xs text-gray-600">{inv.clients.address}</p>}
            {inv.clients?.email && <p className="text-xs text-gray-600">{inv.clients.email}</p>}
          </div>
          {inv.projects && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Projet</p>
              <p className="font-semibold">{inv.projects.name}</p>
              {inv.projects.code && <p className="text-xs text-gray-600">{inv.projects.code}</p>}
            </div>
          )}
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 text-xs uppercase text-gray-500">Description</th>
              <th className="text-right py-2 text-xs uppercase text-gray-500 w-16">Qté</th>
              <th className="text-right py-2 text-xs uppercase text-gray-500 w-32">PU</th>
              <th className="text-right py-2 text-xs uppercase text-gray-500 w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 text-sm">{l.description}</td>
                <td className="text-right text-sm">{l.quantity}</td>
                <td className="text-right text-sm">{formatXOF(l.unit_price)}</td>
                <td className="text-right text-sm font-medium">{formatXOF(l.quantity * l.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Sous-total HT</span><span>{formatXOF(Number(inv.amount_ht))}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">TVA ({inv.vat_rate}%)</span><span>{formatXOF(Number(inv.amount_ttc) - Number(inv.amount_ht))}</span></div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-gray-800 pt-2"><span>Total TTC</span><span>{formatXOF(Number(inv.amount_ttc))}</span></div>
            {Number(inv.amount_paid) > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Payé</span><span>− {formatXOF(Number(inv.amount_paid))}</span></div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <p className="text-xs"><span className="font-semibold">Conditions :</span> {inv.payment_terms}</p>
          {inv.notes && <p className="text-xs text-gray-600 whitespace-pre-line">{inv.notes}</p>}
          <p className="text-[10px] text-gray-400 mt-6 text-center">SKAL SERVICES SARL — Architecture & BTP · Géomatique & SIG · Graphisme & IA · Web & Digital</p>
        </div>
      </div>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription className="text-white/50">
              Facture {inv.number} — Restant : <span className="text-orange-400 font-semibold">{formatXOF(remaining)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-white/70">Montant reçu (XOF)</Label>
              <Input
                type="number" min="0" step="1"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-white/10 text-white/70"
                onClick={() => setPayAmount(String(remaining))}>
                Solde total ({formatXOF(remaining)})
              </Button>
              <Button size="sm" variant="outline" className="border-white/10 text-white/70"
                onClick={() => setPayAmount(String(+(remaining / 2).toFixed(0)))}>
                50%
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayOpen(false)} disabled={paying}>Annuler</Button>
            <Button onClick={confirmPay} disabled={paying} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {paying ? 'Enregistrement…' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
