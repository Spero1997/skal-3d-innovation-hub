import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, GripVertical } from 'lucide-react';
import { TASK_STATUSES, TASK_STATUS_LABELS, formatDate } from '@/lib/projects';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Task = {
  id: string; title: string; description: string | null;
  status: string; priority: string; due_date: string | null;
  assignee_id: string | null; position: number;
};

export function TasksKanban({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true });
    setTasks((data ?? []) as Task[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [projectId]);

  const addTask = async (status: string) => {
    const title = (newTitle[status] ?? '').trim();
    if (!title) return;
    const { error } = await supabase.from('tasks').insert({
      project_id: projectId, title, status: status as any,
      created_by: user?.id, assignee_id: user?.id,
      position: tasks.filter((t) => t.status === status).length,
    });
    if (error) { toast.error(error.message); return; }
    setNewTitle({ ...newTitle, [status]: '' });
    load();
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus as any }).eq('id', taskId);
    if (error) { toast.error(error.message); return; }
    load();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {TASK_STATUSES.map((status) => {
        const col = tasks.filter((t) => t.status === status);
        return (
          <Card key={status} className="bg-[#0d0d0d] border-white/5 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {TASK_STATUS_LABELS[status]}
              </h3>
              <span className="text-xs text-white/30">{col.length}</span>
            </div>

            <div className="space-y-2 min-h-[40px]">
              {col.map((t) => (
                <Card
                  key={t.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('taskId', t.id)}
                  className="p-3 bg-[#161616] border-white/5 hover:border-orange-500/30 cursor-grab active:cursor-grabbing transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-3 h-3 text-white/20 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{t.title}</p>
                      {t.due_date && (
                        <p className="text-[10px] text-white/40 mt-1">{formatDate(t.due_date)}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div
              className="mt-3 pt-3 border-t border-white/5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('taskId');
                if (id) moveTask(id, status);
              }}
            >
              <div className="flex gap-1">
                <Input
                  value={newTitle[status] ?? ''}
                  onChange={(e) => setNewTitle({ ...newTitle, [status]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') addTask(status); }}
                  placeholder="Nouvelle tâche…"
                  className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <Button onClick={() => addTask(status)} size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-white/60 hover:text-white hover:bg-white/5">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}