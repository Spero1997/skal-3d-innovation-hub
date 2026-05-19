import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FolderKanban, Loader2 } from 'lucide-react';
import { NewProjectDialog } from '@/components/admin/projects/NewProjectDialog';
import { toast } from 'sonner';
import {
  DOMAIN_LABELS, STATUS_LABELS, STATUS_COLORS,
  formatXOF, formatDate,
} from '@/lib/projects';
import { Progress } from '@/components/ui/progress';

type Project = {
  id: string; code: string | null; name: string;
  domain: string; status: string; priority: string;
  budget: number | null; amount_collected: number | null;
  progress: number; due_date: string | null;
  client_id: string | null; manager_id: string | null;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('AdminProjects load error', error);
      toast.error('Impossible de charger les projets', { description: error.message });
    }
    setProjects((data ?? []) as Project[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = projects.filter((p) => {
    if (domain !== 'all' && p.domain !== domain) return false;
    if (status !== 'all' && p.status !== status) return false;
    if (search && !`${p.name} ${p.code ?? ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Projets</h1>
          <p className="text-sm text-white/50 mt-1">
            Pilotage des projets en cours, par domaine et statut.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nouveau projet
        </Button>
      </div>

      <Card className="p-4 bg-[#111]/80 border-white/5">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou code…"
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Domaine" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="all">Tous les domaines</SelectItem>
              {Object.entries(DOMAIN_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="all">Tous statuts</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-[#111]/80 border-white/5">
          <FolderKanban className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Aucun projet pour ces critères.</p>
          <Button onClick={() => setOpen(true)} variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/5">
            Créer le premier projet
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Link key={p.id} to={`/admin/projets/${p.id}`}>
              <Card className="p-5 bg-[#111]/80 border-white/5 hover:border-orange-500/30 hover:bg-[#141414] transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.code && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 font-mono uppercase">
                          {p.code}
                        </span>
                      )}
                      <Badge variant="outline" className={`${STATUS_COLORS[p.status]} text-xs`}>
                        {STATUS_LABELS[p.status]}
                      </Badge>
                      <span className="text-xs text-white/40">{DOMAIN_LABELS[p.domain]}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mt-2 truncate">{p.name}</h3>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                      <span>Budget : <span className="text-white/80">{formatXOF(Number(p.budget))}</span></span>
                      <span>Encaissé : <span className="text-emerald-400">{formatXOF(Number(p.amount_collected))}</span></span>
                      <span>Échéance : <span className="text-white/80">{formatDate(p.due_date)}</span></span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Avancement</span>
                      <span className="text-white/80 font-semibold">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1.5 bg-white/5" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <NewProjectDialog open={open} onOpenChange={setOpen} onCreated={load} />
    </div>
  );
}