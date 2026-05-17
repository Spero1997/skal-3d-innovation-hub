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
import { Sparkles, ArrowRight, ShieldAlert, Check, Zap } from 'lucide-react';

type Client = { id: string; name: string };

type Suggestion = {
  suggested_domain: string;
  project_type?: string;
  involvement_level?: string;
  confidence: number;
  rationale?: string;
};

const DEFAULT_THRESHOLD = 70;
const AGENT_DOMAIN = 'classify-project';
const AGENT_TYPE = 'classify-project-type';
const AGENT_INVOLVE = 'classify-involvement-level';

type FieldKey = 'domain' | 'project_type' | 'involvement_level';
const FIELD_AGENT: Record<FieldKey, string> = {
  domain: AGENT_DOMAIN,
  project_type: AGENT_TYPE,
  involvement_level: AGENT_INVOLVE,
};
const FIELD_LABEL: Record<FieldKey, string> = {
  domain: 'Domaine',
  project_type: 'Type de projet',
  involvement_level: 'Niveau d\'implication',
};

export function NewProjectDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const { user, roles } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [thresholds, setThresholds] = useState<Record<string, { min: number; force: boolean }>>({});
  const [appliedFields, setAppliedFields] = useState<Set<FieldKey>>(new Set());
  const [form, setForm] = useState({
    code: '', name: '', description: '',
    domain: 'autre', project_type: '', involvement_level: '',
    status: 'prospect', priority: 'normale',
    client_id: 'none', budget: '', start_date: '', due_date: '',
  });

  useEffect(() => {
    if (!open) return;
    supabase.from('clients').select('id,name').order('name').then(({ data }) => {
      setClients((data ?? []) as Client[]);
    });
  }, [open]);

  // Load per-role thresholds for ALL agents (most permissive role wins per agent)
  useEffect(() => {
    if (!open || roles.length === 0) return;
    (async () => {
      const { data } = await supabase
        .from('ai_role_thresholds')
        .select('role, agent_slug, min_confidence, allow_force')
        .in('role', roles as any);
      const acc: Record<string, { min: number; force: boolean }> = {};
      (data ?? []).forEach((r: any) => {
        const cur = acc[r.agent_slug];
        acc[r.agent_slug] = cur
          ? { min: Math.min(cur.min, r.min_confidence), force: cur.force || r.allow_force }
          : { min: r.min_confidence, force: r.allow_force };
      });
      setThresholds(acc);
    })();
  }, [open, roles]);

  const getTh = (agent: string) =>
    thresholds[agent] ?? { min: DEFAULT_THRESHOLD, force: false };

  const logDecision = async (
    decision: 'applied' | 'blocked' | 'forced' | 'ignored',
    field: FieldKey,
    valueBefore: string,
    valueAfter: string,
    confidence: number,
  ) => {
    if (!user) return;
    const agent = FIELD_AGENT[field];
    await supabase.from('ai_suggestion_audit').insert({
      user_id: user.id,
      agent_slug: agent,
      entity: 'projects',
      field,
      value_before: valueBefore || null,
      value_after: valueAfter || null,
      confidence,
      threshold: getTh(agent).min,
      decision,
      context: { project_name: form.name || null, roles },
    });
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error('Le nom du projet est requis');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('projects').insert({
      code: form.code.trim() || null,
      name: form.name.trim(),
      description: [
        form.description.trim(),
        form.project_type && `[Type: ${form.project_type}]`,
        form.involvement_level && `[Implication: ${form.involvement_level}]`,
      ].filter(Boolean).join('\n') || null,
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
      domain: 'autre', project_type: '', involvement_level: '',
      status: 'prospect', priority: 'normale',
      client_id: 'none', budget: '', start_date: '', due_date: '',
    });
    setAppliedFields(new Set());
  };

  const classify = async () => {
    if (!form.description.trim()) {
      toast.error('Ajoute une description pour la classification IA');
      return;
    }
    setClassifying(true);
    setSuggestion(null);
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
    if (!d?.suggested_domain || !(d.suggested_domain in (DOMAIN_LABELS as any))) {
      return toast.error('Suggestion IA invalide');
    }
    setSuggestion({
      suggested_domain: d.suggested_domain,
      project_type: d.project_type,
      involvement_level: d.involvement_level,
      confidence: Math.round((d.confidence ?? 0) * 100),
      rationale: d.rationale,
    });
  };

  const applyField = async (field: FieldKey, force = false) => {
    if (!suggestion) return;
    const valueAfter =
      field === 'domain' ? suggestion.suggested_domain
      : field === 'project_type' ? (suggestion.project_type ?? '')
      : (suggestion.involvement_level ?? '');
    if (!valueAfter) return;
    const agent = FIELD_AGENT[field];
    const th = getTh(agent);
    const ok = suggestion.confidence >= th.min;
    const valueBefore = (form as any)[field] ?? '';
    if (!ok && !force) {
      await logDecision('blocked', field, valueBefore, valueAfter, suggestion.confidence);
      toast.error(`Bloqué : ${FIELD_LABEL[field]} ${suggestion.confidence}% < seuil ${th.min}%`);
      return;
    }
    if (!ok && force && !th.force) {
      toast.error(`Vous n'avez pas le droit de forcer ${FIELD_LABEL[field]}`);
      return;
    }
    setForm((f) => ({ ...f, [field]: valueAfter }));
    setAppliedFields((s) => new Set(s).add(field));
    await logDecision(force && !ok ? 'forced' : 'applied', field, valueBefore, valueAfter, suggestion.confidence);
    toast.success(`${FIELD_LABEL[field]} ${force && !ok ? 'forcé' : 'appliqué'}`);
  };

  const ignoreAll = async () => {
    if (!suggestion) return;
    for (const field of ['domain', 'project_type', 'involvement_level'] as FieldKey[]) {
      if (appliedFields.has(field)) continue;
      const valueAfter =
        field === 'domain' ? suggestion.suggested_domain
        : field === 'project_type' ? (suggestion.project_type ?? '')
        : (suggestion.involvement_level ?? '');
      if (!valueAfter) continue;
      await logDecision('ignored', field, (form as any)[field] ?? '', valueAfter, suggestion.confidence);
    }
    setSuggestion(null);
    setAppliedFields(new Set());
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
            </div>

            {suggestion && (
              <div className="mt-2 rounded-md border border-white/10 bg-white/[0.02] p-3 space-y-3">
                {(['domain', 'project_type', 'involvement_level'] as FieldKey[]).map((field) => {
                  const valueAfter =
                    field === 'domain' ? suggestion.suggested_domain
                    : field === 'project_type' ? (suggestion.project_type ?? '')
                    : (suggestion.involvement_level ?? '');
                  if (!valueAfter) return null;
                  const agent = FIELD_AGENT[field];
                  const th = getTh(agent);
                  const ok = suggestion.confidence >= th.min;
                  const valueBefore = (form as any)[field] ?? '';
                  const labelBefore = field === 'domain'
                    ? ((DOMAIN_LABELS as any)[valueBefore] ?? valueBefore ?? '—')
                    : (valueBefore || '—');
                  const labelAfter = field === 'domain'
                    ? ((DOMAIN_LABELS as any)[valueAfter] ?? valueAfter)
                    : valueAfter;
                  const same = String(valueBefore) === String(valueAfter);
                  const applied = appliedFields.has(field);
                  return (
                    <div key={field} className={`rounded p-2.5 border ${applied ? 'border-emerald-500/40 bg-emerald-500/5' : ok ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-orange-500/30 bg-orange-500/5'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/50">{FIELD_LABEL[field]}</span>
                        <span className={`text-[10px] ${ok ? 'text-emerald-300' : 'text-orange-300'}`}>
                          {suggestion.confidence}% {ok ? '≥' : '<'} {th.min}%
                        </span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <div className="rounded bg-white/5 border border-white/10 p-1.5">
                          <p className="text-sm text-white truncate">{labelBefore}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                        <div className={`rounded p-1.5 border ${ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                          <p className="text-sm text-white truncate">{labelAfter}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Button
                          type="button" size="sm"
                          onClick={() => applyField(field, false)}
                          disabled={!ok || same || applied}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 h-7 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {applied ? 'Appliqué' : same ? 'Identique' : 'Appliquer'}
                        </Button>
                        {!ok && !same && !applied && th.force && (
                          <Button
                            type="button" size="sm"
                            onClick={() => applyField(field, true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white h-7 text-xs"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Forcer
                          </Button>
                        )}
                        {!ok && !th.force && !applied && (
                          <span className="text-[10px] text-orange-300 ml-1 inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            Blocage : confiance insuffisante
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {suggestion.rationale && (
                  <p className="text-[10px] text-white/50 leading-relaxed pt-1 border-t border-white/5">
                    {suggestion.rationale}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button" size="sm" variant="ghost"
                    onClick={ignoreAll}
                    className="text-white/60 hover:text-white hover:bg-white/5 h-7 text-xs"
                  >
                    Fermer (ignorer le reste)
                  </Button>
                </div>
              </div>
            )}
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