import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function Prestataires() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', kind: 'externe', speciality: '', default_rate: 0 });

  const load = async () => {
    const { data } = await supabase.from('prestataires').select('*').order('name');
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name.trim()) return;
    const { error } = await supabase.from('prestataires').insert(form);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setForm({ name: '', kind: 'externe', speciality: '', default_rate: 0 });
    load();
  };
  const toggle = async (it: any) => {
    await supabase.from('prestataires').update({ is_active: !it.is_active }).eq('id', it.id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm('Supprimer ?')) return;
    await supabase.from('prestataires').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Prestataires</h1>
        <p className="text-sm text-white/60">Internes & externes.</p>
      </div>
      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-2 p-4 sm:grid-cols-5">
          <Input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="interne">Interne</SelectItem>
              <SelectItem value="externe">Externe</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Spécialité" value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          <Input type="number" placeholder="Taux/coût" value={form.default_rate} onChange={(e) => setForm({ ...form, default_rate: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
          <Button onClick={add} className="bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {items.map((it) => (
          <Card key={it.id} className="border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  {it.name}
                  <Badge variant="outline" className="text-[10px]">{it.kind}</Badge>
                </CardTitle>
                <p className="text-xs text-white/50">{it.speciality} · {it.default_rate}</p>
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
