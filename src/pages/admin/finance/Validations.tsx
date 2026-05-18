import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatXOF } from '@/lib/projects';

export default function Validations() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

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

  const decide = async (id: string, status: 'approuvee' | 'rejetee') => {
    const { error } = await supabase
      .from('financial_validations')
      .update({ status, validator_id: user?.id, validated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: status === 'approuvee' ? 'Validé' : 'Rejeté' });
    load();
  };

  const generateAi = async (id: string) => {
    setBusy(id);
    const { data, error } = await supabase.functions.invoke('ai-suggest-distribution', {
      body: { validation_id: id },
    });
    setBusy(null);
    if (error || (data as any)?.error) {
      return toast({ title: 'Erreur IA', description: error?.message || (data as any)?.error, variant: 'destructive' });
    }
    toast({ title: 'Suggestion IA générée' });
    load();
  };

  const applyAi = async (id: string) => {
    setBusy(id);
    const { error } = await supabase.rpc('apply_ai_distribution', { _validation_id: id });
    setBusy(null);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: 'Répartition appliquée' });
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
        {items.map((it) => {
          const isAi = it.entity_type === 'transaction_ai_suggestion';
          const sug = it.context?.ai_suggestion;
          return (
          <Card key={it.id} className="border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Badge variant="outline">{it.entity_type}</Badge>
                <span className="font-mono text-xs text-white/60">{it.entity_id.slice(0, 8)}</span>
                <Badge className={
                  it.status === 'en_attente' ? 'bg-orange-500/20 text-orange-400 border-0'
                  : it.status === 'approuvee' ? 'bg-green-500/20 text-green-400 border-0'
                  : 'bg-red-500/20 text-red-400 border-0'
                }>{it.status}</Badge>
              </CardTitle>
              {it.status === 'en_attente' && (
                <div className="flex gap-2">
                  {isAi && !sug && (
                    <Button size="sm" disabled={busy === it.id} onClick={() => generateAi(it.id)} className="bg-orange-500 hover:bg-orange-600">
                      {busy === it.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Sparkles className="h-3.5 w-3.5 mr-1" />Générer IA</>}
                    </Button>
                  )}
                  {isAi && sug && (
                    <Button size="sm" disabled={busy === it.id} onClick={() => applyAi(it.id)} className="bg-green-600 hover:bg-green-700">
                      <Check className="h-3.5 w-3.5 mr-1" /> Appliquer
                    </Button>
                  )}
                  {!isAi && (
                    <Button size="sm" onClick={() => decide(it.id, 'approuvee')} className="bg-green-600 hover:bg-green-700">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => decide(it.id, 'rejetee')}>
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              )}
            </CardHeader>
            {it.context && Object.keys(it.context).length > 0 && (
              <CardContent className="space-y-3">
                {isAi && (
                  <div className="text-xs text-white/70 space-y-1">
                    <div>Montant brut : <span className="text-white font-semibold">{formatXOF(Number(it.context.amount ?? 0))}</span></div>
                    <div>Caisse 15% (déjà bookée) : <span className="text-orange-400 font-semibold">{formatXOF(Number(it.context.caisse_booked ?? 0))}</span></div>
                    <div>Restant à répartir : <span className="text-white font-semibold">{formatXOF(Number(it.context.remaining_to_split ?? 0))}</span></div>
                  </div>
                )}
                {sug && (
                  <div className="p-3 rounded bg-orange-500/5 border border-orange-500/20 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Suggestion IA
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-white/60">Spero</span><span className="text-blue-400 font-semibold text-right">{formatXOF(sug.spero)} ({sug.spero_percent_of_remaining}%)</span>
                      <span className="text-white/60">Associé</span><span className="text-emerald-400 font-semibold text-right">{formatXOF(sug.associe)} ({sug.associe_percent_of_remaining}%)</span>
                      {sug.prestataire > 0 && <>
                        <span className="text-white/60">Prestataire</span><span className="text-fuchsia-400 font-semibold text-right">{formatXOF(sug.prestataire)} ({sug.prestataire_percent_of_remaining}%)</span>
                      </>}
                    </div>
                    {sug.rationale && <p className="text-[11px] text-white/50 italic border-t border-white/5 pt-2">{sug.rationale}</p>}
                  </div>
                )}
                {!isAi && (
                  <pre className="text-[11px] text-white/70 bg-black/30 p-2 rounded overflow-auto">
                    {JSON.stringify(it.context, null, 2)}
                  </pre>
                )}
              </CardContent>
            )}
          </Card>
        );})}
      </div>
    </div>
  );
}
