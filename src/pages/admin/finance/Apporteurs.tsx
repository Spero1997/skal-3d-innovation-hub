import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function Apporteurs() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', contact_email: '', default_commission_rate: 10 });

  const load = async () => {
    const { data } = await supabase.from('apporteurs_affaires').select('*').order('name');
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name.trim()) return;
    const { error } = await supabase.from('apporteurs_affaires').insert(form);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setForm({ name: '', contact_email: '', default_commission_rate: 10 });
    load();
  };
  const toggle = async (it: any) => {
    await supabase.from('apporteurs_affaires').update({ is_active: !it.is_active }).eq('id', it.id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm('Supprimer ?')) return;
    await supabase.from('apporteurs_affaires').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Apporteurs d'affaires</h1>
        <p className="text-sm text-white/60">Annuaire et taux par défaut.</p>
      </div>
      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-2 p-4 sm:grid-cols-4">
          <Input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          <Input type="number" placeholder="Taux %" value={form.default_commission_rate} onChange={(e) => setForm({ ...form, default_commission_rate: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
          <Button onClick={add} className="bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {items.map((it) => (
          <Card key={it.id} className="border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div>
                <CardTitle className="text-sm text-white">{it.name}</CardTitle>
                <p className="text-xs text-white/50">{it.contact_email} · {it.default_commission_rate}%</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={it.is_active} onCheckedChange={() => toggle(it)} />
                <Button size="sm" variant="outline" onClick={() => del(it.id)}><Trash2 className="h-3.5 w-3.5 text-red-400" /></Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
