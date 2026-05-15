import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  associe: 'Associé',
  comptable: 'Comptable',
  chef_projet: 'Chef de projet',
};

const ROLE_BADGE: Record<string, string> = {
  super_admin: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  associe: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  comptable: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  chef_projet: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export default function AdminTeam() {
  const { hasRole } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'chef_projet' });

  const load = async () => {
    setLoading(true);
    const { data: roles } = await supabase.from('user_roles').select('user_id, role, created_at');
    const ids = Array.from(new Set((roles ?? []).map((r: any) => r.user_id)));
    const { data: profs } = ids.length
      ? await supabase.from('profiles').select('user_id, full_name, phone, status').in('user_id', ids)
      : { data: [] };
    const grouped: Record<string, any> = {};
    (roles ?? []).forEach((r: any) => {
      if (!grouped[r.user_id]) {
        const p = (profs ?? []).find((x: any) => x.user_id === r.user_id);
        grouped[r.user_id] = { user_id: r.user_id, ...(p ?? {}), roles: [] };
      }
      grouped[r.user_id].roles.push(r.role);
    });
    setMembers(Object.values(grouped));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!form.email) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('invite-user', { body: form });
    setSubmitting(false);
    if (error || (data as any)?.error) {
      toast.error('Erreur', { description: (data as any)?.error ?? error?.message });
      return;
    }
    toast.success('Invitation envoyée', { description: `${form.email} recevra un email.` });
    setOpen(false);
    setForm({ email: '', full_name: '', role: 'chef_projet' });
    load();
  };

  const isSuper = hasRole('super_admin');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" /> Équipe interne
          </h1>
          <p className="text-sm text-white/40 mt-1">Collaborateurs avec accès à la console</p>
        </div>
        {isSuper && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <UserPlus className="w-4 h-4 mr-2" /> Inviter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111] border-white/10 text-white">
              <DialogHeader><DialogTitle>Inviter un collaborateur</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemple.com" className="bg-white/5 border-white/10" />
                </div>
                <div>
                  <Label>Nom complet</Label>
                  <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="bg-white/5 border-white/10" />
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      {Object.entries(ROLE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={invite} disabled={submitting} className="bg-orange-500 hover:bg-orange-600">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Envoyer l'invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="bg-[#111]/80 border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Chargement…</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-white/40">Aucun membre</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {members.map(m => (
              <li key={m.user_id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{m.full_name ?? '—'}</p>
                  <p className="text-xs text-white/40">{m.phone ?? ''}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.roles.map((r: string) => (
                    <Badge key={r} variant="outline" className={ROLE_BADGE[r] ?? ''}>{ROLE_LABELS[r] ?? r}</Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
