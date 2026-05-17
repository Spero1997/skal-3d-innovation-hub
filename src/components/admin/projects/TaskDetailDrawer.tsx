import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, ChevronRight } from 'lucide-react';
import { TimeTracker } from './TimeTracker';
import { TaskDependencies } from './TaskDependencies';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { formatHours } from '@/lib/projects';

type Task = {
  id: string; title: string; description: string | null;
  start_date: string | null; due_date: string | null;
  estimated_hours: number | null; actual_hours: number;
  parent_task_id: string | null;
};

export function TaskDetailDrawer({
  taskId, projectId, open, onOpenChange, onChanged,
}: {
  taskId: string | null; projectId: string;
  open: boolean; onOpenChange: (b: boolean) => void;
  onChanged?: () => void;
}) {
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [subs, setSubs] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSub, setNewSub] = useState('');

  const load = async () => {
    if (!taskId) return;
    setLoading(true);
    const [{ data: t }, { data: s }] = await Promise.all([
      supabase.from('tasks').select('*').eq('id', taskId).maybeSingle(),
      supabase.from('tasks').select('*').eq('parent_task_id', taskId).order('position'),
    ]);
    setTask(t as Task | null);
    setSubs((s ?? []) as Task[]);
    setLoading(false);
  };

  useEffect(() => { if (open && taskId) load(); }, [open, taskId]);

  const save = async (patch: Partial<Task>) => {
    if (!task) return;
    const { error } = await supabase.from('tasks').update(patch).eq('id', task.id);
    if (error) return toast.error(error.message);
    setTask({ ...task, ...patch });
    onChanged?.();
  };

  const addSub = async () => {
    if (!task || !newSub.trim()) return;
    const { error } = await supabase.from('tasks').insert({
      project_id: projectId, parent_task_id: task.id,
      title: newSub.trim(), created_by: user?.id, assignee_id: user?.id,
      position: subs.length,
    });
    if (error) return toast.error(error.message);
    setNewSub('');
    load();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#0a0a0a] border-l border-white/10 text-white w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Détail de la tâche</SheetTitle>
        </SheetHeader>
        {loading || !task ? (
          <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>
        ) : (
          <div className="space-y-5 mt-5">
            <div>
              <Label className="text-xs text-white/50">Titre</Label>
              <Input defaultValue={task.title} onBlur={(e) => save({ title: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
            <div>
              <Label className="text-xs text-white/50">Description</Label>
              <Textarea defaultValue={task.description ?? ''} onBlur={(e) => save({ description: e.target.value })}
                rows={3} className="bg-white/5 border-white/10 text-white mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-white/50">Début</Label>
                <Input type="date" defaultValue={task.start_date ?? ''} onBlur={(e) => save({ start_date: e.target.value || null })}
                  className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label className="text-xs text-white/50">Échéance</Label>
                <Input type="date" defaultValue={task.due_date ?? ''} onBlur={(e) => save({ due_date: e.target.value || null })}
                  className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-white/50">Estimé (h)</Label>
                <Input type="number" step="0.25" min={0}
                  defaultValue={task.estimated_hours ?? 0}
                  onBlur={(e) => save({ estimated_hours: parseFloat(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label className="text-xs text-white/50">Réalisé</Label>
                <div className="mt-1 h-9 px-3 flex items-center text-sm text-orange-400 bg-white/5 border border-white/10 rounded-md">
                  {formatHours(task.actual_hours)}
                </div>
              </div>
            </div>

            <Tabs defaultValue="time">
              <TabsList className="bg-[#111] border border-white/5">
                <TabsTrigger value="time" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">Temps</TabsTrigger>
                <TabsTrigger value="subs" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">Sous-tâches ({subs.length})</TabsTrigger>
                <TabsTrigger value="deps" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">Dépendances</TabsTrigger>
              </TabsList>
              <TabsContent value="time" className="mt-4">
                <TimeTracker taskId={task.id} onChange={load} />
              </TabsContent>
              <TabsContent value="subs" className="mt-4 space-y-3">
                <div className="space-y-1">
                  {subs.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded bg-white/5">
                      <ChevronRight className="w-3 h-3 text-white/30" />
                      <span className="flex-1 text-white/80 truncate">{s.title}</span>
                      <span className="text-xs text-white/40">{formatHours(s.actual_hours)}</span>
                    </div>
                  ))}
                  {subs.length === 0 && <p className="text-xs text-white/30">Aucune sous-tâche</p>}
                </div>
                <div className="flex gap-2">
                  <Input value={newSub} onChange={(e) => setNewSub(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addSub(); }}
                    placeholder="Titre de la sous-tâche…"
                    className="h-8 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  <Button size="sm" onClick={addSub} className="h-8 bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="deps" className="mt-4">
                <TaskDependencies taskId={task.id} projectId={projectId} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}