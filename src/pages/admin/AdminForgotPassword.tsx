import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error('Erreur', { description: error.message });
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      <Card className="w-full max-w-md p-8 bg-[#111111]/90 border-white/10">
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <h1 className="text-2xl font-bold mb-2">Mot de passe oublié</h1>
        <p className="text-sm text-white/50 mb-6">Vous recevrez un lien de réinitialisation par email.</p>

        {sent ? (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 mx-auto text-orange-500 mb-4" />
            <p className="text-white/80">Si ce compte existe, un email a été envoyé à <strong>{email}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer le lien'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}