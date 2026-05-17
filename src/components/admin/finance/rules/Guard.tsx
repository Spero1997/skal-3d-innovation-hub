import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export function SuperAdminGuard({ children }: { children: ReactNode }) {
  const { hasRole, loading } = useAuth();
  if (loading) return null;
  if (!hasRole('super_admin')) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-8 text-center text-white/70">
          <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-orange-400" />
          <p className="text-sm">Accès réservé au Super Admin.</p>
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}
