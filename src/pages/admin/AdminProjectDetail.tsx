import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Calendar, Wallet, Target, User } from 'lucide-react';
import {
  DOMAIN_LABELS, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS,
  formatXOF, formatDate,
} from '@/lib/projects';
import { TasksKanban } from '@/components/admin/projects/TasksKanban';
import { ProjectComments } from '@/components/admin/projects/ProjectComments';
import { ProjectGantt } from '@/components/admin/projects/ProjectGantt';
import { ApplyTemplateDialog } from '@/components/admin/projects/ApplyTemplateDialog';

export default function AdminProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tplOpen, setTplOpen] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data: p } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
    setProject(p);
    if (p?.client_id) {
      const { data: c } = await supabase.from('clients').select('*').eq('id', p.client_id).maybeSingle();
      setClient(c);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>;
  }
  if (!project) {
    return (
      <div className="p-8 text-center text-white/60">
        Projet introuvable.
        <div className="mt-4">
          <Button asChild variant="outline" className="border-white/10 text-white"><Link to="/admin/projets">Retour aux projets</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <button onClick={() => navigate('/admin/projets')} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux projets
      </button>

      <Card className="p-6 bg-[#111]/80 border-white/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {project.code && (
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40 font-mono uppercase">{project.code}</span>
              )}
              <Badge variant="outline" className={`${STATUS_COLORS[project.status]} text-xs`}>
                {STATUS_LABELS[project.status]}
              </Badge>
              <span className="text-xs text-white/40">{DOMAIN_LABELS[project.domain]}</span>
              <span className="text-xs text-white/40">· Priorité {PRIORITY_LABELS[project.priority]}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-3">{project.name}</h1>
            {project.description && <p className="text-sm text-white/60 mt-2 max-w-3xl">{project.description}</p>}
          </div>
          <Button variant="outline" className="border-white/10 text-white" onClick={() => setTplOpen(true)}>
            Créer depuis un modèle
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <Stat icon={Wallet} label="Budget" value={formatXOF(Number(project.budget))} />
          <Stat icon={Target} label="Encaissé" value={formatXOF(Number(project.amount_collected))} accent="text-emerald-400" />
          <Stat icon={Calendar} label="Échéance" value={formatDate(project.due_date)} />
          <Stat icon={User} label="Client" value={client?.name ?? '—'} />
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/40 uppercase tracking-wider">Avancement</span>
            <span className="text-white/80 font-semibold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2 bg-white/5" />
        </div>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList className="bg-[#111] border border-white/5">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">Tâches</TabsTrigger>
          <TabsTrigger value="gantt" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">Gantt</TabsTrigger>
          <TabsTrigger value="comments" className="data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">Commentaires</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <TasksKanban projectId={project.id} />
        </TabsContent>
        <TabsContent value="gantt" className="mt-4">
          <ProjectGantt projectId={project.id} />
        </TabsContent>
        <TabsContent value="comments" className="mt-4">
          <ProjectComments projectId={project.id} />
        </TabsContent>
      </Tabs>

      <ApplyTemplateDialog
        projectId={project.id}
        open={tplOpen}
        onOpenChange={setTplOpen}
      />
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <p className={`mt-1 font-semibold ${accent ?? 'text-white'}`}>{value}</p>
    </div>
  );
}