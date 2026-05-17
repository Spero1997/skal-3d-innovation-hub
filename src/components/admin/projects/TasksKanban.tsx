import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, GripVertical, Clock, ChevronRight, ListTree } from 'lucide-react';
import { TASK_STATUSES, TASK_STATUS_LABELS, formatDate, formatHours } from '@/lib/projects';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { TaskDetailDrawer } from './TaskDetailDrawer';

type Task = {
  id: string; title: string; description: string | null;
  status: string; priority: string; due_date: string | null;
  assignee_id: string | null; position: number;
  parent_task_id: string | null;
  estimated_hours: number | null; actual_hours: number;
};

export function TasksKanban({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState<Record<string, string>>({});
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

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

  const subsOf = (parentId: string) => tasks.filter((t) => t.parent_task_id === parentId);

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {TASK_STATUSES.map((status) => {
        const col = tasks.filter((t) => t.status === status && !t.parent_task_id);
        return (
          <Card key={status} className="bg-[#0d0d0d] border-white/5 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {TASK_STATUS_LABELS[status]}
              </h3>
              <span className="text-xs text-white/30">{col.length}</span>
            </div>

            <div className="space-y-2 min-h-[40px]">
              {col.map((t) => {
                const subs = subsOf(t.id);
                return (
                  <Card
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('taskId', t.id)}
                    onClick={() => setOpenTaskId(t.id)}
                    className="p-3 bg-[#161616] border-white/5 hover:border-orange-500/30 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-3 h-3 text-white/20 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40 flex-wrap">
                          {t.due_date && <span>{formatDate(t.due_date)}</span>}
                          {(t.actual_hours > 0 || (t.estimated_hours ?? 0) > 0) && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {formatHours(t.actual_hours)}{t.estimated_hours ? ` / ${formatHours(t.estimated_hours)}` : ''}
                            </span>
                          )}
                          {subs.length > 0 && (
                            <span className="flex items-center gap-0.5">
                              <ListTree className="w-2.5 h-2.5" />{subs.length}
                            </span>
                          )}
                        </div>
                        {subs.length > 0 && (
                          <div className="mt-2 pl-2 border-l border-white/10 space-y-0.5">
                            {subs.slice(0, 3).map((s) => (
                              <div key={s.id} className="flex items-center gap-1 text-[11px] text-white/60 truncate">
                                <ChevronRight className="w-2.5 h-2.5 text-white/30 shrink-0" />
                                <span className={`truncate ${s.status === 'termine' ? 'line-through text-white/30' : ''}`}>{s.title}</span>
                              </div>
                            ))}
                            {subs.length > 3 && <p className="text-[10px] text-white/30">+{subs.length - 3} autre{subs.length - 3 > 1 ? 's' : ''}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
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
    <TaskDetailDrawer
      taskId={openTaskId}
      projectId={projectId}
      open={openTaskId !== null}
      onOpenChange={(b) => !b && setOpenTaskId(null)}
      onChanged={load}
    />
    </>
  );
}