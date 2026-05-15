import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react';
import { formatXOF, formatDate } from '@/lib/projects';
import { NewTransactionDialog } from '@/components/admin/finance/NewTransactionDialog';

const CASE_LABELS: Record<string, string> = {
  cas1_interne: 'Cas 1 — Interne',
  cas2_forfait: 'Cas 2 — Forfait',
  cas3_au_cout: 'Cas 3 — Au coût',
};

export default function AdminFinances() {
  const [summary, setSummary] = useState<any>(null);
  const [tx, setTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: t }] = await Promise.all([
      supabase.from('finance_summary').select('*').maybeSingle(),
      supabase.from('transactions').select('*').order('transaction_date', { ascending: false }).limit(100),
    ]);
    setSummary(s);
    setTx(t ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const stats = [
    { label: 'Revenus encaissés', value: formatXOF(Number(summary?.total_revenue ?? 0)), icon: TrendingUp, accent: 'from-emerald-500 to-emerald-600' },
    { label: 'Dépenses', value: formatXOF(Number(summary?.total_expense ?? 0)), icon: TrendingDown, accent: 'from-red-500 to-red-600' },
    { label: 'Caisse entreprise', value: formatXOF(Number(summary?.caisse_balance ?? 0)), icon: Wallet, accent: 'from-orange-500 to-orange-600' },
    { label: 'Part associés', value: formatXOF(Number(summary?.total_associes ?? 0)), icon: Users, accent: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Finances</h1>
          <p className="text-sm text-white/50 mt-1">Revenus, dépenses et répartitions automatiques.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle transaction
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-5 bg-[#111]/80 border-white/5">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.accent} flex items-center justify-center mb-4 shadow-lg`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-white/50 uppercase tracking-wider">{s.label}</p>
                <p className="text-xl font-bold text-white mt-1">{s.value}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Dernières transactions</h2>
            </div>
            {tx.length === 0 ? (
              <div className="p-12 text-center text-white/40">Aucune transaction enregistrée.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {tx.map((t) => (
                  <div key={t.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      t.type === 'revenu' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {t.type === 'revenu' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{t.description ?? (t.type === 'revenu' ? 'Revenu' : 'Dépense')}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                        <span>{formatDate(t.transaction_date)}</span>
                        {t.distribution_case && (
                          <Badge variant="outline" className="text-[10px] border-white/10 text-white/60">
                            {CASE_LABELS[t.distribution_case]}
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-[10px] ${
                          t.status === 'encaissee' ? 'border-emerald-500/30 text-emerald-400'
                          : t.status === 'prevue' ? 'border-yellow-500/30 text-yellow-400'
                          : 'border-red-500/30 text-red-400'
                        }`}>
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                    <p className={`text-base font-bold tabular-nums ${
                      t.type === 'revenu' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {t.type === 'revenu' ? '+' : '−'}{formatXOF(Number(t.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <NewTransactionDialog open={open} onOpenChange={setOpen} onCreated={load} />
    </div>
  );
}