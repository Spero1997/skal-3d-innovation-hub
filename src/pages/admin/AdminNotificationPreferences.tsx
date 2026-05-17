import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';

type NotifType =
  | 'task_assigned' | 'comment' | 'transaction' | 'invoice'
  | 'project_status' | 'deadline' | 'mention' | 'system';

const TYPES: { value: NotifType; label: string; desc: string }[] = [
  { value: 'task_assigned', label: 'Tâches assignées', desc: 'Quand une tâche vous est confiée.' },
  { value: 'comment', label: 'Commentaires', desc: 'Réponses et mentions sur vos projets.' },
  { value: 'transaction', label: 'Transactions', desc: 'Nouveau revenu ou dépense (direction).' },
  { value: 'invoice', label: 'Factures', desc: 'Émission, paiement, relance.' },
  { value: 'project_status', label: 'Statut projet', desc: 'Changements d\'état des projets.' },
  { value: 'deadline', label: 'Échéances', desc: 'Rappels d\'échéances proches.' },
  { value: 'mention', label: 'Mentions', desc: 'Quand on vous mentionne.' },
  { value: 'system', label: 'Système & digests', desc: 'Annonces et digest hebdo direction.' },
];

type Channel = 'off' | 'in_app' | 'email' | 'both';
type Frequency = 'immediate' | 'daily_digest' | 'weekly_digest';

type Pref = { notification_type: NotifType; channel: Channel; frequency: Frequency };

export default function AdminNotificationPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Record<NotifType, Pref>>({} as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('notification_preferences')
        .select('notification_type, channel, frequency')
        .eq('user_id', user.id);
      const map: Record<string, Pref> = {};
      TYPES.forEach(t => {
        map[t.value] = { notification_type: t.value, channel: 'both', frequency: 'immediate' };
      });
      (data ?? []).forEach((row: any) => { map[row.notification_type] = row; });
      setPrefs(map as any);
    })();
  }, [user]);

  const update = (type: NotifType, patch: Partial<Pref>) => {
    setPrefs(p => ({ ...p, [type]: { ...p[type], ...patch } }));
  };

  const save = async () => {
    if (!user) return;
    setLoading(true);
    const rows = Object.values(prefs).map(p => ({ ...p, user_id: user.id }));
    const { error } = await supabase
      .from('notification_preferences')
      .upsert(rows, { onConflict: 'user_id,notification_type' });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Préférences enregistrées');
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </h1>
        <p className="text-sm text-white/40 mt-1">Choisissez comment et quand être notifié·e.</p>
      </div>

      <Card className="p-5 bg-[#111]/80 border-white/5 space-y-4">
        {TYPES.map(t => {
          const p = prefs[t.value];
          if (!p) return null;
          return (
            <div key={t.value} className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3 items-end pb-4 border-b border-white/5 last:border-0">
              <div>
                <Label className="text-white">{t.label}</Label>
                <p className="text-xs text-white/40 mt-1">{t.desc}</p>
              </div>
              <div>
                <Label className="text-xs text-white/50">Canal</Label>
                <Select value={p.channel} onValueChange={(v) => update(t.value, { channel: v as Channel })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Désactivé</SelectItem>
                    <SelectItem value="in_app">Application uniquement</SelectItem>
                    <SelectItem value="email">Email uniquement</SelectItem>
                    <SelectItem value="both">App + Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-white/50">Fréquence email</Label>
                <Select
                  value={p.frequency}
                  onValueChange={(v) => update(t.value, { frequency: v as Frequency })}
                  disabled={p.channel === 'off' || p.channel === 'in_app'}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiat</SelectItem>
                    <SelectItem value="daily_digest">Digest quotidien</SelectItem>
                    <SelectItem value="weekly_digest">Digest hebdo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </Card>

      <p className="text-xs text-white/40">
        Les emails partent depuis l'adresse Lovable par défaut tant qu'aucun domaine personnalisé (ex. notify@skalservice.com) n'est connecté.
      </p>
    </div>
  );
}