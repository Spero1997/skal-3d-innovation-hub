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
  const [mode, setMode] = useState<'single' | 'all'>('all');
  const [distributionCase, setDistributionCase] = useState<string>('');
  const [apporteur, setApporteur] = useState<string>('');
  const [niveau, setNiveau] = useState<string>('');
  const [domaineGroupe, setDomaineGroupe] = useState<string>('');
  const [allResult, setAllResult] = useState<any>(null);

  const load = async () => {
    const { data: rs } = await supabase.from('finance_rule_sets').select('id, name').order('name');
    setRuleSets(rs ?? []);
    const { data: sc } = await supabase.from('financial_scenarios').select('*').order('created_at', { ascending: false });
    setScenarios(sc ?? []);
  };
  useEffect(() => { load(); }, []);

  const simulate = async () => {
    if (!ruleSetId) return;
    if (mode === 'all') {
      const { data, error } = await supabase.rpc('simulate_rule_set_all_cases' as any, { _rule_set_id: ruleSetId, _amount: gross });
      if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      setAllResult(data);
      setResult(null);
    } else {
      const ctx: Record<string, string> = {};
      if (distributionCase) ctx.distribution_case = distributionCase;
      if (apporteur) ctx.apporteur = apporteur;
      if (niveau) ctx.niveau = niveau;
      if (domaineGroupe) ctx.domaine_groupe = domaineGroupe;
      const { data, error } = await supabase.rpc('simulate_rule_set' as any, { _rule_set_id: ruleSetId, _amount: gross, _context: ctx });
      if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      setResult(data);
      setAllResult(null);
    }
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

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Simulateur de scénarios</h1>
        <p className="text-sm text-white/60">Teste un jeu de règles avant activation.</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={mode} onValueChange={(v: any) => setMode(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les cas (comparaison)</SelectItem>
              <SelectItem value="single">Un cas précis</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ruleSetId} onValueChange={setRuleSetId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Jeu de règles" />
            </SelectTrigger>
            <SelectContent>
              {ruleSets.map((rs) => <SelectItem key={rs.id} value={rs.id}>{rs.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} placeholder="Montant brut (FCFA)" className="bg-white/5 border-white/10 text-white" />
          <Button onClick={simulate} className="bg-orange-500 hover:bg-orange-600">
            <PlayCircle className="h-4 w-4 mr-1" /> Simuler
          </Button>
          {mode === 'single' && (
            <>
              <Select value={distributionCase || 'none'} onValueChange={(v) => setDistributionCase(v === 'none' ? '' : v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Cas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Cas (aucun) —</SelectItem>
                  <SelectItem value="cas1_interne">CAS 1 — Interne</SelectItem>
                  <SelectItem value="cas2_forfait">CAS 2 — Forfait prestataire</SelectItem>
                  <SelectItem value="cas3_au_cout">CAS 3 — Publicité / com</SelectItem>
                </SelectContent>
              </Select>
              <Select value={apporteur || 'none'} onValueChange={(v) => setApporteur(v === 'none' ? '' : v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Apporteur" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Apporteur (aucun) —</SelectItem>
                  <SelectItem value="jonas">Jonas</SelectItem>
                  <SelectItem value="investisseur">Investisseur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={niveau || 'none'} onValueChange={(v) => setNiveau(v === 'none' ? '' : v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Niveau Jonas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Niveau —</SelectItem>
                  <SelectItem value="1">Niveau 1</SelectItem>
                  <SelectItem value="2">Niveau 2</SelectItem>
                  <SelectItem value="3">Niveau 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={domaineGroupe || 'none'} onValueChange={(v) => setDomaineGroupe(v === 'none' ? '' : v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Domaine (investisseur)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Domaine —</SelectItem>
                  <SelectItem value="technique">Technique (BTP / géo / archi)</SelectItem>
                  <SelectItem value="spero">Spero (graphisme / IA / web)</SelectItem>
                  <SelectItem value="mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
            <Input placeholder="Nom scénario" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            <Button onClick={save} variant="outline"><Save className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {allResult?.cases && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader><CardTitle className="text-base text-white">Comparaison de tous les cas — {fmt(gross)}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {allResult.cases.map((c: any) => (
              <div key={c.rule_id} className="rounded border border-white/10 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white">{c.rule_name}</div>
                  <div className="text-[11px] text-white/50">priorité {c.priority}</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-1 text-xs text-white/80">
                  {c.allocations.map((a: any, i: number) => (
                    <div key={i} className="flex justify-between border-b border-white/5 py-1">
                      <span>{a.label || a.beneficiary_type} {a.percent ? `(${a.percent}%)` : ''}</span>
                      <span className="font-mono">{fmt(Number(a.amount))}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
