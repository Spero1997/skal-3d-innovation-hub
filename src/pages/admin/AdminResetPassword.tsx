import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Mot de passe trop court (8 caractères min)');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error('Erreur', { description: error.message });
    toast.success('Mot de passe mis à jour');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      <Card className="w-full max-w-md p-8 bg-[#111111]/90 border-white/10">
        <h1 className="text-2xl font-bold mb-6">Nouveau mot de passe</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/80">Nouveau mot de passe</Label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mettre à jour'}
          </Button>
        </form>
      </Card>
    </div>
  );
}