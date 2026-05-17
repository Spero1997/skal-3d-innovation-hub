import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Lock, FileText } from 'lucide-react';

export default function SharedDocument() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsPwd, setNeedsPwd] = useState(false);
  const [pwd, setPwd] = useState('');
  const [downloading, setDownloading] = useState(false);

  const call = async (download = false, password?: string) => {
    const { data, error } = await supabase.functions.invoke('document-share-access', {
      body: { token, download, password },
    });
    const d: any = data;
    if (error) return { error: error.message };
    if (d?.needs_password) { setNeedsPwd(true); return { needsPassword: true, error: d.error }; }
    if (d?.error) return { error: d.error };
    return { data: d };
  };

  useEffect(() => {
    (async () => {
      const r = await call(false);
      if (r.error && !r.needsPassword) setError(r.error);
      if (r.data) setMeta(r.data);
      setLoading(false);
    })();
  }, [token]);

  const download = async () => {
    setDownloading(true);
    const r = await call(true, pwd || undefined);
    setDownloading(false);
    if (r.error) return setError(r.error);
    if (r.data?.download_url) {
      window.location.href = r.data.download_url;
      setMeta(r.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <Card className="bg-[#111] border-white/10 p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-orange-400" />
          <h1 className="text-xl font-semibold">SKAL — Document partagé</h1>
        </div>
        {loading ? <p className="text-white/60 text-sm">Chargement…</p>
        : error ? <p className="text-red-400 text-sm">{error}</p>
        : needsPwd && !meta?.download_url ? (
          <div className="space-y-3">
            <p className="text-sm text-white/70 flex items-center gap-2"><Lock className="w-4 h-4" /> Ce lien est protégé.</p>
            <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Mot de passe" className="bg-white/5 border-white/10" />
            <Button onClick={download} disabled={downloading || !pwd} className="w-full bg-orange-500 hover:bg-orange-600">{downloading ? 'Vérification…' : 'Accéder'}</Button>
          </div>
        ) : meta ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/50">{meta.document?.kind}</p>
              <p className="text-lg">{meta.document?.name}</p>
              <p className="text-xs text-white/40 mt-1">{meta.document?.original_name} · {((meta.document?.size_bytes || 0) / 1024).toFixed(0)} Ko · v{meta.document?.version}</p>
            </div>
            {meta.share?.expires_at && <p className="text-xs text-white/40">Expire le {new Date(meta.share.expires_at).toLocaleDateString('fr-FR')}</p>}
            {meta.share?.downloads_left != null && <p className="text-xs text-white/40">{meta.share.downloads_left} téléchargement(s) restant(s)</p>}
            <Button onClick={download} disabled={downloading} className="w-full bg-orange-500 hover:bg-orange-600">
              <Download className="w-4 h-4 mr-2" /> {downloading ? 'Préparation…' : 'Télécharger'}
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}