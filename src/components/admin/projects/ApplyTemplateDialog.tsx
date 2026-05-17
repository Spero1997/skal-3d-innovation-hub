import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Layers, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { DOMAIN_LABELS } from '@/lib/projects';

type Template = { id: string; name: string; description: string | null; domain: string; tasks_structure: any };

export function ApplyTemplateDialog({
  projectId, open, onOpenChange,
}: { projectId: string; open: boolean; onOpenChange: (b: boolean) => void }) {
  const [list, setList] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('project_templates')
        .select('id,name,description,domain,tasks_structure')
        .eq('is_active', true).order('name');
      setList((data ?? []) as Template[]);
      setLoading(false);
    })();
  }, [open]);

  const apply = async (id: string) => {
    setApplying(id);
    const { data, error } = await supabase.rpc('instantiate_project_template', {
      _template_id: id, _project_id: projectId,
    });
    setApplying(null);
    if (error) return toast.error(error.message);
    toast.success(`${data ?? 0} tâche(s) créée(s)`);
    onOpenChange(false);
    // soft refresh of parent screen
    window.dispatchEvent(new Event('tasks:refresh'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0d0d0d] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Layers className="w-5 h-5 text-orange-500" /> Appliquer un modèle</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>
        ) : list.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-6">
            Aucun modèle disponible. Crée-en un depuis « Modèles de projets ».
          </p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {list.map((t) => {
              const arr: any[] = Array.isArray(t.tasks_structure) ? t.tasks_structure : [];
              const total = arr.reduce((s, x) => s + 1 + ((x.subtasks?.length) ?? 0), 0);
              return (
                <div key={t.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{t.name}</span>
                      <span className="text-[10px] text-white/40 uppercase">{DOMAIN_LABELS[t.domain]}</span>
                    </div>
                    {t.description && <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{t.description}</p>}
                    <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
                      <ListChecks className="w-3 h-3" /> {total} tâche{total > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button size="sm" disabled={applying === t.id} onClick={() => apply(t.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white">
                    {applying === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Appliquer'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}