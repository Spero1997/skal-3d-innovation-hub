import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Sparkles, FileDown, FileSpreadsheet, Save, History, TrendingDown, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from 'recharts';

export default function Rapports() {
  const { hasRole } = useAuth();
  const [period, setPeriod] = useState('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [projectId, setProjectId] = useState<string>('all');
  const [category, setCategory] = useState<string>('');
  const [associeId, setAssocieId] = useState<string>('all');
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [associes, setAssocies] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!hasRole(['super_admin', 'associe', 'comptable'])) {
    return <p className="text-white/60 text-sm">Accès réservé à la direction.</p>;
  }

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: r }, { data: h }] = await Promise.all([
        supabase.from('projects').select('id, name').order('name'),
        supabase.from('user_roles').select('user_id, role').eq('role', 'associe'),
        supabase.from('financial_reports').select('*').order('generated_at', { ascending: false }).limit(20),
      ]);
      setProjects(p ?? []);
      const ids = (r ?? []).map((x: any) => x.user_id);
      if (ids.length) {
        const { data: prof } = await supabase.from('profiles').select('user_id, full_name').in('user_id', ids);
        setAssocies(prof ?? []);
      }
      setHistory(h ?? []);
    })();
  }, []);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const filters: any = {};
    if (projectId !== 'all') filters.project_id = projectId;
    if (category.trim()) filters.category = category.trim();
    if (associeId !== 'all') filters.associe_id = associeId;
    const { data, error } = await supabase.functions.invoke('ai-generate-financial-report', {
      body: { period, from: from || undefined, to: to || undefined, filters },
    });
    setLoading(false);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    setResult(data);
  };

  const saveToHistory = async () => {
    if (!result) return;
    setSaving(true);
    const { error } = await supabase.functions.invoke('ai-generate-financial-report', {
      body: {
        period, from: from || undefined, to: to || undefined,
        filters: result.filters ?? {},
        persist: true,
        source: 'manual',
      },
    });
    setSaving(false);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: 'Rapport enregistré', description: 'Disponible dans l\'historique.' });
    const { data: h } = await supabase.from('financial_reports').select('*').order('generated_at', { ascending: false }).limit(20);
    setHistory(h ?? []);
  };

  const loadFromHistory = (r: any) => {
    setResult({
      report: r.report_markdown,
      level: r.level,
      period: { start: r.period_start, end: r.period_end },
      summary: r.summary,
      comparisons: r.comparisons,
      monthlySeries: [],
      byCategory: [],
      filters: r.filters,
      transactions: [],
    });
  };

  const fileBase = () => {
    const p = result?.period;
    const s = p?.start ? new Date(p.start).toISOString().slice(0, 10) : 'debut';
    const e = p?.end ? new Date(p.end).toISOString().slice(0, 10) : 'fin';
    return `rapport-financier_${s}_${e}`;
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SKAL SERVICES — Rapport financier', margin, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const p = result.period;
    doc.text(
      `Période : ${p?.start ? new Date(p.start).toLocaleDateString('fr-FR') : '-'} → ${p?.end ? new Date(p.end).toLocaleDateString('fr-FR') : '-'}   |   Niveau : ${result.level ?? '-'}`,
      margin,
      y,
    );
    y += 18;

    if (result.summary) {
      const s = result.summary;
      const fmt = (n: number | null) => (n == null ? '—' : `${Number(n).toLocaleString('fr-FR')} FCFA`);
      doc.setFont('helvetica', 'bold');
      doc.text('Synthèse', margin, y); y += 14;
      doc.setFont('helvetica', 'normal');
      doc.text(`Transactions : ${s.transactions}`, margin, y); y += 12;
      doc.text(`Revenus : ${fmt(s.revenu)}`, margin, y); y += 12;
      doc.text(`Dépenses : ${fmt(s.depense)}`, margin, y); y += 12;
      doc.text(`Solde : ${fmt(s.solde)}`, margin, y); y += 18;
    }

    if (result.comparisons?.previous || result.comparisons?.year) {
      doc.setFont('helvetica', 'bold');
      doc.text('Comparatifs', margin, y); y += 14;
      doc.setFont('helvetica', 'normal');
      const c = result.comparisons;
      if (c.previous) {
        doc.text(`M-1 : Revenus ${Number(c.previous.revenu).toLocaleString('fr-FR')} (${c.previous.var_revenu ?? 'n/a'}%) — Dépenses ${Number(c.previous.depense).toLocaleString('fr-FR')} (${c.previous.var_depense ?? 'n/a'}%)`, margin, y); y += 12;
      }
      if (c.year) {
        doc.text(`N-1 : Revenus ${Number(c.year.revenu).toLocaleString('fr-FR')} (${c.year.var_revenu ?? 'n/a'}%) — Dépenses ${Number(c.year.depense).toLocaleString('fr-FR')} (${c.year.var_depense ?? 'n/a'}%)`, margin, y); y += 12;
      }
      y += 6;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Rapport', margin, y); y += 14;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(String(result.report ?? ''), pageW - margin * 2);
    for (const line of lines) {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 12;
    }

    doc.setFontSize(8);
    doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, margin, pageH - 20);
    doc.save(`${fileBase()}.pdf`);
  };

  const exportExcel = () => {
    if (!result) return;
    const wb = XLSX.utils.book_new();
    const p = result.period;
    const s = result.summary ?? {};
    const c = result.comparisons ?? {};
    const meta = [
      ['SKAL SERVICES — Rapport financier'],
      ['Période début', p?.start ? new Date(p.start).toLocaleDateString('fr-FR') : '-'],
      ['Période fin', p?.end ? new Date(p.end).toLocaleDateString('fr-FR') : '-'],
      ['Niveau d\'accès', result.level ?? '-'],
      ['Généré le', new Date().toLocaleString('fr-FR')],
      [],
      ['Synthèse'],
      ['Transactions', s.transactions ?? 0],
      ['Revenus (FCFA)', s.revenu ?? ''],
      ['Dépenses (FCFA)', s.depense ?? ''],
      ['Solde (FCFA)', s.solde ?? ''],
      [],
      ['Comparatifs'],
      ['M-1 Revenus', c.previous?.revenu ?? '', 'Variation %', c.previous?.var_revenu ?? ''],
      ['M-1 Dépenses', c.previous?.depense ?? '', 'Variation %', c.previous?.var_depense ?? ''],
      ['N-1 Revenus', c.year?.revenu ?? '', 'Variation %', c.year?.var_revenu ?? ''],
      ['N-1 Dépenses', c.year?.depense ?? '', 'Variation %', c.year?.var_depense ?? ''],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(meta);
    wsSummary['!cols'] = [{ wch: 28 }, { wch: 22 }, { wch: 16 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Synthèse');

    if (Array.isArray(result.monthlySeries) && result.monthlySeries.length) {
      const wsM = XLSX.utils.json_to_sheet(result.monthlySeries);
      wsM['!cols'] = [{ wch: 12 }, { wch: 16 }, { wch: 16 }];
      XLSX.utils.book_append_sheet(wb, wsM, 'Évolution mensuelle');
    }
    if (Array.isArray(result.byCategory) && result.byCategory.length) {
      const wsC = XLSX.utils.json_to_sheet(result.byCategory);
      wsC['!cols'] = [{ wch: 28 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, wsC, 'Par catégorie');
    }

    const tx = Array.isArray(result.transactions) ? result.transactions : [];
    if (tx.length) {
      const wsTx = XLSX.utils.json_to_sheet(
        tx.map((t: any) => ({
          Date: t.transaction_date,
          Type: t.type,
          Catégorie: t.category,
          'Montant (FCFA)': Number(t.amount),
        })),
      );
      wsTx['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, wsTx, 'Transactions');
    }

    const wsReport = XLSX.utils.aoa_to_sheet(
      String(result.report ?? '').split('\n').map((l: string) => [l]),
    );
    wsReport['!cols'] = [{ wch: 120 }];
    XLSX.utils.book_append_sheet(wb, wsReport, 'Rapport');

    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([out], { type: 'application/octet-stream' }), `${fileBase()}.xlsx`);
  };

  const fmtMoney = (n: number | null | undefined) =>
    n == null ? '—' : `${Number(n).toLocaleString('fr-FR')} FCFA`;

  const VarBadge = ({ v }: { v: number | null | undefined }) => {
    if (v == null) return <Badge variant="outline">n/a</Badge>;
    const up = v >= 0;
    return (
      <Badge variant="outline" className={up ? 'text-emerald-400 border-emerald-500/40' : 'text-rose-400 border-rose-500/40'}>
        {up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {v > 0 ? '+' : ''}{v}%
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rapports financiers IA</h1>
        <p className="text-sm text-white/60">Génération respectant ton niveau d'accès. Comparatifs M-1 / N-1, filtres et historique inclus.</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3 lg:grid-cols-7">
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
          <div>
            <Label className="text-xs text-white/60">Projet</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-white/60">Catégorie</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ex: loyer" className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-xs text-white/60">Associé</Label>
            <Select value={associeId} onValueChange={setAssocieId}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {associes.map((a) => <SelectItem key={a.user_id} value={a.user_id}>{a.full_name ?? a.user_id.slice(0, 8)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={generate} disabled={loading} className="bg-orange-500 hover:bg-orange-600 w-full">
              <Sparkles className="h-4 w-4 mr-1" />
              {loading ? 'Génération…' : 'Générer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result?.comparisons && (result.comparisons.previous || result.comparisons.year) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {result.comparisons.previous && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Vs période précédente (M-1)</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-white/60 text-xs">Revenus</div>
                  <div className="text-white">{fmtMoney(result.comparisons.previous.revenu)}</div>
                  <VarBadge v={result.comparisons.previous.var_revenu} />
                </div>
                <div>
                  <div className="text-white/60 text-xs">Dépenses</div>
                  <div className="text-white">{fmtMoney(result.comparisons.previous.depense)}</div>
                  <VarBadge v={result.comparisons.previous.var_depense} />
                </div>
              </CardContent>
            </Card>
          )}
          {result.comparisons.year && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Vs année précédente (N-1)</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-white/60 text-xs">Revenus</div>
                  <div className="text-white">{fmtMoney(result.comparisons.year.revenu)}</div>
                  <VarBadge v={result.comparisons.year.var_revenu} />
                </div>
                <div>
                  <div className="text-white/60 text-xs">Dépenses</div>
                  <div className="text-white">{fmtMoney(result.comparisons.year.depense)}</div>
                  <VarBadge v={result.comparisons.year.var_depense} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {result?.monthlySeries?.length > 0 && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Évolution mensuelle</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="revenu" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="depense" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {result?.byCategory?.length > 0 && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Dépenses par catégorie</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.byCategory.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="amount" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Rapport</CardTitle>
            <div className="flex items-center gap-2">
              {result.level && <Badge variant="outline">Niveau : {result.level}</Badge>}
              <Button size="sm" variant="outline" onClick={saveToHistory} disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> {saving ? '…' : 'Enregistrer'}
              </Button>
              <Button size="sm" variant="outline" onClick={exportPDF}>
                <FileDown className="h-4 w-4 mr-1" /> PDF
              </Button>
              <Button size="sm" variant="outline" onClick={exportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{result.report ?? ''}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <History className="h-4 w-4 text-white/70" />
          <CardTitle className="text-sm text-white">Historique des rapports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.length === 0 && <p className="text-xs text-white/50">Aucun rapport enregistré.</p>}
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <div className="flex flex-col">
                <span className="text-white">{h.period_start} → {h.period_end}</span>
                <span className="text-xs text-white/50">
                  {new Date(h.generated_at).toLocaleString('fr-FR')} · {h.source} · niveau {h.level}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => loadFromHistory(h)}>Ouvrir</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
