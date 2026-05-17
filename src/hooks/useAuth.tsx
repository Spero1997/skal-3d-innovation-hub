import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'super_admin' | 'associe' | 'comptable' | 'chef_projet' | 'secretaire';

interface AuthCtx {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  rolesLoading: boolean;
  signOut: () => Promise<void>;
  hasRole: (r: AppRole | AppRole[]) => boolean;
  refreshRoles: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const fetchRoles = async (uid: string) => {
    setRolesLoading(true);
    try {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', uid);
      setRoles((data ?? []).map((r: any) => r.role as AppRole));
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    // Setup listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setRolesLoading(true);
        // defer to avoid recursion
        setTimeout(() => fetchRoles(sess.user.id), 0);
      } else {
        setRoles([]);
        setRolesLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchRoles(data.session.user.id);
      } else {
        setRolesLoading(false);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
  };

  const hasRole = (r: AppRole | AppRole[]) => {
    const arr = Array.isArray(r) ? r : [r];
    return arr.some((x) => roles.includes(x));
  };

  const refreshRoles = async () => {
    if (user) await fetchRoles(user.id);
  };

  return (
    <Ctx.Provider value={{ user, session, roles, loading, rolesLoading, signOut, hasRole, refreshRoles }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
};