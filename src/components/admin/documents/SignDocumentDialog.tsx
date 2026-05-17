import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SignaturePad } from './SignaturePad';

type Props = { open: boolean; onOpenChange: (o: boolean) => void; documentId: string; version: number; onDone?: () => void; };

export function SignDocumentDialog({ open, onOpenChange, documentId, version, onDone }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [data, setData] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim() || !data) return toast.error('Nom et signature requis');
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('document_signatures').insert({
      document_id: documentId, version, signer_name: name.trim(),
      signer_email: email.trim() || null, signer_role: role.trim() || null,
      signature_data: data, signed_by: u.user?.id, user_agent: navigator.userAgent,
    });
    setSaving(false);
    if (error) return toast.error('Échec', { description: error.message });
    toast.success('Document signé');
    onOpenChange(false); onDone?.();
    setName(''); setEmail(''); setRole(''); setData(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/10 text-white max-w-lg">
        <DialogHeader><DialogTitle>Signer le document (v{version})</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-white/70">Nom *</Label><Input value={name} onChange={e => setName(e.target.value)} className="bg-white/5 border-white/10" /></div>
            <div><Label className="text-white/70">Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/10" /></div>
          </div>
          <div><Label className="text-white/70">Qualité</Label><Input value={role} onChange={e => setRole(e.target.value)} placeholder="Client, fournisseur…" className="bg-white/5 border-white/10" /></div>
          <div><Label className="text-white/70">Signature</Label><SignaturePad onChange={setData} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60">Annuler</Button>
          <Button onClick={submit} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving ? 'Enregistrement…' : 'Signer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}