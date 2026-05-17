import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, History, Sparkles, FileSignature, Upload } from 'lucide-react';
import { formatDate } from '@/lib/projects';

type Props = { doc: any | null; onClose: () => void; onChanged: () => void; onSign: () => void; onShare: () => void; };

export function DocumentDrawer({ doc, onClose, onChanged, onSign, onShare }: Props) {
  const [versions, setVersions] = useState<any[]>([]);
  const [sigs, setSigs] = useState<any[]>([]);
  const [extractions, setExtractions] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [kind, setKind] = useState<'facture' | 'devis' | 'generic'>('generic');
  const [previewVersion, setPreviewVersion] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const reload = async () => {
    if (!doc) return;
    const [{ data: v }, { data: s }, { data: x }] = await Promise.all([
      supabase.from('document_versions').select('*').eq('document_id', doc.id).order('version', { ascending: false }),
      supabase.from('document_signatures').select('*').eq('document_id', doc.id).order('signed_at', { ascending: false }),
      supabase.from('document_extractions').select('*').eq('document_id', doc.id).order('created_at', { ascending: false }),
    ]);
    const vs = v ?? [];
    setVersions(vs); setSigs(s ?? []); setExtractions(x ?? []);
    // auto-select latest version for preview
    if (vs.length) setPreviewVersion(prev => prev && vs.find(x => x.id === prev.id) ? prev : vs[0]);
    else { setPreviewVersion(null); setPreviewUrl(null); }
  };
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [doc?.id]);

  // Build signed URL for the selected version
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!previewVersion) { setPreviewUrl(null); return; }
      setPreviewLoading(true);
      const { data } = await supabase.storage.from('project-files').createSignedUrl(previewVersion.storage_path, 3600);
      if (!cancelled) { setPreviewUrl(data?.signedUrl ?? null); setPreviewLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [previewVersion?.id]);

  const dl = async (path: string, name: string) => {
    const { data } = await supabase.storage.from('project-files').createSignedUrl(path, 3600, { download: name });
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const uploadVersion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !doc) return;
    setUploading(true);
    const newV = (doc.current_version || 0) + 1;
    const path = `${doc.project_id}/${doc.id}/v${newV}-${Date.now()}-${f.name}`;
    const { error: uErr } = await supabase.storage.from('project-files').upload(path, f);
    if (uErr) { setUploading(false); return toast.error(uErr.message); }
    const { data: u } = await supabase.auth.getUser();
    const { error: vErr } = await supabase.from('document_versions').insert({
      document_id: doc.id, version: newV, storage_path: path,
      original_name: f.name, mime_type: f.type, size_bytes: f.size, uploaded_by: u.user?.id,
    });
    if (!vErr) await supabase.from('documents').update({ current_version: newV }).eq('id', doc.id);
    setUploading(false); e.target.value = '';
    if (vErr) return toast.error(vErr.message);
    toast.success(`Version v${newV} ajoutée`); reload(); onChanged();
  };

  const extract = async () => {
    if (!doc) return;
    setExtracting(true);
    const { data, error } = await supabase.functions.invoke('ai-extract-document', {
      body: { document_id: doc.id, kind },
    });
    setExtracting(false);
    if (error || (data as any)?.error) return toast.error('Extraction échouée', { description: error?.message || (data as any)?.error });
    toast.success('Extraction IA terminée'); reload();
  };

  if (!doc) return null;
  const mime = previewVersion?.mime_type || '';
  const isImage = mime.startsWith('image/');
  const isPdf = mime === 'application/pdf' || (previewVersion?.original_name || '').toLowerCase().endsWith('.pdf');
  const isText = mime.startsWith('text/') || mime === 'application/json';
  return (
    <Sheet open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-[#0a0a0a] border-white/10 text-white w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader><SheetTitle className="text-white">{doc.name}</SheetTitle></SheetHeader>
        <div className="mt-4 space-y-5">
          <div className="flex flex-wrap gap-2">
            <label>
              <input type="file" onChange={uploadVersion} disabled={uploading} className="hidden" />
              <span className="inline-flex items-center text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 h-8 cursor-pointer">
                <Upload className="w-3 h-3 mr-1" /> {uploading ? 'Envoi…' : 'Nouvelle version'}
              </span>
            </label>
            <Button size="sm" variant="ghost" onClick={onShare} className="text-white/70 h-8"><History className="w-3 h-3 mr-1" /> Partager</Button>
            <Button size="sm" variant="ghost" onClick={onSign} className="text-white/70 h-8"><FileSignature className="w-3 h-3 mr-1" /> Signer</Button>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={kind} onValueChange={(v: any) => setKind(v)}>
                <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="facture">Facture</SelectItem>
                  <SelectItem value="devis">Devis</SelectItem>
                  <SelectItem value="generic">Générique</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={extract} disabled={extracting} className="h-8 bg-orange-500 hover:bg-orange-600 text-xs"><Sparkles className="w-3 h-3 mr-1" /> {extracting ? 'IA…' : 'Extraire'}</Button>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-white/40">Aperçu {previewVersion && <span className="text-white/30">— v{previewVersion.version}</span>}</h3>
              {previewUrl && <a href={previewUrl} target="_blank" rel="noreferrer" className="text-[11px] text-orange-300 hover:text-orange-200">Ouvrir dans un onglet ↗</a>}
            </div>
            <div className="bg-black/60 border border-white/10 rounded overflow-hidden h-[480px] flex items-center justify-center">
              {!previewVersion ? (
                <p className="text-xs text-white/40">Aucune version disponible</p>
              ) : previewLoading ? (
                <p className="text-xs text-white/40">Chargement…</p>
              ) : !previewUrl ? (
                <p className="text-xs text-red-400">Impossible de générer l'aperçu</p>
              ) : isImage ? (
                <img src={previewUrl} alt={previewVersion.original_name} className="max-w-full max-h-full object-contain" />
              ) : isPdf ? (
                <iframe src={previewUrl} title={previewVersion.original_name} className="w-full h-full bg-white" />
              ) : isText ? (
                <iframe src={previewUrl} title={previewVersion.original_name} className="w-full h-full bg-white" />
              ) : (
                <div className="text-center p-6">
                  <p className="text-xs text-white/50 mb-2">Aperçu non disponible pour ce type ({mime || 'inconnu'})</p>
                  <Button size="sm" onClick={() => dl(previewVersion.storage_path, previewVersion.original_name)} className="bg-orange-500 hover:bg-orange-600 h-8 text-xs">
                    <Download className="w-3 h-3 mr-1" /> Télécharger
                  </Button>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Versions ({versions.length})</h3>
            <ul className="space-y-1">
              {versions.map(v => (
                <li
                  key={v.id}
                  onClick={() => setPreviewVersion(v)}
                  className={`flex items-center justify-between rounded p-2 text-sm cursor-pointer transition border ${previewVersion?.id === v.id ? 'bg-orange-500/10 border-orange-500/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    {v.version === doc.current_version && <span className="text-[9px] uppercase tracking-wider bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">actuelle</span>}
                    <div className="min-w-0">
                      <p className="truncate">v{v.version} — {v.original_name}</p>
                      <p className="text-[11px] text-white/40">{formatDate(v.created_at)} · {((v.size_bytes || 0) / 1024).toFixed(0)} Ko · {v.mime_type || '—'}</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); dl(v.storage_path, v.original_name); }} className="text-white/60 hover:text-white"><Download className="w-4 h-4" /></Button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Signatures ({sigs.length})</h3>
            {sigs.length === 0 ? <p className="text-xs text-white/40">Aucune signature.</p> : (
              <ul className="space-y-2">
                {sigs.map(s => (
                  <li key={s.id} className="bg-white/5 rounded p-2 text-sm">
                    <div className="flex justify-between"><span>{s.signer_name} {s.signer_role && <span className="text-white/40">— {s.signer_role}</span>}</span><span className="text-[11px] text-white/40">v{s.version} · {formatDate(s.signed_at)}</span></div>
                    {s.signer_email && <p className="text-[11px] text-white/40">{s.signer_email}</p>}
                    <img src={s.signature_data} alt="signature" className="mt-1 max-h-16 bg-black/50 rounded" />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Extractions IA ({extractions.length})</h3>
            {extractions.length === 0 ? <p className="text-xs text-white/40">Aucune extraction.</p> : (
              <ul className="space-y-2">
                {extractions.map(x => (
                  <li key={x.id} className="bg-white/5 rounded p-2 text-sm">
                    <div className="flex justify-between text-xs">
                      <span className="text-orange-300">{x.kind} · v{x.version}</span>
                      <span className="text-white/40">{x.confidence != null ? `${x.confidence}%` : '–'} · {formatDate(x.created_at)}</span>
                    </div>
                    {x.summary && <p className="text-xs text-white/70 mt-1">{x.summary}</p>}
                    <pre className="text-[11px] text-white/60 bg-black/40 rounded p-2 mt-1 overflow-auto max-h-48">{JSON.stringify(x.data, null, 2)}</pre>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}