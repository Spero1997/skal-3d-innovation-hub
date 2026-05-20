import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wallet, TrendingUp, TrendingDown, FolderKanban, Users, ArrowUpRight,
  PiggyBank, Activity, Briefcase,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { DOMAIN_LABELS, STATUS_LABELS, formatXOF, formatDate } from '@/lib/projects';
import { Link } from 'react-router-dom';

type TxRow = {
  id: string; type: string; status: string; amount: number;
  transaction_date: string; description: string | null; project_id: string | null;
  distribution_case: string | null;
};
type CashRow = { direction: 'entree' | 'sortie'; amount: number; movement_date: string; label: string };
type ProjectRow = {
  id: string; name: string; domain: string; status: string;
  budget: number | null; amount_collected: number | null; progress: number;
};

const DOMAIN_HEX: Record<string, string> = {
  architecture_btp: '#f97316',
  geomatique_sig: '#10b981',
  graphisme_ia: '#d946ef',
  web_digital: '#3b82f6',
  autre: '#71717a',
};

export default function AdminDashboard() {
  const { user, roles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<TxRow[]>([]);
  const [cash, setCash] = useState<CashRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [clientsCount, setClientsCount] = useState(0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  })();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [txRes, cashRes, projRes, clientsRes] = await Promise.all([
        supabase.from('transactions').select('id,type,status,amount,transaction_date,description,project_id,distribution_case').order('transaction_date', { ascending: true }),
        supabase.from('cash_movements').select('direction,amount,movement_date,label').order('movement_date', { ascending: true }),
        supabase.from('projects').select('id,name,domain,status,budget,amount_collected,progress'),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
      ]);
      setTx((txRes.data ?? []) as TxRow[]);
      setCash((cashRes.data ?? []) as CashRow[]);
      setProjects((projRes.data ?? []) as ProjectRow[]);
      setClientsCount(clientsRes.count ?? 0);
      setLoading(false);
    })();
  }, []);

  const kpi = useMemo(() => {
    const revenu = tx.filter(t => t.type === 'revenu' && t.status === 'encaissee').reduce((s, t) => s + Number(t.amount), 0);
    const depense = tx.filter(t => t.type === 'depense').reduce((s, t) => s + Number(t.amount), 0);
    const caisseBal = cash.reduce((s, c) => s + (c.direction === 'entree' ? Number(c.amount) : -Number(c.amount)), 0);
    const activeProjects = projects.filter(p => p.status === 'en_cours' || p.status === 'prospect' || p.status === 'livre').length;
    const delivered = projects.filter(p => p.status === 'livre');
    const totalDeliveredAmount = delivered.reduce((s, p) => s + Number(p.budget ?? 0), 0);
    const avgProject = delivered.length ? totalDeliveredAmount / delivered.length : 0;
    return { revenu, depense, caisseBal, activeProjects, marge: revenu - depense, totalDeliveredAmount, avgProject };
  }, [tx, cash, projects]);

  // Monthly revenue/expense trend
  const monthly = useMemo(() => {
    const map = new Map<string, { month: string; revenu: number; depense: number; caisse: number }>();
    const key = (d: string) => d.slice(0, 7);
    tx.forEach(t => {
      const k = key(t.transaction_date);
      if (!map.has(k)) map.set(k, { month: k, revenu: 0, depense: 0, caisse: 0 });
      const row = map.get(k)!;
      if (t.type === 'revenu' && t.status === 'encaissee') row.revenu += Number(t.amount);
      if (t.type === 'depense') row.depense += Number(t.amount);
    });
    cash.forEach(c => {
      const k = key(c.movement_date);
      if (!map.has(k)) map.set(k, { month: k, revenu: 0, depense: 0, caisse: 0 });
      const row = map.get(k)!;
      row.caisse += c.direction === 'entree' ? Number(c.amount) : -Number(c.amount);
    });
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month)).map(r => ({
      ...r,
      label: new Date(r.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    }));
  }, [tx, cash]);

  // Cumulative caisse balance
  const caisseSeries = useMemo(() => {
    let bal = 0;
    return [...cash]
      .sort((a, b) => a.movement_date.localeCompare(b.movement_date))
      .map(c => {
        bal += c.direction === 'entree' ? Number(c.amount) : -Number(c.amount);
        return { date: c.movement_date, balance: bal, label: formatDate(c.movement_date) };
      });
  }, [cash]);

  // Revenue by domain
  const byDomain = useMemo(() => {
    const map = new Map<string, number>();
    const projMap = new Map(projects.map(p => [p.id, p.domain]));
    tx.filter(t => t.type === 'revenu' && t.status === 'encaissee').forEach(t => {
      const d = (t.project_id && projMap.get(t.project_id)) || 'autre';
      map.set(d, (map.get(d) ?? 0) + Number(t.amount));
    });
    return Array.from(map.entries()).map(([domain, value]) => ({
      domain, value, name: DOMAIN_LABELS[domain] ?? domain, color: DOMAIN_HEX[domain] ?? '#71717a',
    }));
  }, [tx, projects]);

  // Project status breakdown
  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach(p => map.set(p.status, (map.get(p.status) ?? 0) + 1));
    return Array.from(map.entries()).map(([status, count]) => ({
      status, count, name: STATUS_LABELS[status] ?? status,
    }));
  }, [projects]);

  const recentTx = useMemo(() => [...tx].reverse().slice(0, 6), [tx]);

  const stats = [
    { label: "Chiffre d'affaires", value: formatXOF(kpi.revenu), icon: TrendingUp, accent: 'from-orange-500 to-orange-600', to: '/admin/finances' },
    { label: 'Caisse entreprise (15%)', value: formatXOF(kpi.caisseBal), icon: PiggyBank, accent: 'from-emerald-500 to-emerald-600', to: '/admin/caisse' },
    { label: 'Dépenses', value: formatXOF(kpi.depense), icon: TrendingDown, accent: 'from-rose-500 to-rose-600', to: '/admin/finances' },
    { label: 'Projets actifs', value: String(kpi.activeProjects), icon: FolderKanban, accent: 'from-blue-500 to-blue-600', to: '/admin/projets' },
    { label: 'Clients', value: String(clientsCount), icon: Users, accent: 'from-purple-500 to-purple-600', to: '/admin/clients' },
    { label: 'Marge brute', value: formatXOF(kpi.marge), icon: Activity, accent: 'from-amber-500 to-amber-600', to: '/admin/finances' },
    { label: 'Total projets livrés', value: formatXOF(kpi.totalDeliveredAmount), icon: Briefcase, accent: 'from-teal-500 to-teal-600', to: '/admin/projets' },
    { label: 'Prix moyen / projet', value: formatXOF(kpi.avgProject), icon: Activity, accent: 'from-indigo-500 to-indigo-600', to: '/admin/projets' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <p className="text-sm text-white/50">{greeting},</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">{user?.email}</h1>
        <p className="text-sm text-white/40 mt-2">
          Vue d'ensemble en temps réel de l'activité de SKAL SERVICES SARL.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Link to={s.to} key={s.label}>
            <Card className="p-4 bg-[#111]/80 border-white/5 hover:border-white/15 transition-colors group h-full">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-lg`}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider leading-tight">{s.label}</p>
              {loading
                ? <Skeleton className="h-6 w-20 mt-1 bg-white/5" />
                : <p className="text-lg font-bold text-white mt-1 truncate">{s.value}</p>}
            </Card>
          </Link>
        ))}
      </div>

      {/* Trend chart */}
      <Card className="p-5 bg-[#111]/80 border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Revenus vs Dépenses</h2>
            <p className="text-xs text-white/40">Évolution mensuelle</p>
          </div>
        </div>
        <div className="h-72">
          {loading ? <Skeleton className="h-full w-full bg-white/5" /> : monthly.length === 0 ? (
            <EmptyState text="Aucune transaction enregistrée" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="label" stroke="#ffffff60" fontSize={11} />
                <YAxis stroke="#ffffff60" fontSize={11} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
                <Tooltip content={<TipMoney />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="revenu" name="Revenus" stroke="#f97316" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="depense" name="Dépenses" stroke="#f43f5e" fill="url(#dep)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Caisse evolution */}
        <Card className="p-5 bg-[#111]/80 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Caisse entreprise</h2>
              <p className="text-xs text-white/40">Solde cumulé (15%)</p>
            </div>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-64">
            {loading ? <Skeleton className="h-full w-full bg-white/5" /> : caisseSeries.length === 0 ? (
              <EmptyState text="Aucun mouvement de caisse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={caisseSeries}>
                  <defs>
                    <linearGradient id="caisse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="label" stroke="#ffffff60" fontSize={10} />
                  <YAxis stroke="#ffffff60" fontSize={10} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
                  <Tooltip content={<TipMoney />} />
                  <Area type="monotone" dataKey="balance" name="Solde" stroke="#10b981" fill="url(#caisse)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Revenue by domain */}
        <Card className="p-5 bg-[#111]/80 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Revenus par domaine</h2>
              <p className="text-xs text-white/40">Répartition CA encaissé</p>
            </div>
            <Briefcase className="w-5 h-5 text-orange-400" />
          </div>
          <div className="h-64">
            {loading ? <Skeleton className="h-full w-full bg-white/5" /> : byDomain.length === 0 ? (
              <EmptyState text="Aucun revenu encaissé" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byDomain} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}
                  >
                    {byDomain.map((d) => <Cell key={d.domain} fill={d.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip content={<TipMoney />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Project status bars */}
        <Card className="p-5 bg-[#111]/80 border-white/5">
          <h2 className="text-base font-semibold text-white mb-1">Projets par statut</h2>
          <p className="text-xs text-white/40 mb-4">Pipeline en cours</p>
          <div className="h-56">
            {loading ? <Skeleton className="h-full w-full bg-white/5" /> : byStatus.length === 0 ? (
              <EmptyState text="Aucun projet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff60" fontSize={11} />
                  <YAxis stroke="#ffffff60" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #ffffff20', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" name="Projets" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Recent transactions */}
        <Card className="p-5 bg-[#111]/80 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Activité récente</h2>
              <p className="text-xs text-white/40">Dernières transactions</p>
            </div>
            <Link to="/admin/finances" className="text-xs text-orange-400 hover:underline">Tout voir →</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full bg-white/5" />)}</div>
          ) : recentTx.length === 0 ? (
            <EmptyState text="Aucune transaction" />
          ) : (
            <ul className="divide-y divide-white/5">
              {recentTx.map(t => (
                <li key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'revenu' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                      {t.type === 'revenu' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{t.description ?? (t.type === 'revenu' ? 'Revenu' : 'Dépense')}</p>
                      <p className="text-[11px] text-white/40">{formatDate(t.transaction_date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap ${t.type === 'revenu' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'revenu' ? '+' : '−'} {formatXOF(Number(t.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <span key={r} className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10">{r}</span>
        ))}
      </div>
    </div>
  );
}

function TipMoney({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-white/60 mb-1">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-white">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold">{formatXOF(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center text-sm text-white/30">
      {text}
    </div>
  );
}
