import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { DOMAIN_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '@/lib/projects';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

type Client = { id: string; name: string };

export function NewProjectDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', name: '', description: '',
    domain: 'autre', status: 'prospect', priority: 'normale',
    client_id: 'none', budget: '', start_date: '', due_date: '',
  });

  useEffect(() => {
    if (!open) return;
    supabase.from('clients').select('id,name').order('name').then(({ data }) => {
      setClients((data ?? []) as Client[]);
    });
  }, [open]);

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error('Le nom du projet est requis');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('projects').insert({
      code: form.code.trim() || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      domain: form.domain as any,
      status: form.status as any,
      priority: form.priority as any,
      client_id: form.client_id === 'none' ? null : form.client_id,
      manager_id: user?.id,
      budget: form.budget ? Number(form.budget) : 0,
      start_date: form.start_date || null,
      due_date: form.due_date || null,
      created_by: user?.id,
    });
    setSaving(false);
    if (error) {
      toast.error('Erreur', { description: error.message });
      return;
    }
    toast.success('Projet créé');
    onOpenChange(false);
    onCreated();
    setForm({
      code: '', name: '', description: '',
      domain: 'autre', status: 'prospect', priority: 'normale',
      client_id: 'none', budget: '', start_date: '', due_date: '',
    });
  };

  const classify = async () => {
    if (!form.description.trim()) {
      toast.error('Ajoute une description pour la classification IA');
      return;
    }
    setClassifying(true);
    setAiHint(null);
    const { data, error } = await supabase.functions.invoke('ai-classify-project', {
      body: {
        name: form.name, description: form.description,
        budget: form.budget,
        client: clients.find((c) => c.id === form.client_id)?.name,
      },
    });
    setClassifying(false);
    if (error) return toast.error('Erreur IA', { description: error.message });
    const d = data as any;
    if (d?.suggested_domain && d.suggested_domain in (DOMAIN_LABELS as any)) {
      setForm((f) => ({ ...f, domain: d.suggested_domain }));
    }
    setAiHint(
      `Type: ${d?.project_type} · Implication: ${d?.involvement_level} · Confiance: ${Math.round((d?.confidence ?? 0) * 100)}% — ${d?.rationale ?? ''}`
    );
    toast.success('Suggestion IA appliquée');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau projet</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs text-white/60">Code</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="ARCH-001"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-white/60">Client</Label>
            <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white max-h-60">
                <SelectItem value="none">Aucun</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs text-white/60">Nom du projet *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs text-white/60">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="bg-white/5 border-white/10 text-white"
            />
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button" size="sm" variant="outline"
                onClick={classify} disabled={classifying}
                className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                {classifying ? 'Analyse…' : 'Suggestion IA'}
              </Button>
              {aiHint && <p className="text-[10px] text-white/50 ml-2">{aiHint}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-white/60">Domaine</Label>
            <Select value={form.domain} onValueChange={(v) => setForm({ ...form, domain: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                {Object.entries(DOMAIN_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-white/60">Statut</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-white/60">Priorité</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-white/60">Budget (XOF)</Label>
            <Input
              type="number" value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-white/60">Date début</Label>
            <Input
              type="date" value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-white/60">Échéance</Label>
            <Input
              type="date" value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-white hover:bg-white/5">
            Annuler
          </Button>
          <Button onClick={submit} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
            {saving ? 'Création…' : 'Créer le projet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}