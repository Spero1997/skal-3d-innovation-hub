import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DEPENDENCY_LABELS } from '@/lib/projects';

type Dep = { id: string; predecessor_id: string; successor_id: string; type: string; lag_days: number };
type TaskMini = { id: string; title: string };

export function TaskDependencies({ taskId, projectId }: { taskId: string; projectId: string }) {
  const [deps, setDeps] = useState<Dep[]>([]);
  const [tasks, setTasks] = useState<TaskMini[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPred, setNewPred] = useState('');
  const [newType, setNewType] = useState('finish_to_start');

  const load = async () => {
    setLoading(true);
    const [{ data: d }, { data: t }] = await Promise.all([
      supabase.from('task_dependencies').select('*').eq('successor_id', taskId),
      supabase.from('tasks').select('id,title').eq('project_id', projectId).neq('id', taskId),
    ]);
    setDeps((d ?? []) as Dep[]);
    setTasks((t ?? []) as TaskMini[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [taskId, projectId]);

  const add = async () => {
    if (!newPred) return;
    const { error } = await supabase.from('task_dependencies').insert({
      predecessor_id: newPred, successor_id: taskId, type: newType as any,
    });
    if (error) return toast.error(error.message);
    setNewPred('');
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('task_dependencies').delete().eq('id', id);
    if (error) return toast.error(error.message);
    load();
  };

  const titleOf = (id: string) => tasks.find((t) => t.id === id)?.title ?? '(tâche inconnue)';

  if (loading) return <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-orange-500" /></div>;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        {deps.map((d) => (
          <div key={d.id} className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-white/5">
            <div className="flex items-center gap-2 text-white/70 min-w-0">
              <Link2 className="w-3 h-3 text-orange-400 shrink-0" />
              <span className="truncate">{titleOf(d.predecessor_id)}</span>
              <span className="text-white/30 shrink-0">· {DEPENDENCY_LABELS[d.type]}</span>
            </div>
            <button onClick={() => remove(d.id)} className="text-white/40 hover:text-red-400 shrink-0">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {deps.length === 0 && <p className="text-xs text-white/30">Aucune dépendance</p>}
      </div>

      <div className="flex gap-2">
        <Select value={newPred} onValueChange={setNewPred}>
          <SelectTrigger className="h-8 text-xs bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Tâche prédécesseur…" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10">
            {tasks.map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={newType} onValueChange={setNewType}>
          <SelectTrigger className="h-8 w-32 text-xs bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-white/10">
            {Object.entries(DEPENDENCY_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={add} className="h-8 bg-orange-500 hover:bg-orange-600 text-white">Lier</Button>
      </div>
    </div>
  );
}