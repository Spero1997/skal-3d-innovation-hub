import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Copy, Trash2, Link2 } from 'lucide-react';

type Props = { open: boolean; onOpenChange: (o: boolean) => void; documentId: string; };

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function ShareDocumentDialog({ open, onOpenChange, documentId }: Props) {
  const [shares, setShares] = useState<any[]>([]);
  const [label, setLabel] = useState('');
  const [days, setDays] = useState<number | ''>(7);
  const [maxDl, setMaxDl] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('document_shares').select('*').eq('document_id', documentId).order('created_at', { ascending: false });
    setShares(data ?? []);
  };
  useEffect(() => { if (open) load(); }, [open, documentId]);

  const create = async () => {
    setCreating(true);
    const { data: u } = await supabase.auth.getUser();
    const payload: any = {
      document_id: documentId,
      label: label.trim() || null,
      created_by: u.user?.id,
    };
    if (days && Number(days) > 0) payload.expires_at = new Date(Date.now() + Number(days) * 86400000).toISOString();
    if (maxDl && Number(maxDl) > 0) payload.max_downloads = Number(maxDl);
    if (password) payload.password_hash = await sha256(password);
    const { error } = await supabase.from('document_shares').insert(payload);
    setCreating(false);
    if (error) return toast.error('Échec', { description: error.message });
    setLabel(''); setPassword(''); setMaxDl(''); load();
    toast.success('Lien créé');
  };

  const revoke = async (id: string) => {
    await supabase.from('document_shares').update({ revoked_at: new Date().toISOString() }).eq('id', id);
    load();
  };

  const copy = (token: string) => {
    const url = `${window.location.origin}/partage/${token}`;
    navigator.clipboard.writeText(url); toast.success('Lien copié');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Link2 className="w-5 h-5" /> Partager le document</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-white/70">Étiquette</Label><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Client X" className="bg-white/5 border-white/10" /></div>
            <div><Label className="text-white/70">Expire dans (jours)</Label><Input type="number" value={days} onChange={e => setDays(e.target.value === '' ? '' : Number(e.target.value))} className="bg-white/5 border-white/10" /></div>
            <div><Label className="text-white/70">Max téléchargements</Label><Input type="number" value={maxDl} onChange={e => setMaxDl(e.target.value === '' ? '' : Number(e.target.value))} placeholder="illimité" className="bg-white/5 border-white/10" /></div>
            <div><Label className="text-white/70">Mot de passe</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="(optionnel)" className="bg-white/5 border-white/10" /></div>
          </div>
          <Button onClick={create} disabled={creating} className="bg-orange-500 hover:bg-orange-600">{creating ? 'Création…' : 'Créer un lien'}</Button>

          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-white/50 mb-2">Liens existants</p>
            {shares.length === 0 ? (
              <p className="text-xs text-white/40">Aucun lien.</p>
            ) : (
              <ul className="space-y-2 max-h-56 overflow-auto">
                {shares.map(s => (
                  <li key={s.id} className="flex items-center justify-between gap-2 bg-white/5 rounded p-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate">{s.label || 'Lien'} {s.revoked_at && <span className="text-red-400 text-xs">(révoqué)</span>}</p>
                      <p className="text-[11px] text-white/40">
                        {s.expires_at ? `Exp. ${new Date(s.expires_at).toLocaleDateString('fr-FR')}` : 'Sans expiration'} ·
                        {s.max_downloads ? ` ${s.download_count}/${s.max_downloads} dl` : ` ${s.download_count} dl`}
                        {s.password_hash ? ' · 🔒' : ''}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => copy(s.token)} className="text-white/60 hover:text-white"><Copy className="w-4 h-4" /></Button>
                      {!s.revoked_at && <Button size="icon" variant="ghost" onClick={() => revoke(s.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}