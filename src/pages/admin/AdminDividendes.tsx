import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, Plus, CheckCircle2 } from 'lucide-react';
import { formatXOF, formatDate } from '@/lib/projects';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDividendes() {
  const { user } = useAuth();
  const [dist, setDist] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [d, p, pr] = await Promise.all([
      supabase.from('revenue_distributions').select('*').order('created_at', { ascending: false }),
      (supabase as any).from('payouts').select('*').order('payout_date', { ascending: false }),
      supabase.from('profiles').select('user_id, full_name'),
    ]);
    setDist(d.data ?? []);
    setPayouts(p.data ?? []);
    const map: Record<string, string> = {};
    (pr.data ?? []).forEach((x: any) => { map[x.user_id] = x.full_name ?? '—'; });
    setProfiles(map);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const summary = useMemo(() => {
    const m = new Map<string, { spero: number; associe: number; count: number }>();
    dist.forEach(d => {
      const k = d.associe_id ?? 'spero_only';
      if (!m.has(k)) m.set(k, { spero: 0, associe: 0, count: 0 });
      const r = m.get(k)!;
      r.spero += Number(d.spero_share);
      r.associe += Number(d.associe_share);
      r.count += 1;
    });
    return Array.from(m.entries()).map(([id, v]) => ({ id, ...v }));
  }, [dist]);

  const paidByBenef = useMemo(() => {
    const m = new Map<string, number>();
    payouts.forEach(p => m.set(p.beneficiary_id, (m.get(p.beneficiary_id) ?? 0) + Number(p.amount)));
    return m;
  }, [payouts]);

  const recordPayout = async (benefId: string, amount: number) => {
    if (!confirm(`Enregistrer un versement de ${formatXOF(amount)} ?`)) return;
    await (supabase as any).from('payouts').insert({
      beneficiary_id: benefId, beneficiary_role: 'associe',
      amount, description: 'Versement dividendes', created_by: user?.id,
    });
    toast.success('Versement enregistré');
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PiggyBank className="w-6 h-6" /> Dividendes & versements
        </h1>
        <p className="text-sm text-white/40 mt-1">Cumul confidentiel par bénéficiaire</p>
      </div>

      {loading ? <div className="text-white/40">Chargement…</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.map(s => {
              const total = s.spero + s.associe;
              const benef = s.id === 'spero_only' ? 'Non assigné' : (profiles[s.id] ?? s.id);
              const paid = paidByBenef.get(s.id) ?? 0;
              const due = s.associe - paid;
              return (
                <Card key={s.id} className="p-5 bg-[#111]/80 border-white/5">
                  <p className="text-xs text-white/50 uppercase tracking-wider">{benef}</p>
                  <p className="text-2xl font-bold text-white mt-1">{formatXOF(s.associe)}</p>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-white/60"><span>Part Spero (cumulée)</span><span>{formatXOF(s.spero)}</span></div>
                    <div className="flex justify-between text-white/60"><span>Versements effectués</span><span className="text-emerald-400">{formatXOF(paid)}</span></div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-white/10"><span className="text-white/80">Reste dû</span><span className="text-orange-400">{formatXOF(due)}</span></div>
                    <p className="text-[10px] text-white/40 pt-1">{s.count} distribution(s)</p>
                  </div>
                  {s.id !== 'spero_only' && due > 0 && (
                    <Button size="sm" onClick={() => recordPayout(s.id, due)}
                      className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="w-3 h-3 mr-2" /> Marquer versé
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>

          <Card className="p-5 bg-[#111]/80 border-white/5">
            <h2 className="text-base font-semibold text-white mb-3">Historique des versements</h2>
            {payouts.length === 0 ? <p className="text-sm text-white/40">Aucun versement</p> : (
              <ul className="divide-y divide-white/5">
                {payouts.map(p => (
                  <li key={p.id} className="py-2.5 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white">{profiles[p.beneficiary_id] ?? '—'}</p>
                      <p className="text-[11px] text-white/40">{formatDate(p.payout_date)} · {p.description}</p>
                    </div>
                    <span className="text-emerald-400 font-semibold">{formatXOF(Number(p.amount))}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
