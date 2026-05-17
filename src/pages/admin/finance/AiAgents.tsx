import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Send } from 'lucide-react';
import { SuperAdminGuard } from '@/components/admin/finance/rules/Guard';

const LEVELS = ['public', 'internal', 'restricted', 'secret'];
const MODELS = [
  'google/gemini-3-flash-preview',
  'google/gemini-2.5-flash',
  'google/gemini-2.5-pro',
  'openai/gpt-5-mini',
  'openai/gpt-5',
];

function AgentsTab() {
  const [items, setItems] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from('ai_agents').select('*').order('name');
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const slug = prompt('Slug (unique) :');
    if (!slug) return;
    const { error } = await supabase.from('ai_agents').insert({ slug, name: slug });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    load();
  };

  const update = (i: number, patch: any) =>
    setItems((it) => it.map((a, k) => (k === i ? { ...a, ...patch } : a)));

  const save = async (a: any) => {
    const { error } = await supabase.from('ai_agents').update({
      name: a.name, description: a.description, model: a.model,
      max_level: a.max_level, system_prompt: a.system_prompt, is_active: a.is_active,
    }).eq('id', a.id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: 'Sauvegardé' });
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer cet agent ?')) return;
    await supabase.from('ai_agents').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={add} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-1" /> Nouvel agent
        </Button>
      </div>
      {items.map((a, i) => (
        <Card key={a.id} className="border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <span className="font-mono text-xs text-white/50">{a.slug}</span>
                <Badge variant="outline" className="text-[10px]">{a.max_level}</Badge>
                {a.is_active && <Badge className="bg-green-500/20 text-green-400 border-0">actif</Badge>}
              </CardTitle>
              <div className="flex gap-2">
                <Switch checked={a.is_active} onCheckedChange={(v) => update(i, { is_active: v })} />
                <Button size="sm" variant="outline" onClick={() => save(a)}><Save className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => del(a.id)}><Trash2 className="h-3.5 w-3.5 text-red-400" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <Label className="text-xs text-white/60">Nom</Label>
                <Input value={a.name} onChange={(e) => update(i, { name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-white/60">Modèle</Label>
                <Select value={a.model} onValueChange={(v) => update(i, { model: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-white/60">Niveau max</Label>
                <Select value={a.max_level} onValueChange={(v) => update(i, { max_level: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-white/60">Prompt système</Label>
              <Textarea
                value={a.system_prompt ?? ''}
                onChange={(e) => update(i, { system_prompt: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[100px] text-xs font-mono"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('ai_access_log').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setLogs(data ?? []));
  }, []);
  return (
    <div className="space-y-2">
      {logs.length === 0 && <p className="text-white/50 text-sm">Aucun accès enregistré.</p>}
      {logs.map((l) => (
        <Card key={l.id} className="border-white/10 bg-white/5">
          <CardContent className="p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{l.agent_slug}</Badge>
              <span className="text-white/60">{l.entity}</span>
              <Badge className={l.status === 'ok' ? 'bg-green-500/20 text-green-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                {l.status}
              </Badge>
              <span className="text-white/40">accordé: {l.granted_level}</span>
            </div>
            <span className="text-white/40">{new Date(l.created_at).toLocaleString()}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PlaygroundTab() {
  const [agents, setAgents] = useState<any[]>([]);
  const [slug, setSlug] = useState('skal-assistant');
  const [entity, setEntity] = useState('general');
  const [prompt, setPromptText] = useState('');
  const [reply, setReply] = useState<{ text?: string; level?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('ai_agents').select('slug,name').eq('is_active', true)
      .then(({ data }) => setAgents(data ?? []));
  }, []);

  const send = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setReply(null);
    const { data, error } = await supabase.functions.invoke('ai-query', {
      body: { agent_slug: slug, entity, prompt },
    });
    setLoading(false);
    if (error) return setReply({ error: error.message });
    setReply(data as any);
  };

  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <Select value={slug} onValueChange={setSlug}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Agent" /></SelectTrigger>
            <SelectContent>{agents.map((a) => <SelectItem key={a.slug} value={a.slug}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Entité (ex: finances)" className="bg-white/5 border-white/10 text-white" />
        </div>
        <Textarea value={prompt} onChange={(e) => setPromptText(e.target.value)} placeholder="Question…" className="bg-white/5 border-white/10 text-white min-h-[80px]" />
        <Button onClick={send} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
          <Send className="h-4 w-4 mr-1" /> {loading ? 'Envoi…' : 'Envoyer'}
        </Button>
        {reply && (
          <div className="rounded bg-black/30 p-3 text-sm text-white/80 whitespace-pre-wrap">
            {reply.error ? <span className="text-red-400">{reply.error}</span> : reply.text}
            {reply.level && <p className="mt-2 text-xs text-white/40">Niveau accordé : {reply.level}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Content() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agents IA & sécurité</h1>
        <p className="text-sm text-white/60">Cloisonnement des données par rôle et journal d'accès.</p>
      </div>
      <Tabs defaultValue="agents">
        <TabsList className="bg-white/5">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="playground">Test</TabsTrigger>
          <TabsTrigger value="logs">Journal</TabsTrigger>
        </TabsList>
        <TabsContent value="agents"><AgentsTab /></TabsContent>
        <TabsContent value="playground"><PlaygroundTab /></TabsContent>
        <TabsContent value="logs"><LogsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

export default function AiAgents() {
  return <SuperAdminGuard><Content /></SuperAdminGuard>;
}
