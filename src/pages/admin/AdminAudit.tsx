import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  login_success: { label: '🔓 Connexion réussie', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  login_failed: { label: '🚫 Échec de connexion', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  role_granted: { label: '➕ Rôle attribué', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  role_revoked: { label: '➖ Rôle retiré', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
};

export default function AdminAudit() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);
      setItems(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = items.filter((i) => {
    if (actionFilter && i.action !== actionFilter) return false;
    if (q && !JSON.stringify(i).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const actions = Array.from(new Set(items.map((i) => i.action)));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" /> Audit global
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Connexions, changements de rôles et événements sensibles.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrer (email, action, métadonnées)…"
            className="pl-9 bg-white/5 border-white/10 text-white"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-md px-3 py-2"
        >
          <option value="">Toutes les actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a]?.label ?? a}</option>
          ))}
        </select>
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-white/40">Aucun événement</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((it) => {
              const a = ACTION_LABELS[it.action];
              return (
                <li key={it.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={a?.color ?? ''}>
                          {a?.label ?? it.action}
                        </Badge>
                        {it.actor_email && (
                          <span className="text-xs text-white/60">{it.actor_email}</span>
                        )}
                      </div>
                      {it.metadata && Object.keys(it.metadata).length > 0 && (
                        <p className="text-[11px] text-white/40 font-mono break-all">
                          {JSON.stringify(it.metadata)}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-white/40 whitespace-nowrap">
                      {formatDistanceToNow(new Date(it.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}