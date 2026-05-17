import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Shield, Sparkles } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  associe: 'Associé',
  comptable: 'Comptable',
  chef_projet: 'Chef de projet',
  secretaire: 'Secrétaire',
};

export default function AdminAccount() {
  const { user, roles } = useAuth();
  const [thresholds, setThresholds] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url, status, created_at')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(prof);
      if (roles.length > 0) {
        const { data } = await supabase
          .from('ai_role_thresholds')
          .select('agent_slug, role, min_confidence, allow_force')
          .in('role', roles as any);
        setThresholds(data ?? []);
      }
    })();
  }, [user, roles]);

  // For each agent, applied threshold = MIN across user's roles (most permissive)
  const byAgent: Record<string, { min: number; force: boolean; rows: any[] }> = {};
  thresholds.forEach((t) => {
    if (!byAgent[t.agent_slug]) byAgent[t.agent_slug] = { min: t.min_confidence, force: t.allow_force, rows: [] };
    byAgent[t.agent_slug].min = Math.min(byAgent[t.agent_slug].min, t.min_confidence);
    byAgent[t.agent_slug].force = byAgent[t.agent_slug].force || t.allow_force;
    byAgent[t.agent_slug].rows.push(t);
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserCircle className="w-6 h-6" /> Mon compte
        </h1>
        <p className="text-sm text-white/40 mt-1">Informations, rôles et seuils IA appliqués</p>
      </div>

      <Card className="bg-[#111]/80 border-white/5 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
            <p className="text-sm text-white">{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider">Nom</p>
            <p className="text-sm text-white">{profile?.full_name ?? '—'}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Rôles actifs
          </p>
          {roles.length === 0 ? (
            <p className="text-sm text-white/40">Aucun rôle attribué</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <Badge key={r} variant="outline" className="bg-orange-500/15 text-orange-400 border-orange-500/30">
                  {ROLE_LABELS[r] ?? r}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-[#111]/80 border-white/5 p-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-orange-400" /> Seuils IA appliqués
        </h2>
        <p className="text-xs text-white/40 mb-4">
          Confiance minimale requise pour qu'une suggestion IA soit appliquée. Le seuil le plus permissif parmi vos rôles s'applique.
        </p>
        {Object.keys(byAgent).length === 0 ? (
          <p className="text-sm text-white/40">Aucun seuil configuré pour vos rôles.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {Object.entries(byAgent).map(([agent, info]) => (
              <li key={agent} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{agent}</p>
                  <p className="text-xs text-white/40">
                    {info.force ? 'Validation forcée autorisée' : 'Pas de forçage'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-400">{info.min}%</p>
                  <p className="text-[10px] text-white/40">confiance min.</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}