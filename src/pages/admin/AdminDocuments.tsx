import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Download, Trash2, Folder } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatDate } from '@/lib/projects';

export default function AdminDocuments() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from('projects').select('id,name,code').order('name').then(({ data }) => {
      setProjects(data ?? []);
      if (data && data.length && !projectId) setProjectId(data[0].id);
    });
  }, []);

  const load = async () => {
    if (!projectId) return;
    const { data } = await supabase.storage.from('project-files').list(projectId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    setFiles(data ?? []);
  };
  useEffect(() => { load(); }, [projectId]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !projectId) return;
    setUploading(true);
    const path = `${projectId}/${Date.now()}-${f.name}`;
    const { error } = await supabase.storage.from('project-files').upload(path, f);
    setUploading(false);
    if (error) return toast.error('Upload échoué', { description: error.message });
    toast.success('Fichier ajouté');
    e.target.value = '';
    load();
  };

  const download = async (name: string) => {
    const { data } = await supabase.storage.from('project-files').createSignedUrl(`${projectId}/${name}`, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const remove = async (name: string) => {
    if (!confirm('Supprimer ?')) return;
    await supabase.storage.from('project-files').remove([`${projectId}/${name}`]);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6" /> Documents
        </h1>
        <p className="text-sm text-white/40 mt-1">Bibliothèque par projet (privée)</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[240px]">
          <p className="text-xs text-white/50 mb-1">Projet</p>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <label>
          <Input type="file" onChange={upload} disabled={uploading || !projectId} className="hidden" id="file-up" />
          <Button asChild disabled={uploading || !projectId} className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
            <span><Upload className="w-4 h-4 mr-2" /> {uploading ? 'Envoi…' : 'Téléverser'}</span>
          </Button>
        </label>
        <input type="file" onChange={upload} disabled={uploading || !projectId}
          className="absolute opacity-0 w-0 h-0" id="file-up-real"
          ref={r => r && (window as any).__fileUp = r} />
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {!projectId ? <div className="p-12 text-center text-white/40">Choisis un projet</div>
        : files.length === 0 ? (
          <div className="p-12 text-center">
            <Folder className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Aucun document</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {files.map(f => (
              <li key={f.name} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{f.name.replace(/^\d+-/, '')}</p>
                    <p className="text-[11px] text-white/40">
                      {formatDate(f.created_at)} · {(f.metadata?.size / 1024).toFixed(0)} Ko
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => download(f.name)} className="text-white/60 hover:text-white">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(f.name)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
