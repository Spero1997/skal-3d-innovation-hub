import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { NotificationBell } from './notifications/NotificationBell';
import { GlobalSearch } from './GlobalSearch';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const { user, loading, roles, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  // Connecté mais sans rôle interne attribué
  if (roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Accès en attente</h1>
          <p className="text-white/60">
            Votre compte est créé mais aucun rôle interne ne vous a été attribué.
            Contactez la direction pour obtenir vos accès.
          </p>
          <Button onClick={() => signOut().then(() => navigate('/admin/login'))} variant="outline">
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  const initials = (user.email ?? '?').slice(0, 2).toUpperCase();

  return (
    <div className="dark">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#0a0a0a] text-white">
          <AdminSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center px-4 gap-3">
              <SidebarTrigger className="text-white/60 hover:text-white" />

              <div className="hidden md:flex flex-1 max-w-md ml-2">
                <GlobalSearch />
              </div>

              <div className="flex-1 md:hidden" />

              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-md transition-colors">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-orange-500/20 text-orange-400 text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-white/50">
                        {roles.map((r) => roleLabel(r)).join(' · ')}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => signOut().then(() => navigate('/admin/login'))}
                    className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

function roleLabel(r: string) {
  const map: Record<string, string> = {
    super_admin: 'Super Admin',
    associe: 'Associé',
    comptable: 'Comptable',
    chef_projet: 'Chef de projet',
  };
  return map[r] ?? r;
}