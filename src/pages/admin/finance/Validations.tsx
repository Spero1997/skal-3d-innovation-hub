import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Validations() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('financial_validations')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const decide = async (id: string, status: 'validee' | 'rejetee') => {
    const { error } = await supabase
      .from('financial_validations')
      .update({ status, validator_id: user?.id, validated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: status === 'validee' ? 'Validé' : 'Rejeté' });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">File de validations</h1>
        <p className="text-sm text-white/60">Distributions et commissions en attente de décision.</p>
      </div>
      {loading && <p className="text-white/50 text-sm">Chargement…</p>}
      {!loading && items.length === 0 && <p className="text-white/50 text-sm">Aucune validation en attente.</p>}
      <div className="space-y-3">
        {items.map((it) => (
          <Card key={it.id} className="border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Badge variant="outline">{it.entity_type}</Badge>
                <span className="font-mono text-xs text-white/60">{it.entity_id.slice(0, 8)}</span>
                <Badge className={
                  it.status === 'en_attente' ? 'bg-orange-500/20 text-orange-400 border-0'
                  : it.status === 'validee' ? 'bg-green-500/20 text-green-400 border-0'
                  : 'bg-red-500/20 text-red-400 border-0'
                }>{it.status}</Badge>
              </CardTitle>
              {it.status === 'en_attente' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide(it.id, 'validee')} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => decide(it.id, 'rejetee')}>
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              )}
            </CardHeader>
            {it.context && Object.keys(it.context).length > 0 && (
              <CardContent>
                <pre className="text-[11px] text-white/70 bg-black/30 p-2 rounded overflow-auto">
                  {JSON.stringify(it.context, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
