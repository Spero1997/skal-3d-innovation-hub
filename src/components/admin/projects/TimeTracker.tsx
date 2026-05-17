import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Square, Plus, Loader2, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatHours } from '@/lib/projects';

type Entry = {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  description: string | null;
  user_id: string;
};

export function TimeTracker({ taskId, onChange }: { taskId: string; onChange?: () => void }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [running, setRunning] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualMin, setManualMin] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [tick, setTick] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('time_entries')
      .select('*')
      .eq('task_id', taskId)
      .order('started_at', { ascending: false });
    const list = (data ?? []) as Entry[];
    setEntries(list);
    setRunning(list.find((e) => e.ended_at === null && e.user_id === user?.id) ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [taskId]);
  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const start = async () => {
    if (!user) return;
    const { error } = await supabase.from('time_entries').insert({
      task_id: taskId, user_id: user.id, started_at: new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    load(); onChange?.();
  };

  const stop = async () => {
    if (!running) return;
    const ended = new Date();
    const startedAt = new Date(running.started_at);
    const duration = Math.max(1, Math.round((ended.getTime() - startedAt.getTime()) / 60000));
    const { error } = await supabase.from('time_entries')
      .update({ ended_at: ended.toISOString(), duration_minutes: duration })
      .eq('id', running.id);
    if (error) return toast.error(error.message);
    load(); onChange?.();
  };

  const addManual = async () => {
    const min = parseInt(manualMin, 10);
    if (!min || min <= 0 || !user) return;
    const now = new Date();
    const started = new Date(now.getTime() - min * 60000);
    const { error } = await supabase.from('time_entries').insert({
      task_id: taskId, user_id: user.id,
      started_at: started.toISOString(), ended_at: now.toISOString(),
      duration_minutes: min, description: manualDesc || null,
    });
    if (error) return toast.error(error.message);
    setManualMin(''); setManualDesc('');
    load(); onChange?.();
  };

  const totalMin = entries.reduce((s, e) => s + (e.duration_minutes ?? 0), 0);
  const runningSec = running ? Math.floor((Date.now() - new Date(running.started_at).getTime()) / 1000) : 0;

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-orange-500" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Clock className="w-4 h-4 text-orange-400" />
          Total : <span className="text-white font-semibold">{formatHours(totalMin / 60)}</span>
          {running && (
            <span className="ml-3 text-orange-400 font-mono">
              ▶ {Math.floor(runningSec / 3600)}:{String(Math.floor((runningSec % 3600) / 60)).padStart(2, '0')}:{String(runningSec % 60).padStart(2, '0')}
            </span>
          )}
        </div>
        {running ? (
          <Button size="sm" onClick={stop} className="bg-red-500 hover:bg-red-600 text-white">
            <Square className="w-3 h-3 mr-1" /> Stop
          </Button>
        ) : (
          <Button size="sm" onClick={start} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Play className="w-3 h-3 mr-1" /> Démarrer
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Input type="number" min={1} placeholder="Min" value={manualMin}
          onChange={(e) => setManualMin(e.target.value)}
          className="w-20 h-8 text-xs bg-white/5 border-white/10 text-white" />
        <Input placeholder="Description (optionnel)" value={manualDesc}
          onChange={(e) => setManualDesc(e.target.value)}
          className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30" />
        <Button size="sm" variant="outline" onClick={addManual} className="h-8 border-white/10 text-white">
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-1 max-h-40 overflow-auto">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-white/5">
            <span className="text-white/60">
              {new Date(e.started_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              {e.description && <span className="ml-2 text-white/40">— {e.description}</span>}
            </span>
            <span className="text-white/80 font-mono">
              {e.duration_minutes ? formatHours(e.duration_minutes / 60) : '…'}
            </span>
          </div>
        ))}
        {entries.length === 0 && <p className="text-xs text-white/30 text-center py-2">Aucune saisie</p>}
      </div>
    </div>
  );
}