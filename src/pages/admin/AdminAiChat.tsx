import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Bot, Plus, Send, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Agent = { slug: string; name: string; description: string | null; max_level: string };
type Conv = { id: string; title: string; agent_slug: string; updated_at: string };
type Msg = { id?: string; role: 'user' | 'assistant' | 'system'; content: string; granted_level?: string | null };

export default function AdminAiChat() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [agentSlug, setAgentSlug] = useState<string>('skal-assistant');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConvs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('ai_conversations')
      .select('id, title, agent_slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50);
    setConvs(data ?? []);
  };

  useEffect(() => {
    supabase.from('ai_agents').select('slug, name, description, max_level')
      .eq('is_active', true).order('name')
      .then(({ data }) => setAgents(data ?? []));
    loadConvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    supabase.from('ai_messages').select('id, role, content, granted_level')
      .eq('conversation_id', activeId).order('created_at', { ascending: true })
      .then(({ data }) => setMessages((data ?? []) as Msg[]));
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const newConv = () => { setActiveId(null); setMessages([]); setDraft(''); };

  const send = async () => {
    if (!draft.trim() || sending) return;
    const prompt = draft.trim();
    setDraft('');
    setMessages((m) => [...m, { role: 'user', content: prompt }]);
    setSending(true);
    const { data, error } = await supabase.functions.invoke('ai-agent-chat', {
      body: { conversation_id: activeId, agent_slug: activeId ? undefined : agentSlug, prompt },
    });
    setSending(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? 'Erreur');
      return;
    }
    const d = data as any;
    if (!activeId) setActiveId(d.conversation_id);
    setMessages((m) => [...m, { role: 'assistant', content: d.text, granted_level: d.level }]);
    loadConvs();
  };

  const delConv = async (id: string) => {
    if (!confirm('Supprimer cette conversation ?')) return;
    await supabase.from('ai_conversations').delete().eq('id', id);
    if (activeId === id) newConv();
    loadConvs();
  };

  const currentAgent = agents.find(a => a.slug === agentSlug);

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 p-4">
      {/* Sidebar conversations */}
      <Card className="bg-[#111]/80 border-white/5 p-3 flex flex-col overflow-hidden">
        <Button onClick={newConv} className="bg-orange-500 hover:bg-orange-600 mb-3">
          <Plus className="w-4 h-4 mr-1" /> Nouvelle conversation
        </Button>
        <div className="overflow-y-auto space-y-1 flex-1">
          {convs.length === 0 && <p className="text-xs text-white/40 px-2">Aucune conversation.</p>}
          {convs.map(c => (
            <div key={c.id}
              className={`group flex items-center gap-1 rounded px-2 py-1.5 text-sm cursor-pointer ${
                activeId === c.id ? 'bg-orange-500/15 text-white' : 'text-white/70 hover:bg-white/5'
              }`}
              onClick={() => setActiveId(c.id)}
            >
              <Bot className="w-3.5 h-3.5 shrink-0 text-orange-400" />
              <span className="truncate flex-1">{c.title}</span>
              <button onClick={(e) => { e.stopPropagation(); delConv(c.id); }}
                className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat zone */}
      <Card className="bg-[#111]/80 border-white/5 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
          {activeId ? (
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {convs.find(c => c.id === activeId)?.title ?? 'Conversation'}
              </p>
              <p className="text-xs text-white/40">Agent : {convs.find(c => c.id === activeId)?.agent_slug}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-3">
              <Bot className="w-5 h-5 text-orange-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Nouvelle conversation</p>
                <p className="text-xs text-white/40">{currentAgent?.description ?? 'Choisissez un agent.'}</p>
              </div>
              <Select value={agentSlug} onValueChange={setAgentSlug}>
                <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agents.map(a => (
                    <SelectItem key={a.slug} value={a.slug}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !sending && (
            <div className="text-center text-white/40 mt-12">
              <Bot className="w-10 h-10 mx-auto mb-3 text-orange-400/40" />
              <p className="text-sm">Posez votre question pour commencer.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-white/90 border border-white/5'
              }`}>
                {m.content}
                {m.granted_level && (
                  <div className="mt-1.5 text-[10px] uppercase tracking-wider opacity-50">
                    Niveau : {m.granted_level}
                  </div>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/5 rounded-lg px-4 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-white/5 p-3">
          <div className="flex gap-2 items-end">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Votre message… (Entrée pour envoyer, Maj+Entrée pour saut de ligne)"
              className="bg-white/5 border-white/10 text-white resize-none min-h-[44px] max-h-[160px]"
              rows={1}
            />
            <Button onClick={send} disabled={sending || !draft.trim()}
              className="bg-orange-500 hover:bg-orange-600 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}