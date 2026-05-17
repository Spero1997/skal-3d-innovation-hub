import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, ListChecks, Layers } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { DOMAIN_LABELS } from '@/lib/projects';

type Template = {
  id: string; name: string; description: string | null;
  domain: string; tasks_structure: any; is_active: boolean;
  created_at: string;
};

export default function AdminTemplates() {
  const { user } = useAuth();
  const [list, setList] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('autre');
  const [structureText, setStructureText] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('project_templates')
      .select('*').order('created_at', { ascending: false });
    setList((data ?? []) as Template[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const parseStructure = (txt: string): any[] => {
    // Each line = task. Indent (2 spaces or tab) = subtask.
    const lines = txt.split('\n').filter((l) => l.trim());
    const out: any[] = [];
    for (const raw of lines) {
      const indent = raw.match(/^(\s+)/)?.[1].length ?? 0;
      const title = raw.trim().replace(/^[-•]\s*/, '');
      if (!title) continue;
      if (indent === 0 || out.length === 0) {
        out.push({ title, subtasks: [] });
      } else {
        out[out.length - 1].subtasks.push({ title });
      }
    }
    return out;
  };

  const save = async () => {
    if (!name.trim()) return toast.error('Nom requis');
    const structure = parseStructure(structureText);
    if (structure.length === 0) return toast.error('Ajoute au moins une tâche');
    const { error } = await supabase.from('project_templates').insert({
      name: name.trim(), description: description || null,
      domain: domain as any, tasks_structure: structure,
      created_by: user?.id,
    });
    if (error) return toast.error(error.message);
    toast.success('Modèle créé');
    setOpen(false);
    setName(''); setDescription(''); setStructureText(''); setDomain('autre');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce modèle ?')) return;
    const { error } = await supabase.from('project_templates').delete().eq('id', id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-orange-500" /> Modèles de projets
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Structures de tâches réutilisables pour démarrer un projet en un clic.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-1" /> Nouveau modèle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d0d0d] border-white/10 text-white max-w-2xl">
            <DialogHeader><DialogTitle>Nouveau modèle</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-white/50">Nom</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label className="text-xs text-white/50">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={2} className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label className="text-xs text-white/50">Domaine</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {Object.entries(DOMAIN_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-white/50">
                  Structure des tâches — une ligne = une tâche, indentée = sous-tâche
                </Label>
                <Textarea value={structureText} onChange={(e) => setStructureText(e.target.value)}
                  rows={10}
                  placeholder={`Cadrage\n  Brief client\n  Périmètre\nConception\n  Wireframes\n  Maquettes\nLivraison`}
                  className="bg-white/5 border-white/10 text-white mt-1 font-mono text-sm" />
              </div>
              <Button onClick={save} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Créer le modèle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>
      ) : list.length === 0 ? (
        <Card className="p-10 text-center bg-[#0d0d0d] border-white/5">
          <Layers className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/40">Aucun modèle. Crée le premier.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((t) => {
            const arr: any[] = Array.isArray(t.tasks_structure) ? t.tasks_structure : [];
            const total = arr.reduce((s, x) => s + 1 + ((x.subtasks?.length) ?? 0), 0);
            return (
              <Card key={t.id} className="p-5 bg-[#0d0d0d] border-white/5 hover:border-orange-500/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate">{t.name}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{DOMAIN_LABELS[t.domain]}</p>
                  </div>
                  <button onClick={() => remove(t.id)} className="text-white/30 hover:text-red-400 shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {t.description && <p className="text-xs text-white/50 mt-2 line-clamp-2">{t.description}</p>}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-white/60">
                  <ListChecks className="w-3 h-3 text-orange-400" />
                  {total} tâche{total > 1 ? 's' : ''}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}