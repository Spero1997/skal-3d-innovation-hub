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

function Content() {
  const [items, setItems] = useState<RuleSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('finance_rule_sets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setItems((data as RuleSet[]) ?? []);
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
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RulesIndex() {
  return <SuperAdminGuard><Content /></SuperAdminGuard>;
}
