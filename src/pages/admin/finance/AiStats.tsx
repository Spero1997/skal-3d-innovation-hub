import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, ShieldAlert, Zap, CheckCircle2, XCircle } from 'lucide-react';

type Row = {
  agent_slug: string;
  field: string;
  decision: string;
  confidence: number | null;
  threshold: number | null;
  user_id: string | null;
  created_at: string;
};

const DECISION_COLORS: Record<string, string> = {
  applied: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  blocked: 'bg-red-500/15 text-red-400 border-red-500/30',
  forced: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  ignored: 'bg-white/10 text-white/50 border-white/15',
};

const DECISION_ICON: Record<string, any> = {
  applied: CheckCircle2,
  blocked: XCircle,
  forced: Zap,
  ignored: ShieldAlert,
};

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default function AiStats() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase
        .from('ai_suggestion_audit')
        .select('agent_slug, field, decision, confidence, threshold, user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(2000);
      if (period !== 'all') {
        const since = new Date(Date.now() - Number(period) * 24 * 3600 * 1000).toISOString();
        q = q.gte('created_at', since);
      }
      const { data } = await q;
      setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, [period]);

  // Global stats
  const total = rows.length;
  const counts: Record<string, number> = { applied: 0, blocked: 0, forced: 0, ignored: 0 };
  rows.forEach((r) => { counts[r.decision] = (counts[r.decision] ?? 0) + 1; });
  const acceptanceRate = total ? Math.round(((counts.applied + counts.forced) / total) * 100) : 0;
  const blockRate = total ? Math.round((counts.blocked / total) * 100) : 0;
  const avgConfidence = avg(rows.map((r) => r.confidence ?? 0).filter((c) => c > 0));

  // Per-agent stats
  const byAgent: Record<string, Row[]> = {};
  rows.forEach((r) => {
    if (!byAgent[r.agent_slug]) byAgent[r.agent_slug] = [];
    byAgent[r.agent_slug].push(r);
  });

  // Per-user stats
  const byUser: Record<string, Row[]> = {};
  rows.forEach((r) => {
    const k = r.user_id ?? 'anon';
    if (!byUser[k]) byUser[k] = [];
    byUser[k].push(r);
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" /> Statistiques IA
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Acceptation, blocages, forçages et confiance moyenne par agent et utilisateur.
          </p>
        </div>
        <div className="flex gap-1">
          {(['7', '30', '90', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-md border ${
                period === p
                  ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
              }`}
            >
              {p === 'all' ? 'Tout' : `${p}j`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="bg-[#111]/80 border-white/5 p-12 text-center text-white/40">Chargement…</Card>
      ) : total === 0 ? (
        <Card className="bg-[#111]/80 border-white/5 p-12 text-center text-white/40">
          Aucune interaction IA sur la période.
        </Card>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-[#111]/80 border-white/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Total suggestions</p>
              <p className="text-2xl font-bold text-white mt-1">{total}</p>
            </Card>
            <Card className="bg-[#111]/80 border-emerald-500/20 p-4">
              <p className="text-[10px] uppercase tracking-wider text-emerald-400/70">Taux d'acceptation</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{acceptanceRate}%</p>
              <p className="text-[10px] text-white/40 mt-0.5">{counts.applied} appliquées, {counts.forced} forcées</p>
            </Card>
            <Card className="bg-[#111]/80 border-red-500/20 p-4">
              <p className="text-[10px] uppercase tracking-wider text-red-400/70">Taux de blocage</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{blockRate}%</p>
              <p className="text-[10px] text-white/40 mt-0.5">{counts.blocked} blocages</p>
            </Card>
            <Card className="bg-[#111]/80 border-orange-500/20 p-4">
              <p className="text-[10px] uppercase tracking-wider text-orange-400/70">Confiance moyenne</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">{avgConfidence}%</p>
            </Card>
          </div>

          {/* Per agent */}
          <Card className="bg-[#111]/80 border-white/5 p-6">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-orange-400" /> Par agent IA
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5">
                    <th className="text-left py-2 px-2">Agent</th>
                    <th className="text-right py-2 px-2">Total</th>
                    <th className="text-right py-2 px-2">Acceptation</th>
                    <th className="text-right py-2 px-2">Blocages</th>
                    <th className="text-right py-2 px-2">Forçages</th>
                    <th className="text-right py-2 px-2">Confiance moy.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(byAgent).sort((a, b) => b[1].length - a[1].length).map(([slug, items]) => {
                    const c: Record<string, number> = { applied: 0, blocked: 0, forced: 0, ignored: 0 };
                    items.forEach((i) => { c[i.decision] = (c[i.decision] ?? 0) + 1; });
                    const accept = Math.round(((c.applied + c.forced) / items.length) * 100);
                    const ac = avg(items.map((i) => i.confidence ?? 0).filter((x) => x > 0));
                    return (
                      <tr key={slug} className="text-white/80">
                        <td className="py-2 px-2 font-mono text-xs">{slug}</td>
                        <td className="text-right py-2 px-2">{items.length}</td>
                        <td className="text-right py-2 px-2 text-emerald-400">{accept}%</td>
                        <td className="text-right py-2 px-2 text-red-400">{c.blocked}</td>
                        <td className="text-right py-2 px-2 text-orange-400">{c.forced}</td>
                        <td className="text-right py-2 px-2">{ac}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Per user */}
          <Card className="bg-[#111]/80 border-white/5 p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Par utilisateur</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5">
                    <th className="text-left py-2 px-2">Utilisateur (ID)</th>
                    <th className="text-right py-2 px-2">Total</th>
                    <th className="text-right py-2 px-2">Appliquées</th>
                    <th className="text-right py-2 px-2">Forçages</th>
                    <th className="text-right py-2 px-2">Confiance moy.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(byUser).sort((a, b) => b[1].length - a[1].length).slice(0, 20).map(([uid, items]) => {
                    const c: Record<string, number> = { applied: 0, forced: 0 };
                    items.forEach((i) => { c[i.decision] = (c[i.decision] ?? 0) + 1; });
                    const ac = avg(items.map((i) => i.confidence ?? 0).filter((x) => x > 0));
                    return (
                      <tr key={uid} className="text-white/80">
                        <td className="py-2 px-2 font-mono text-[10px] truncate max-w-[260px]">{uid}</td>
                        <td className="text-right py-2 px-2">{items.length}</td>
                        <td className="text-right py-2 px-2 text-emerald-400">{c.applied ?? 0}</td>
                        <td className="text-right py-2 px-2 text-orange-400">{c.forced ?? 0}</td>
                        <td className="text-right py-2 px-2">{ac}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Decision legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(counts).map(([d, n]) => {
              const Icon = DECISION_ICON[d];
              return (
                <Badge key={d} variant="outline" className={DECISION_COLORS[d]}>
                  {Icon && <Icon className="w-3 h-3 mr-1" />}
                  {d}: {n}
                </Badge>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}