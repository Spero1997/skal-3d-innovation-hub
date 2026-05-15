import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, UsersRound, Loader2, Mail, Phone, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Client = {
  id: string; name: string; company: string | null;
  email: string | null; phone: string | null;
  address: string | null; notes: string | null;
};

export default function AdminClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '', notes: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setClients((data ?? []) as Client[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.name.trim()) { toast.error('Le nom est requis'); return; }
    setSaving(true);
    const { error } = await supabase.from('clients').insert({
      name: form.name.trim(),
      company: form.company.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
      created_by: user?.id,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Client ajouté');
    setForm({ name: '', company: '', email: '', phone: '', address: '', notes: '' });
    setOpen(false);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Clients</h1>
          <p className="text-sm text-white/50 mt-1">Carnet de clients et prospects.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nouveau client
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
      ) : clients.length === 0 ? (
        <Card className="p-12 text-center bg-[#111]/80 border-white/5">
          <UsersRound className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Aucun client enregistré.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clients.map((c) => (
            <Card key={c.id} className="p-5 bg-[#111]/80 border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-base font-semibold text-white">{c.name}</h3>
              {c.company && <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" />{c.company}</p>}
              <div className="mt-3 space-y-1 text-xs text-white/60">
                {c.email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{c.email}</p>}
                {c.phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{c.phone}</p>}
              </div>
              {c.notes && <p className="mt-3 pt-3 border-t border-white/5 text-xs text-white/50 line-clamp-2">{c.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#111] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Field label="Nom *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" /></Field>
            <Field label="Société"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-white/5 border-white/10 text-white" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white/5 border-white/10 text-white" /></Field>
              <Field label="Téléphone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white/5 border-white/10 text-white" /></Field>
            </div>
            <Field label="Adresse"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-white/5 border-white/10 text-white" /></Field>
            <Field label="Notes"><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-white/5 border-white/10 text-white" /></Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 text-white hover:bg-white/5">Annuler</Button>
            <Button onClick={submit} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">{saving ? 'Ajout…' : 'Ajouter'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-white/60">{label}</Label>
      {children}
    </div>
  );
}