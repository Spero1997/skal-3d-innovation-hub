import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, Printer, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatXOF, formatDate } from '@/lib/projects';
import { Link } from 'react-router-dom';
import { NewInvoiceDialog } from '@/components/admin/invoices/NewInvoiceDialog';

const STATUS: Record<string, { label: string; cls: string }> = {
  brouillon: { label: 'Brouillon', cls: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30' },
  envoyee: { label: 'Envoyée', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  partiellement_payee: { label: 'Partielle', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  payee: { label: 'Payée', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  annulee: { label: 'Annulée', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

export default function AdminInvoices() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('invoices')
      .select('*, clients(name, company), projects(name, code)')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter(i =>
    !q || i.number?.toLowerCase().includes(q.toLowerCase()) ||
    i.clients?.name?.toLowerCase().includes(q.toLowerCase())
  ), [items, q]);

  const total = items.reduce((s, i) => s + Number(i.amount_ttc ?? 0), 0);
  const paid = items.reduce((s, i) => s + Number(i.amount_paid ?? 0), 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6" /> Factures
          </h1>
          <p className="text-sm text-white/40 mt-1">Émission, suivi et impression</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle facture
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 bg-[#111]/80 border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Total facturé</p>
          <p className="text-xl font-bold text-white mt-1">{formatXOF(total)}</p>
        </Card>
        <Card className="p-4 bg-[#111]/80 border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Encaissé</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{formatXOF(paid)}</p>
        </Card>
        <Card className="p-4 bg-[#111]/80 border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Reste à percevoir</p>
          <p className="text-xl font-bold text-orange-400 mt-1">{formatXOF(total - paid)}</p>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="N° ou client" className="pl-9 bg-white/5 border-white/10 text-white" />
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {loading ? <div className="p-12 text-center text-white/40">Chargement…</div>
        : filtered.length === 0 ? <div className="p-12 text-center text-white/40">Aucune facture</div>
        : (
          <ul className="divide-y divide-white/5">
            {filtered.map(i => (
              <li key={i.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-mono text-white">{i.number}</p>
                    <Badge variant="outline" className={STATUS[i.status]?.cls}>{STATUS[i.status]?.label}</Badge>
                  </div>
                  <p className="text-xs text-white/50 mt-1 truncate">
                    {i.clients?.name ?? '—'} · {i.projects?.name ?? '—'} · {formatDate(i.issue_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatXOF(Number(i.amount_ttc))}</p>
                  <p className="text-[11px] text-white/40">{Number(i.amount_paid) > 0 && `+${formatXOF(Number(i.amount_paid))} payé`}</p>
                </div>
                <Link to={`/admin/factures/${i.id}`}>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><Printer className="w-4 h-4" /></Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <NewInvoiceDialog open={open} onOpenChange={setOpen} onCreated={load} />
    </div>
  );
}
