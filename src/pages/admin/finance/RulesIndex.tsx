import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Plus, Copy, Settings2 } from 'lucide-react';
import { SuperAdminGuard } from '@/components/admin/finance/rules/Guard';

type RuleSet = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  version: number;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
};

type RuleRow = {
  id: string;
  rule_set_id: string;
  name: string;
  priority: number;
  case_description: string | null;
  requires_validation: boolean;
};

function Content() {
  const [items, setItems] = useState<RuleSet[]>([]);
  const [rulesBySet, setRulesBySet] = useState<Record<string, RuleRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('finance_rule_sets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    const sets = (data as RuleSet[]) ?? [];
    setItems(sets);
    if (sets.length > 0) {
      const { data: rules } = await supabase
        .from('finance_rules')
        .select('id, rule_set_id, name, priority, case_description, requires_validation')
        .in('rule_set_id', sets.map(s => s.id))
        .order('priority');
      const grouped: Record<string, RuleRow[]> = {};
      ((rules as any[]) ?? []).forEach(r => {
        (grouped[r.rule_set_id] ??= []).push(r as RuleRow);
      });
      setRulesBySet(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from('finance_rule_sets').insert({ name: newName.trim() });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setNewName('');
    toast({ title: 'Jeu de règles créé' });
    load();
  };

  const toggle = async (rs: RuleSet) => {
    const { error } = await supabase
      .from('finance_rule_sets')
      .update({ is_active: !rs.is_active })
      .eq('id', rs.id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    load();
  };

  const duplicate = async (rs: RuleSet) => {
    const { data: rules } = await supabase.from('finance_rules').select('*').eq('rule_set_id', rs.id);
    const { data: created, error } = await supabase
      .from('finance_rule_sets')
      .insert({ name: `${rs.name} (copie)`, description: rs.description, version: rs.version + 1 })
      .select()
      .single();
    if (error || !created) return toast({ title: 'Erreur', description: error?.message, variant: 'destructive' });
    if (rules && rules.length > 0) {
      await supabase.from('finance_rules').insert(
        rules.map((r: any) => ({
          rule_set_id: created.id,
          name: r.name,
          priority: r.priority,
          condition: r.condition,
          allocations: r.allocations,
          requires_validation: r.requires_validation,
          notes: r.notes,
        }))
      );
    }
    toast({ title: 'Dupliqué' });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Règles financières</h1>
        <p className="text-sm text-white/60">Modèles de répartition versionnés. Un seul actif à la fois recommandé.</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="flex gap-2 p-4">
          <Input
            placeholder="Nom du nouveau jeu (ex: Modèle BTP 2026)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
          <Button onClick={create} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-1 h-4 w-4" /> Créer
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {loading && <p className="text-white/50 text-sm">Chargement…</p>}
        {!loading && items.length === 0 && (
          <p className="text-white/50 text-sm">Aucun jeu de règles.</p>
        )}
        {items.map((rs) => (
          <Card key={rs.id} className="border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  {rs.name}
                  <Badge variant="outline" className="text-[10px]">v{rs.version}</Badge>
                  {rs.is_active && <Badge className="bg-green-500/20 text-green-400 border-0">actif</Badge>}
                </CardTitle>
                {rs.description && <p className="text-xs text-white/50 mt-1">{rs.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={rs.is_active} onCheckedChange={() => toggle(rs)} />
                <Button size="sm" variant="outline" onClick={() => duplicate(rs)}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" asChild className="bg-orange-500 hover:bg-orange-600">
                  <Link to={`/admin/finances/regles/${rs.id}`}>
                    <Settings2 className="mr-1 h-3.5 w-3.5" /> Éditer
                  </Link>
                </Button>
              </div>
            </CardHeader>
            {(rulesBySet[rs.id]?.length ?? 0) > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {rulesBySet[rs.id].map(r => (
                    <div key={r.id} className="rounded-md border border-white/5 bg-black/30 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">P{r.priority}</Badge>
                        <span className="text-sm font-medium text-white">{r.name}</span>
                        {r.requires_validation && (
                          <Badge className="bg-amber-500/15 text-amber-300 border-0 text-[10px]">validation</Badge>
                        )}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line">
                        {r.case_description || <span className="italic text-white/30">Aucune description du cas. Édite la règle pour expliquer son fonctionnement.</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RulesIndex() {
  return <SuperAdminGuard><Content /></SuperAdminGuard>;
}
