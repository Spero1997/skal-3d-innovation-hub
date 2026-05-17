import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, KeyRound, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function AdminSettings() {
  const { user } = useAuth();
  const [pw, setPw] = useState({ next: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const update = async () => {
    if (pw.next.length < 8) return toast.error('Min 8 caractères');
    if (pw.next !== pw.confirm) return toast.error('Les mots de passe ne correspondent pas');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Mot de passe mis à jour');
    setPw({ next: '', confirm: '' });
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6" /> Paramètres
        </h1>
        <p className="text-sm text-white/40 mt-1">Compte et préférences</p>
      </div>

      <Card className="p-5 bg-[#111]/80 border-white/5 space-y-3">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider">Compte</p>
          <p className="text-sm text-white mt-1">{user?.email}</p>
        </div>
      </Card>

      <Link to="/admin/parametres/notifications">
        <Card className="p-5 bg-[#111]/80 border-white/5 hover:border-orange-500/40 transition cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-sm font-semibold text-white">Préférences de notifications</p>
              <p className="text-xs text-white/40">Canal (in-app / email) et fréquence par type d'événement.</p>
            </div>
          </div>
          <span className="text-white/40">→</span>
        </Card>
      </Link>

      <Card className="p-5 bg-[#111]/80 border-white/5 space-y-3">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> Changer mot de passe
        </h2>
        <div>
          <Label>Nouveau</Label>
          <Input type="password" value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} className="bg-white/5 border-white/10" />
        </div>
        <div>
          <Label>Confirmation</Label>
          <Input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} className="bg-white/5 border-white/10" />
        </div>
        <Button onClick={update} disabled={loading} className="bg-orange-500 hover:bg-orange-600">Mettre à jour</Button>
      </Card>
    </div>
  );
}
