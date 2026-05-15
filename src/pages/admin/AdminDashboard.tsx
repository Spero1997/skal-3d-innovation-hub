import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import {
  Wallet, TrendingUp, FolderKanban, Users, ArrowUpRight,
} from 'lucide-react';

const stats = [
  { label: "Chiffre d'affaires", value: '—', icon: TrendingUp, accent: 'from-orange-500 to-orange-600' },
  { label: 'Caisse entreprise', value: '—', icon: Wallet, accent: 'from-emerald-500 to-emerald-600' },
  { label: 'Projets actifs', value: '0', icon: FolderKanban, accent: 'from-blue-500 to-blue-600' },
  { label: 'Clients', value: '0', icon: Users, accent: 'from-purple-500 to-purple-600' },
];

export default function AdminDashboard() {
  const { user, roles } = useAuth();
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  })();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <p className="text-sm text-white/50">{greeting},</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
          {user?.email}
        </h1>
        <p className="text-sm text-white/40 mt-2">
          Vue d'ensemble de l'activité de SKAL SERVICES SARL.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 bg-[#111]/80 border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-lg`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <p className="text-xs text-white/50 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-gradient-to-br from-orange-500/5 to-transparent border-orange-500/10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
            Phase 1 — Fondations
          </p>
          <h2 className="text-xl font-bold text-white mb-3">
            Console interne opérationnelle
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            L'authentification, la gestion des rôles et le layout admin sont en place.
            Les modules à venir : Projets & Domaines (Phase 2), Module Financier avec
            calcul automatique des répartitions et caisse 15% (Phase 3), Dashboard
            interactif avec graphiques temps réel (Phase 4), CRM + RH + Documents +
            Dividendes (Phase 5), Notifications + Journal d'activité (Phase 6).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span key={r} className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10">
                {r}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}