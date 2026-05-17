import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';

export default function Rapports() {
  const { hasRole } = useAuth();
  const [period, setPeriod] = useState('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!hasRole(['super_admin', 'associe', 'comptable'])) {
    return <p className="text-white/60 text-sm">Accès réservé à la direction.</p>;
  }

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const { data, error } = await supabase.functions.invoke('ai-generate-financial-report', {
      body: { period, from: from || undefined, to: to || undefined },
    });
    setLoading(false);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setResult(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rapports financiers IA</h1>
        <p className="text-sm text-white/60">Génération respectant ton niveau d'accès.</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
          <div>
            <Label className="text-xs text-white/60">Période</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mois en cours</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-white/60">Du</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-xs text-white/60">Au</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="flex items-end">
            <Button onClick={generate} disabled={loading} className="bg-orange-500 hover:bg-orange-600 w-full">
              <Sparkles className="h-4 w-4 mr-1" />
              {loading ? 'Génération…' : 'Générer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Rapport</CardTitle>
            {result.level && <Badge variant="outline">Niveau : {result.level}</Badge>}
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{result.report ?? ''}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
