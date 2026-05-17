import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Folder, Trash2, FileSignature, Link2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatDate } from '@/lib/projects';
import { DocumentDrawer } from '@/components/admin/documents/DocumentDrawer';
import { ShareDocumentDialog } from '@/components/admin/documents/ShareDocumentDialog';
import { SignDocumentDialog } from '@/components/admin/documents/SignDocumentDialog';

const KINDS = ['contrat', 'facture', 'devis', 'rapport', 'plan', 'photo', 'autre'] as const;
type Kind = typeof KINDS[number];

export default function AdminDocuments() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [docs, setDocs] = useState<any[]>([]);
  const [filterKind, setFilterKind] = useState<'all' | Kind>('all');
  const [query, setQuery] = useState('');
  const [drawerDoc, setDrawerDoc] = useState<any | null>(null);
  const [shareDocId, setShareDocId] = useState<string | null>(null);
  const [signDoc, setSignDoc] = useState<{ id: string; version: number } | null>(null);

  // New doc dialog
  const [openNew, setOpenNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<Kind>('autre');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.from('projects').select('id,name,code').order('name').then(({ data }) => {
      setProjects(data ?? []);
      if (data && data.length && !projectId) setProjectId(data[0].id);
    });
  }, []);

  const load = async () => {
    if (!projectId) return setDocs([]);
    let q = supabase.from('documents').select('*').eq('project_id', projectId).order('updated_at', { ascending: false });
    if (filterKind !== 'all') q = q.eq('kind', filterKind);
    if (query.trim()) q = q.ilike('name', `%${query.trim()}%`);
    const { data } = await q;
    setDocs(data ?? []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [projectId, filterKind, query]);

  const createDoc = async () => {
    if (!projectId || !newName.trim() || !newFile) return toast.error('Nom et fichier requis');
    setCreating(true);
    const { data: u } = await supabase.auth.getUser();
    const { data: doc, error: dErr } = await supabase.from('documents').insert({
      project_id: projectId, name: newName.trim(), kind: newKind, current_version: 1, created_by: u.user?.id,
    }).select().single();
    if (dErr || !doc) { setCreating(false); return toast.error(dErr?.message || 'Échec'); }
    const path = `${projectId}/${doc.id}/v1-${Date.now()}-${newFile.name}`;
    const { error: uErr } = await supabase.storage.from('project-files').upload(path, newFile);
    if (uErr) { setCreating(false); return toast.error(uErr.message); }
    const { error: vErr } = await supabase.from('document_versions').insert({
      document_id: doc.id, version: 1, storage_path: path,
      original_name: newFile.name, mime_type: newFile.type, size_bytes: newFile.size, uploaded_by: u.user?.id,
    });
    setCreating(false);
    if (vErr) return toast.error(vErr.message);
    toast.success('Document créé');
    setOpenNew(false); setNewName(''); setNewKind('autre'); setNewFile(null);
    load();
  };

  const removeDoc = async (id: string) => {
    if (!confirm('Supprimer le document et toutes ses versions ?')) return;
    const { data: versions } = await supabase.from('document_versions').select('storage_path').eq('document_id', id);
    if (versions?.length) await supabase.storage.from('project-files').remove(versions.map(v => v.storage_path));
    await supabase.from('documents').delete().eq('id', id);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="w-6 h-6" /> Documents</h1>
        <p className="text-sm text-white/40 mt-1">Versions, signatures électroniques, partage sécurisé et extraction IA</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-white/50 mb-1">Projet</p>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <p className="text-xs text-white/50 mb-1">Type</p>
          <Select value={filterKind} onValueChange={(v: any) => setFilterKind(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="all">Tous</SelectItem>
              {KINDS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-white/50 mb-1">Recherche</p>
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom…" className="bg-white/5 border-white/10 text-white" />
        </div>
        <Button onClick={() => setOpenNew(true)} disabled={!projectId} className="bg-orange-500 hover:bg-orange-600">
          <Upload className="w-4 h-4 mr-2" /> Nouveau document
        </Button>
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {!projectId ? <div className="p-12 text-center text-white/40">Choisis un projet</div>
        : docs.length === 0 ? (
          <div className="p-12 text-center">
            <Folder className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Aucun document</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {docs.map(d => (
              <li key={d.id} className="p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition cursor-pointer" onClick={() => setDrawerDoc(d)}>
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{d.name}</p>
                    <p className="text-[11px] text-white/40">{d.kind} · v{d.current_version} · {formatDate(d.updated_at)}</p>
                  </div>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" onClick={() => setShareDocId(d.id)} className="text-white/60 hover:text-white" title="Partager"><Link2 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setSignDoc({ id: d.id, version: d.current_version })} className="text-white/60 hover:text-white" title="Signer"><FileSignature className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDrawerDoc(d)} className="text-white/60 hover:text-white" title="Détails"><Sparkles className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => removeDoc(d.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent className="bg-[#111] border-white/10 text-white">
          <DialogHeader><DialogTitle>Nouveau document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-white/70">Nom *</Label><Input value={newName} onChange={e => setNewName(e.target.value)} className="bg-white/5 border-white/10" /></div>
            <div>
              <Label className="text-white/70">Type</Label>
              <Select value={newKind} onValueChange={(v: any) => setNewKind(v)}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {KINDS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/70">Fichier *</Label>
              <Input type="file" onChange={e => setNewFile(e.target.files?.[0] ?? null)} className="bg-white/5 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenNew(false)} className="text-white/60">Annuler</Button>
            <Button onClick={createDoc} disabled={creating} className="bg-orange-500 hover:bg-orange-600">{creating ? 'Création…' : 'Créer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DocumentDrawer doc={drawerDoc} onClose={() => setDrawerDoc(null)} onChanged={load}
        onSign={() => drawerDoc && setSignDoc({ id: drawerDoc.id, version: drawerDoc.current_version })}
        onShare={() => drawerDoc && setShareDocId(drawerDoc.id)} />
      {shareDocId && <ShareDocumentDialog open={!!shareDocId} onOpenChange={(o) => !o && setShareDocId(null)} documentId={shareDocId} />}
      {signDoc && <SignDocumentDialog open={!!signDoc} onOpenChange={(o) => !o && setSignDoc(null)} documentId={signDoc.id} version={signDoc.version} onDone={load} />}
    </div>
  );
}
