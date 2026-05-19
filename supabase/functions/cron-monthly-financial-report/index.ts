import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

// Triggered monthly by pg_cron to generate & store the previous month's report,
// then notify direction (super_admin, associe, comptable).
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    const toISO = (d: Date) => d.toISOString().slice(0, 10);

    // Aggregate with service role (bypasses RLS)
    const { data: tx } = await admin
      .from('transactions')
      .select('type, amount, transaction_date, category')
      .gte('transaction_date', toISO(start))
      .lte('transaction_date', toISO(end));

    const sum = (rows: any[], type: string) =>
      (rows ?? []).filter((t: any) => t.type === type).reduce((s: number, t: any) => s + Number(t.amount), 0);
    const revenu = sum(tx ?? [], 'revenu');
    const depense = sum(tx ?? [], 'depense');

    const report =
`# Rapport mensuel automatique

## Vue d'ensemble
- Période : ${toISO(start)} → ${toISO(end)}
- Transactions : ${(tx ?? []).length}
- Revenus : ${revenu.toLocaleString('fr-FR')} FCFA
- Dépenses : ${depense.toLocaleString('fr-FR')} FCFA
- Solde : ${(revenu - depense).toLocaleString('fr-FR')} FCFA

_Généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}._`;

    const { data: reportRow } = await admin.from('financial_reports').insert({
      generated_by: null,
      period_label: 'month',
      period_start: toISO(start),
      period_end: toISO(end),
      level: 'restricted',
      filters: {},
      summary: { transactions: (tx ?? []).length, revenu, depense, solde: revenu - depense },
      comparisons: {},
      report_markdown: report,
      source: 'cron',
    }).select('id').single();

    // Notify direction
    const { data: directors } = await admin
      .from('user_roles')
      .select('user_id')
      .in('role', ['super_admin', 'associe', 'comptable', 'secretaire']);

    const seen = new Set<string>();
    for (const r of directors ?? []) {
      if (seen.has(r.user_id)) continue;
      seen.add(r.user_id);
      await admin.rpc('notify_user', {
        _user_id: r.user_id,
        _type: 'system',
        _title: 'Rapport mensuel disponible',
        _body: `Rapport ${toISO(start)} → ${toISO(end)} généré automatiquement.`,
        _link: '/admin/finances/rapports',
      });
    }

    return new Response(JSON.stringify({ ok: true, report_id: reportRow?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});