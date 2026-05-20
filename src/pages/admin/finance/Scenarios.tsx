import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { PlayCircle, Save } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { SuperAdminGuard } from '@/components/admin/finance/rules/Guard';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f59e0b', '#14b8a6'];

function Content() {
  const [ruleSets, setRuleSets] = useState<any[]>([]);
  const [ruleSetId, setRuleSetId] = useState<string>('');
  const [gross, setGross] = useState(1000000);
  const [result, setResult] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [name, setName] = useState('');

  const load = async () => {
    const { data: rs } = await supabase.from('finance_rule_sets').select('id, name').order('name');
    setRuleSets(rs ?? []);
    const { data: sc } = await supabase.from('financial_scenarios').select('*').order('created_at', { ascending: false });
    setScenarios(sc ?? []);
  };
  useEffect(() => { load(); }, []);

  const simulate = async () => {
    if (!ruleSetId) return;
    const { data, error } = await supabase.rpc('simulate_rule_set' as any, { _rule_set_id: ruleSetId, _amount: gross, _context: {} });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setResult(data);
  };

  const save = async () => {
    if (!name.trim() || !result) return;
    const { error } = await supabase.from('financial_scenarios').insert({
      name, rule_set_id: ruleSetId, params: { gross }, result,
    });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setName('');
    toast({ title: 'Scénario sauvegardé' });
    load();
  };

  const chartData = result?.allocations
    ? result.allocations.map((a: any) => ({
        name: a.beneficiary_label || a.beneficiary_type,
        amount: Number(a.amount),
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Simulateur de scénarios</h1>
        <p className="text-sm text-white/60">Teste un jeu de règles avant activation.</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-2 p-4 sm:grid-cols-4">
          <Select value={ruleSetId} onValueChange={setRuleSetId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Jeu de règles" />
            </SelectTrigger>
            <SelectContent>
              {ruleSets.map((rs) => <SelectItem key={rs.id} value={rs.id}>{rs.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} className="bg-white/5 border-white/10 text-white" />
          <Button onClick={simulate} className="bg-orange-500 hover:bg-orange-600">
            <PlayCircle className="h-4 w-4 mr-1" /> Simuler
          </Button>
          <div className="flex gap-2">
            <Input placeholder="Nom scénario" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            <Button onClick={save} variant="outline"><Save className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader><CardTitle className="text-base text-white">Résultat</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff80" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#ffffff80" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', color: '#fff' }} />
                  <Bar dataKey="amount">
                    {chartData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <pre className="mt-3 text-[11px] text-white/70 bg-black/30 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle className="text-base text-white">Scénarios sauvegardés</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {scenarios.length === 0 && <p className="text-white/50 text-sm">Aucun scénario.</p>}
          {scenarios.map((s) => (
            <div key={s.id} className="flex justify-between text-sm text-white/80">
              <span>{s.name}</span>
              <button className="text-orange-400 hover:underline" onClick={() => setResult(s.result)}>Charger</button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Scenarios() {
  return <SuperAdminGuard><Content /></SuperAdminGuard>;
}
