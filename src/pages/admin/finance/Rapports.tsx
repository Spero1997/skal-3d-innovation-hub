import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Sparkles, FileDown, FileSpreadsheet } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(meta);
    wsSummary['!cols'] = [{ wch: 28 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Synthèse');

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
            <div className="flex items-center gap-2">
              {result.level && <Badge variant="outline">Niveau : {result.level}</Badge>}
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
    </div>
  );
}
