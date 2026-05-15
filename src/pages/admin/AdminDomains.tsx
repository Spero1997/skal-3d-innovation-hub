import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2, FolderKanban, ArrowRight } from 'lucide-react';
import { DOMAIN_LABELS, DOMAIN_COLORS, formatXOF } from '@/lib/projects';

type Row = { domain: string; count: number; budget: number; collected: number; active: number };

export default function AdminDomains() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('projects').select('domain,budget,amount_collected,status');
      const map = new Map<string, Row>();
      Object.keys(DOMAIN_LABELS).forEach((d) =>
        map.set(d, { domain: d, count: 0, budget: 0, collected: 0, active: 0 }),
      );
      (data ?? []).forEach((p: any) => {
        const r = map.get(p.domain) ?? { domain: p.domain, count: 0, budget: 0, collected: 0, active: 0 };
        r.count += 1;
        r.budget += Number(p.budget ?? 0);
        r.collected += Number(p.amount_collected ?? 0);
        if (p.status === 'en_cours') r.active += 1;
        map.set(p.domain, r);
      });
      setRows(Array.from(map.values()));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Domaines d'activité</h1>
        <p className="text-sm text-white/50 mt-1">Vue agrégée par discipline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((r) => (
          <Link key={r.domain} to={`/admin/projets`} className="block">
            <Card className="p-6 bg-[#111]/80 border-white/5 hover:border-orange-500/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${DOMAIN_COLORS[r.domain]} flex items-center justify-center shadow-lg`}>
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white">{DOMAIN_LABELS[r.domain]}</h3>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Total</p>
                  <p className="text-xl font-bold text-white mt-0.5">{r.count}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Actifs</p>
                  <p className="text-xl font-bold text-orange-400 mt-0.5">{r.active}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Encaissé</p>
                  <p className="text-sm font-semibold text-emerald-400 mt-1.5">{formatXOF(r.collected)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}