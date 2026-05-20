import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Save, PlayCircle } from 'lucide-react';
import { SuperAdminGuard } from '@/components/admin/finance/rules/Guard';

type Allocation = {
  beneficiary_type: string;
  beneficiary_label?: string;
  basis: 'gross' | 'net_after_caisse' | 'net_after_costs';
  percent?: number;
  fixed_amount?: number;
};

type Rule = {
  id: string;
  rule_set_id: string;
  name: string;
  priority: number;
  condition: any;
  allocations: Allocation[];
  requires_validation: boolean;
  notes: string | null;
  case_description: string | null;
};

const BENEFICIARY_TYPES = [
  'caisse', 'spero', 'associe', 'apporteur_affaires',
  'prestataire_interne', 'prestataire_externe', 'commission_commercial',
  'dividende_pool', 'custom',
];

function Content() {
  const { id } = useParams();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [simAmount, setSimAmount] = useState(1000000);
  const [simResult, setSimResult] = useState<any>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data } = await supabase
      .from('finance_rules').select('*').eq('rule_set_id', id).order('priority');
    setRules((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const addRule = async () => {
    if (!id) return;
    const { error } = await supabase.from('finance_rules').insert({
      rule_set_id: id,
      name: 'Nouvelle règle',
      priority: (rules.length > 0 ? rules[rules.length - 1].priority : 0) + 10,
      condition: {},
      allocations: [],
    });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    load();
  };

  const updateRule = (idx: number, patch: Partial<Rule>) => {
    setRules((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const saveRule = async (r: Rule) => {
    const { error } = await supabase
      .from('finance_rules')
      .update({
        name: r.name,
        priority: r.priority,
        condition: r.condition,
        allocations: r.allocations,
        requires_validation: r.requires_validation,
        notes: r.notes,
        case_description: r.case_description,
      })
      .eq('id', r.id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: 'Sauvegardé' });
  };

  const deleteRule = async (rid: string) => {
    if (!confirm('Supprimer cette règle ?')) return;
    await supabase.from('finance_rules').delete().eq('id', rid);
    load();
  };

  const simulate = async () => {
    if (!id) return;
    const { data, error } = await supabase.rpc('simulate_rule_set' as any, {
      _rule_set_id: id,
      _gross: simAmount,
    });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setSimResult(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" asChild>
          <Link to="/admin/finances/regles"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-white">Éditeur de règles</h1>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-base text-white">Simulateur rapide</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label className="text-xs text-white/60">Montant brut (FCFA)</Label>
            <Input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <Button onClick={simulate} className="bg-orange-500 hover:bg-orange-600">
            <PlayCircle className="mr-1 h-4 w-4" /> Simuler
          </Button>
          {simResult && (
            <pre className="flex-1 overflow-auto rounded bg-black/40 p-3 text-[11px] text-white/80">
              {JSON.stringify(simResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={addRule} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-1 h-4 w-4" /> Ajouter une règle
        </Button>
      </div>

      {loading && <p className="text-white/50 text-sm">Chargement…</p>}

      <div className="space-y-4">
        {rules.map((r, idx) => (
          <Card key={r.id} className="border-white/10 bg-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 gap-2">
                  <Input
                    value={r.name}
                    onChange={(e) => updateRule(idx, { name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white max-w-md"
                  />
                  <Input
                    type="number"
                    value={r.priority}
                    onChange={(e) => updateRule(idx, { priority: Number(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white w-24"
                    title="Priorité (plus petit = évalué d'abord)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <Switch
                      checked={r.requires_validation}
                      onCheckedChange={(v) => updateRule(idx, { requires_validation: v })}
                    />
                    Validation
                  </label>
                  <Button size="sm" variant="outline" onClick={() => saveRule(r)}>
                    <Save className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteRule(r.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-white/60">
                  Description du cas <span className="text-orange-400">(obligatoire — explique en clair quand cette règle s'applique)</span>
                </Label>
                <Textarea
                  value={r.case_description ?? ''}
                  onChange={(e) => updateRule(idx, { case_description: e.target.value })}
                  rows={3}
                  placeholder="Ex : Cas 1 — Service rendu 100% en interne par SKAL. Le client paie tout. On garde 15% en caisse, 70% pour le webmaster/graphiste opérationnel, 15% pour l'associé."
                  className="text-sm bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-xs text-white/60">Conditions (JSON)</Label>
                <Textarea
                  value={JSON.stringify(r.condition, null, 2)}
                  onChange={(e) => {
                    try { updateRule(idx, { condition: JSON.parse(e.target.value) }); }
                    catch { /* ignore parse errors */ }
                  }}
                  className="font-mono text-xs bg-black/30 border-white/10 text-white min-h-[80px]"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  Clés acceptées : project_domain, project_type, amount_min, amount_max, has_apporteur, has_prestataire_externe, involvement_level.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-white/60">Allocations</Label>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => updateRule(idx, {
                      allocations: [...r.allocations, { beneficiary_type: 'caisse', basis: 'gross', percent: 10 }],
                    })}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Ajouter
                  </Button>
                </div>
                <div className="space-y-2">
                  {r.allocations.map((a, ai) => (
                    <div key={ai} className="grid grid-cols-12 gap-2 items-center">
                      <Select
                        value={a.beneficiary_type}
                        onValueChange={(v) => {
                          const next = [...r.allocations];
                          next[ai] = { ...a, beneficiary_type: v };
                          updateRule(idx, { allocations: next });
                        }}
                      >
                        <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BENEFICIARY_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select
                        value={a.basis}
                        onValueChange={(v: any) => {
                          const next = [...r.allocations];
                          next[ai] = { ...a, basis: v };
                          updateRule(idx, { allocations: next });
                        }}
                      >
                        <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gross">Brut</SelectItem>
                          <SelectItem value="net_after_caisse">Net après caisse</SelectItem>
                          <SelectItem value="net_after_costs">Net après coûts</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number" placeholder="%"
                        value={a.percent ?? ''}
                        onChange={(e) => {
                          const next = [...r.allocations];
                          next[ai] = { ...a, percent: e.target.value ? Number(e.target.value) : undefined };
                          updateRule(idx, { allocations: next });
                        }}
                        className="col-span-2 bg-white/5 border-white/10 text-white text-xs"
                      />
                      <Input
                        type="number" placeholder="Montant fixe"
                        value={a.fixed_amount ?? ''}
                        onChange={(e) => {
                          const next = [...r.allocations];
                          next[ai] = { ...a, fixed_amount: e.target.value ? Number(e.target.value) : undefined };
                          updateRule(idx, { allocations: next });
                        }}
                        className="col-span-3 bg-white/5 border-white/10 text-white text-xs"
                      />
                      <Button
                        size="sm" variant="ghost"
                        onClick={() => updateRule(idx, { allocations: r.allocations.filter((_, k) => k !== ai) })}
                        className="col-span-1"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Notes internes"
                value={r.notes ?? ''}
                onChange={(e) => updateRule(idx, { notes: e.target.value })}
                className="text-xs bg-white/5 border-white/10 text-white"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RuleEditor() {
  return <SuperAdminGuard><Content /></SuperAdminGuard>;
}
