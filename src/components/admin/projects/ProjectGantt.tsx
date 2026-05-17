import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { TASK_STATUS_LABELS } from '@/lib/projects';

type Task = {
  id: string; title: string; status: string;
  start_date: string | null; due_date: string | null;
  parent_task_id: string | null;
};
type Dep = { predecessor_id: string; successor_id: string };

const STATUS_BAR: Record<string, string> = {
  a_faire: 'bg-zinc-500/60',
  en_cours: 'bg-orange-500/80',
  en_revue: 'bg-blue-500/70',
  termine: 'bg-emerald-500/70',
};

export function ProjectGantt({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deps, setDeps] = useState<Dep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: t }, { data: d }] = await Promise.all([
        supabase.from('tasks').select('id,title,status,start_date,due_date,parent_task_id')
          .eq('project_id', projectId).order('start_date', { nullsFirst: false }),
        supabase.from('task_dependencies').select('predecessor_id,successor_id'),
      ]);
      setTasks((t ?? []) as Task[]);
      setDeps((d ?? []) as Dep[]);
      setLoading(false);
    })();
  }, [projectId]);

  const dated = useMemo(() => tasks.filter((t) => t.start_date || t.due_date), [tasks]);

  const range = useMemo(() => {
    if (dated.length === 0) return null;
    const dates = dated.flatMap((t) => [t.start_date, t.due_date].filter(Boolean)) as string[];
    const min = new Date(Math.min(...dates.map((d) => new Date(d).getTime())));
    const max = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));
    min.setDate(min.getDate() - 1);
    max.setDate(max.getDate() + 1);
    const days = Math.max(1, Math.round((max.getTime() - min.getTime()) / 86400000));
    return { min, max, days };
  }, [dated]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>;
  if (!range) {
    return (
      <div className="text-center py-10 text-sm text-white/40">
        Aucune tâche datée. Ajoute des dates de début/échéance pour visualiser le Gantt.
      </div>
    );
  }

  const pct = (d: string) => {
    const t = new Date(d).getTime();
    return ((t - range.min.getTime()) / (range.max.getTime() - range.min.getTime())) * 100;
  };

  // Build month labels
  const months: { label: string; pct: number }[] = [];
  const cursor = new Date(range.min);
  cursor.setDate(1);
  while (cursor <= range.max) {
    months.push({
      label: cursor.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      pct: pct(cursor.toISOString()),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[220px_1fr] text-xs">
        {/* Header */}
        <div className="bg-[#161616] border-b border-white/5 px-3 py-2 text-white/40 uppercase tracking-wider">
          Tâche
        </div>
        <div className="bg-[#161616] border-b border-l border-white/5 relative h-8">
          {months.map((m, i) => (
            <div key={i} className="absolute top-0 h-full border-l border-white/5 pl-1 text-[10px] text-white/40"
              style={{ left: `${m.pct}%` }}>
              {m.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {dated.map((t) => {
          const start = t.start_date ?? t.due_date!;
          const end = t.due_date ?? t.start_date!;
          const left = pct(start);
          const width = Math.max(1, pct(end) - left);
          const isSub = !!t.parent_task_id;
          return (
            <div key={t.id} className="contents">
              <div className={`px-3 py-2 border-b border-white/5 truncate ${isSub ? 'pl-8 text-white/60' : 'text-white/90'}`}>
                {isSub && <span className="mr-1 text-white/30">↳</span>}{t.title}
              </div>
              <div className="border-b border-l border-white/5 relative h-9">
                <div
                  className={`absolute top-1.5 h-6 rounded ${STATUS_BAR[t.status] ?? 'bg-zinc-500/50'} flex items-center px-2`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${TASK_STATUS_LABELS[t.status]} · ${start} → ${end}`}
                >
                  <span className="text-[10px] text-white/90 truncate">{TASK_STATUS_LABELS[t.status]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-3 py-2 text-[10px] text-white/30 border-t border-white/5">
        {dated.length} tâche{dated.length > 1 ? 's' : ''} datée{dated.length > 1 ? 's' : ''} · {deps.length} dépendance{deps.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}