import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate('/admin', { replace: true });
  }, [user, authLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error('Échec de connexion', { description: error.message });
      return;
    }
    toast.success('Bienvenue');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

      <Card className="relative w-full max-w-md p-8 bg-[#111111]/90 border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Espace Direction</h1>
          <p className="text-sm text-white/50 mt-1">SKAL SERVICES SARL — Accès interne</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-orange-500"
                placeholder="vous@skalservice.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/80">Mot de passe</Label>
              <Link to="/admin/forgot-password" className="text-xs text-orange-400 hover:text-orange-300">
                Oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-orange-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-500/30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Se connecter'}
          </Button>
        </form>

        <p className="text-xs text-white/40 text-center mt-6">
          Accès strictement réservé aux dirigeants, associés, comptables et chefs de projet.
        </p>
      </Card>
    </div>
  );
}