import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Filter, AlertCircle, CheckCircle2, Clock, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

type LogRow = {
  id: string;
  user_id: string | null;
  agent_slug: string | null;
  entity: string | null;
  requested_level: string | null;
  granted_level: string | null;
  status: string;
  error: string | null;
  duration_ms: number | null;
  created_at: string;
};

const AGENT_LABELS: Record<string, string> = {
  'classify-project': '🧭 Classification projet',
  'financial-report': '📊 Rapport financier',
  'skal-assistant': '💬 Assistant',
};

export default function AiHistory() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [agent, setAgent] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const allowed = hasRole(['super_admin', 'associe', 'comptable']);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      // RLS gives super_admin all rows + everyone their own rows
      const { data } = await supabase
        .from('ai_access_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);
      setRows((data as any) ?? []);
      setLoading(false);
    })();
  }, [authLoading, user]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (agent !== 'all' && r.agent_slug !== agent) return false;
      if (status !== 'all' && r.status !== status) return false;
      if (q && !JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rows, agent, status, q]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const errors = rows.filter((r) => r.status !== 'ok').length;
    const durations = rows.map((r) => r.duration_ms).filter((d): d is number => typeof d === 'number');
    const avg = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    return { total, errors, avg, rate: total ? Math.round((100 * (total - errors)) / total) : 100 };
  }, [rows]);

  if (!authLoading && !allowed) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="bg-[#111]/80 border-white/5 p-8 text-center">
          <Lock className="w-10 h-10 mx-auto text-orange-400 mb-3" />
          <h2 className="text-lg font-semibold text-white">Accès restreint</h2>
          <p className="text-sm text-white/50 mt-1">Cette page est réservée à la direction.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6" /> Historique des exécutions IA
        </h1>
        <p className="text-sm text-white/40 mt-1">Classifications, rapports & requêtes — statut, durée, erreurs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[#111]/80 border-white/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Total</p>
          <p className="text-2xl font-semibold text-white mt-1">{kpis.total}</p>
        </Card>
        <Card className="bg-[#111]/80 border-white/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Succès</p>
          <p className="text-2xl font-semibold text-emerald-400 mt-1">{kpis.rate}%</p>
        </Card>
        <Card className="bg-[#111]/80 border-white/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Erreurs</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{kpis.errors}</p>
        </Card>
        <Card className="bg-[#111]/80 border-white/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Durée moy.</p>
          <p className="text-2xl font-semibold text-white mt-1">{kpis.avg} ms</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer…" className="pl-9 bg-white/5 border-white/10 text-white" />
        </div>
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white"><SelectValue placeholder="Agent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les agents</SelectItem>
            <SelectItem value="classify-project">Classification projet</SelectItem>
            <SelectItem value="financial-report">Rapport financier</SelectItem>
            <SelectItem value="skal-assistant">Assistant</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="ok">Succès</SelectItem>
            <SelectItem value="error">Erreur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-white/40">Aucune exécution enregistrée</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-white/50">Quand</TableHead>
                <TableHead className="text-white/50">Agent</TableHead>
                <TableHead className="text-white/50">Entité</TableHead>
                <TableHead className="text-white/50">Niveau</TableHead>
                <TableHead className="text-white/50">Statut</TableHead>
                <TableHead className="text-white/50">Durée</TableHead>
                <TableHead className="text-white/50">Détail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="border-white/5">
                  <TableCell className="text-white/70 text-xs">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: fr })}
                  </TableCell>
                  <TableCell className="text-white/90 text-sm">
                    {AGENT_LABELS[r.agent_slug ?? ''] ?? r.agent_slug ?? '—'}
                  </TableCell>
                  <TableCell className="text-white/60 text-xs">{r.entity ?? '—'}</TableCell>
                  <TableCell className="text-white/60 text-xs">
                    {r.granted_level ?? '—'}
                    {r.requested_level && r.granted_level !== r.requested_level && (
                      <span className="text-orange-400/70"> ← {r.requested_level}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.status === 'ok' ? (
                      <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ok
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/15 text-red-300 border-red-500/30 gap-1">
                        <AlertCircle className="w-3 h-3" /> {r.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-white/60 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.duration_ms ?? '—'} ms
                    </span>
                  </TableCell>
                  <TableCell className="text-red-300/80 text-xs max-w-[280px] truncate" title={r.error ?? ''}>
                    {r.error ?? ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}