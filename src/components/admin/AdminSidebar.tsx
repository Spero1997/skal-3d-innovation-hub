import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Wallet, Users, Briefcase,
  FileText, Bell, Settings, PieChart, UsersRound, Building2, Coins, Receipt, Activity,
  Scale, FlaskConical, CheckSquare, Handshake, Hammer, Percent, Bot, FileBarChart, History,
  UserCircle, ShieldAlert, BarChart3, Layers,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { useAuth, AppRole } from '@/hooks/useAuth';

type Item = { title: string; url: string; icon: any; roles?: AppRole[] };

const nav: { label: string; items: Item[] }[] = [
  {
    label: 'Pilotage',
    items: [
      { title: 'Tableau de bord', url: '/admin', icon: LayoutDashboard },
      { title: 'Statistiques', url: '/admin/stats', icon: PieChart, roles: ['super_admin', 'associe', 'comptable'] },
    ],
  },
  {
    label: 'Activité',
    items: [
      { title: 'Projets', url: '/admin/projets', icon: FolderKanban },
      { title: 'Modèles', url: '/admin/modeles', icon: Layers, roles: ['super_admin', 'associe', 'chef_projet'] },
      { title: 'Domaines', url: '/admin/domaines', icon: Building2 },
      { title: 'Clients (CRM)', url: '/admin/clients', icon: UsersRound },
    ],
  },
  {
    label: 'Finances',
    items: [
      { title: 'Finances', url: '/admin/finances', icon: Coins, roles: ['super_admin', 'associe', 'comptable'] },
      { title: 'Factures', url: '/admin/factures', icon: Receipt, roles: ['super_admin', 'associe', 'comptable', 'chef_projet'] },
      { title: 'Caisse', url: '/admin/caisse', icon: Wallet, roles: ['super_admin', 'associe', 'comptable'] },
      { title: 'Dividendes', url: '/admin/dividendes', icon: PieChart, roles: ['super_admin', 'associe'] },
    ],
  },
  {
    label: 'Moteur financier',
    items: [
      { title: 'Règles', url: '/admin/finances/regles', icon: Scale, roles: ['super_admin'] },
      { title: 'Scénarios', url: '/admin/finances/scenarios', icon: FlaskConical, roles: ['super_admin'] },
      { title: 'Validations', url: '/admin/finances/validations', icon: CheckSquare, roles: ['super_admin', 'associe'] },
      { title: 'Commissions', url: '/admin/finances/commissions', icon: Percent, roles: ['super_admin', 'associe', 'comptable'] },
      { title: 'Apporteurs', url: '/admin/finances/apporteurs', icon: Handshake, roles: ['super_admin', 'associe'] },
      { title: 'Prestataires', url: '/admin/finances/prestataires', icon: Hammer, roles: ['super_admin', 'associe'] },
      { title: 'Agents IA', url: '/admin/finances/ia', icon: Bot, roles: ['super_admin'] },
      { title: 'Rapports IA', url: '/admin/finances/rapports', icon: FileBarChart, roles: ['super_admin', 'associe', 'comptable'] },
      { title: 'Historique IA', url: '/admin/finances/historique-ia', icon: History, roles: ['super_admin', 'associe', 'comptable'] },
      { title: 'Statistiques IA', url: '/admin/finances/stats-ia', icon: BarChart3, roles: ['super_admin', 'associe', 'comptable'] },
    ],
  },
  {
    label: 'Équipe',
    items: [
      { title: 'Utilisateurs', url: '/admin/users', icon: Users, roles: ['super_admin'] },
      { title: 'Mon compte', url: '/admin/mon-compte', icon: UserCircle },
    ],
  },
  {
    label: 'Système',
    items: [
      { title: 'Documents', url: '/admin/documents', icon: FileText },
      { title: 'Journal', url: '/admin/journal', icon: Activity, roles: ['super_admin', 'associe', 'comptable'] },
      { title: 'Audit global', url: '/admin/audit', icon: ShieldAlert, roles: ['super_admin'] },
      { title: 'Paramètres', url: '/admin/parametres', icon: Settings, roles: ['super_admin'] },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { pathname } = useLocation();
  const { hasRole, roles } = useAuth();

  const isActive = (url: string) =>
    url === '/admin' ? pathname === '/admin' : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5">
      <SidebarHeader className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">SKAL SERVICES</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Console interne</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#0a0a0a]">
        {nav.map((group) => {
          const visible = group.items.filter(
            (i) => !i.roles || roles.length === 0 || hasRole(i.roles)
          );
          if (visible.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              {!collapsed && (
                <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-white/30">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {visible.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink
                          to={item.url}
                          className={({ isActive: a }) =>
                            `flex items-center gap-3 rounded-md transition-colors ${
                              a
                                ? 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/20'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`
                          }
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          {!collapsed && <span className="text-sm">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}