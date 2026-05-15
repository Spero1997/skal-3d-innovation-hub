import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Activity, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

const ACTION_LABELS: Record<string, string> = {
  project_created: '🚀 Projet créé',
  project_status_changed: '🔄 Statut projet modifié',
  task_created: '✅ Tâche créée',
  task_status_changed: '🔁 Statut tâche modifié',
  comment_created: '💬 Commentaire',
};

export default function AdminJournal() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('project_activity')
        .select('*, projects(name), profiles!project_activity_actor_id_fkey(full_name)')
        .order('created_at', { ascending: false }).limit(200);
      // fallback if join missing: separate query
      if (!data || data.length === 0) {
        const { data: raw } = await supabase.from('project_activity').select('*').order('created_at', { ascending: false }).limit(200);
        setItems(raw ?? []);
      } else setItems(data);
      setLoading(false);
    })();
  }, []);

  const filtered = items.filter(i => !q || JSON.stringify(i).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6" /> Journal d'activité
        </h1>
        <p className="text-sm text-white/40 mt-1">Audit trail complet</p>
      </div>

      <div className="relative max-w-md">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filtrer…" className="pl-9 bg-white/5 border-white/10 text-white" />
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {loading ? <div className="p-12 text-center text-white/40">Chargement…</div>
        : filtered.length === 0 ? <div className="p-12 text-center text-white/40">Aucune activité</div>
        : (
          <ul className="divide-y divide-white/5">
            {filtered.map(it => (
              <li key={it.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-white">{ACTION_LABELS[it.action] ?? it.action}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      {it.projects?.name ?? '—'}
                      {it.metadata && Object.keys(it.metadata).length > 0 && (
                        <span className="ml-2 font-mono text-white/30">{JSON.stringify(it.metadata).slice(0, 80)}</span>
                      )}
                    </p>
                  </div>
                  <span className="text-[11px] text-white/40 whitespace-nowrap">
                    {formatDistanceToNow(new Date(it.created_at), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
