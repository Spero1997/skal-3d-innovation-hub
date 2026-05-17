import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

export default function Commissions() {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from('commissions').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: 'valide' | 'paye') => {
    const patch: any = { status };
    if (status === 'paye') patch.paid_at = new Date().toISOString();
    const { error } = await supabase.from('commissions').update(patch).eq('id', id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    load();
  };

  const totals = items.reduce(
    (acc, c) => {
      acc.total += Number(c.amount);
      if (c.status === 'a_valider') acc.aValider += Number(c.amount);
      if (c.status === 'valide') acc.valide += Number(c.amount);
      if (c.status === 'paye') acc.paye += Number(c.amount);
      return acc;
    },
    { total: 0, aValider: 0, valide: 0, paye: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Commissions</h1>
        <p className="text-sm text-white/60">Générées par le moteur de règles.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', v: totals.total },
          { label: 'À valider', v: totals.aValider },
          { label: 'Validées', v: totals.valide },
          { label: 'Payées', v: totals.paye },
        ].map((k) => (
          <Card key={k.label} className="border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-white/50">{k.label}</p>
              <p className="text-lg font-bold text-white">{fmt(k.v)} F</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((c) => (
          <Card key={c.id} className="border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Badge variant="outline">{c.beneficiary_type}</Badge>
                  {c.beneficiary_label ?? '—'}
                  <Badge className={
                    c.status === 'paye' ? 'bg-green-500/20 text-green-400 border-0'
                    : c.status === 'valide' ? 'bg-blue-500/20 text-blue-400 border-0'
                    : 'bg-orange-500/20 text-orange-400 border-0'
                  }>{c.status}</Badge>
                </CardTitle>
                <p className="text-xs text-white/50">{fmt(Number(c.amount))} FCFA</p>
              </div>
              <div className="flex gap-2">
                {c.status === 'a_valider' && (
                  <Button size="sm" onClick={() => setStatus(c.id, 'valide')} className="bg-blue-600 hover:bg-blue-700">
                    Valider
                  </Button>
                )}
                {c.status === 'valide' && (
                  <Button size="sm" onClick={() => setStatus(c.id, 'paye')} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-3.5 w-3.5 mr-1" /> Marquer payée
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
        {items.length === 0 && <p className="text-white/50 text-sm">Aucune commission.</p>}
      </div>
    </div>
  );
}
