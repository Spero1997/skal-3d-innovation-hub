import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';
import { formatXOF, formatDate } from '@/lib/projects';
import { toast } from 'sonner';

export default function AdminInvoiceDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState<any>(null);

  const load = async () => {
    const { data } = await (supabase as any).from('invoices')
      .select('*, clients(*), projects(name, code)').eq('id', id).maybeSingle();
    setInv(data);
  };
  useEffect(() => { load(); }, [id]);

  if (!inv) return <div className="p-8 text-white/40">Chargement…</div>;
  const lines = (inv.line_items as any[]) ?? [];

  const markPaid = async () => {
    await (supabase as any).from('invoices').update({ status: 'payee', amount_paid: inv.amount_ttc }).eq('id', inv.id);
    toast.success('Marquée payée');
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/admin/factures"><Button variant="ghost" className="text-white/60"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button></Link>
        <div className="flex gap-2">
          {inv.status !== 'payee' && (
            <Button onClick={markPaid} variant="outline" className="border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Marquer payée
            </Button>
          )}
          <Button onClick={() => window.print()} className="bg-orange-500 hover:bg-orange-600">
            <Printer className="w-4 h-4 mr-2" /> Imprimer / PDF
          </Button>
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
    </div>
  );
}
