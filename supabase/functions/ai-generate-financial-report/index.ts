import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";
import { withAiRetry, checkRateLimit } from "../_shared/ai-retry.ts";

type Level = 'public' | 'internal' | 'restricted' | 'secret';
const rank = (l: Level) => ['public', 'internal', 'restricted', 'secret'].indexOf(l);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const t0 = Date.now();
  let client: any = null;
  let userLevel: Level = 'public';
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Missing Authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } });
    const { data: userRes } = await client.auth.getUser();
    if (!userRes?.user) return new Response(JSON.stringify({ error: "Unauthenticated" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Rate-limit per user (20/min, burst 30)
    const rl = checkRateLimit(`fin-report:${userRes.user.id}`, 20, 30);
    if (!('ok' in rl) || !rl.ok) {
      const retryS = Math.ceil(rl.retryAfterMs / 1000);
      return new Response(JSON.stringify({ error: `Rate limit dépassé. Réessaie dans ${retryS}s` }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(retryS) },
      });
    }

    const body = await req.json().catch(() => ({}));
    const {
      period = 'month',
      from,
      to,
      filters = {},
      persist = false,
      source = 'manual',
    } = body;
    const projectId: string | undefined = filters?.project_id;
    const category: string | undefined = filters?.category;
    const associeId: string | undefined = filters?.associe_id;

    // Determine user level for finances
    const { data: lvl } = await client.rpc('get_user_max_ai_level', {
      _user_id: userRes.user.id, _entity: 'finances',
    });
    const level = (lvl as Level) ?? 'public';
    userLevel = level;

    // Date range
    const now = new Date();
    const start = from ? new Date(from) : new Date(now.getFullYear(), period === 'quarter' ? now.getMonth() - 2 : now.getMonth(), 1);
    const end = to ? new Date(to) : now;
    const toISO = (d: Date) => d.toISOString().slice(0, 10);

    const buildQuery = (gte: Date, lte: Date) => {
      let q = client
        .from('transactions')
        .select('type, amount, transaction_date, category, project_id, associe_id')
        .gte('transaction_date', toISO(gte))
        .lte('transaction_date', toISO(lte));
      if (projectId) q = q.eq('project_id', projectId);
      if (category) q = q.eq('category', category);
      if (associeId) q = q.eq('associe_id', associeId);
      return q;
    };

    // Aggregate transactions (RLS will block if not direction — that's intentional)
    const { data: tx, error: txErr } = await buildQuery(start, end);

    if (txErr) {
      return new Response(JSON.stringify({ error: "Accès refusé aux finances" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sum = (rows: any[], type: string) =>
      rows.filter((t: any) => t.type === type).reduce((s: number, t: any) => s + Number(t.amount), 0);
    const revenu = sum(tx ?? [], 'revenu');
    const depense = sum(tx ?? [], 'depense');

    // M-1 (mois précédent même longueur)
    const periodMs = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 86400000);
    const prevStart = new Date(prevEnd.getTime() - periodMs);
    const { data: txPrev } = await buildQuery(prevStart, prevEnd);
    const prevRevenu = sum(txPrev ?? [], 'revenu');
    const prevDepense = sum(txPrev ?? [], 'depense');

    // N-1 (même fenêtre, année précédente)
    const yStart = new Date(start); yStart.setFullYear(yStart.getFullYear() - 1);
    const yEnd = new Date(end); yEnd.setFullYear(yEnd.getFullYear() - 1);
    const { data: txYear } = await buildQuery(yStart, yEnd);
    const yRevenu = sum(txYear ?? [], 'revenu');
    const yDepense = sum(txYear ?? [], 'depense');

    const variation = (curr: number, ref: number) => ref === 0 ? null : Math.round(((curr - ref) / ref) * 1000) / 10;

    // Time series mensuelle
    const monthly: Record<string, { revenu: number; depense: number }> = {};
    for (const t of tx ?? []) {
      const k = String(t.transaction_date).slice(0, 7);
      monthly[k] ??= { revenu: 0, depense: 0 };
      monthly[k][t.type === 'revenu' ? 'revenu' : 'depense'] += Number(t.amount);
    }
    const monthlySeries = Object.entries(monthly).sort().map(([month, v]) => ({ month, ...v }));

    // Catégories
    const catMap: Record<string, number> = {};
    for (const t of tx ?? []) {
      const k = t.category || 'Non catégorisé';
      catMap[k] = (catMap[k] ?? 0) + Number(t.amount) * (t.type === 'depense' ? 1 : 0);
    }
    const byCategory = Object.entries(catMap).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);

    // Build summary respecting confidentiality
    let context = `Période : ${toISO(start)} → ${toISO(end)}
Nombre de transactions : ${(tx ?? []).length}`;

    // Projects history (always include for context — durations, deliveries)
    const { data: allProjects } = await client
      .from('projects')
      .select('id, name, domain, status, budget, amount_collected, start_date, completed_at')
      .order('start_date', { ascending: true });
    const delivered = (allProjects ?? []).filter((p: any) => p.status === 'livre');
    const totalDeliveredCA = delivered.reduce((s: number, p: any) => s + Number(p.budget ?? 0), 0);
    const totalDeliveredNet = delivered.reduce((s: number, p: any) => s + Number(p.amount_collected ?? 0), 0);
    const byDomain: Record<string, { count: number; ca: number }> = {};
    delivered.forEach((p: any) => {
      const d = p.domain ?? 'autre';
      byDomain[d] ??= { count: 0, ca: 0 };
      byDomain[d].count += 1;
      byDomain[d].ca += Number(p.budget ?? 0);
    });
    const oldestStart = delivered[0]?.start_date;

    context += `\n\n--- Historique projets SKAL SERVICES ---
Total projets livrés : ${delivered.length} depuis ${oldestStart ?? 'n/a'}
CA cumulé brut livré : ${totalDeliveredCA.toLocaleString('fr-FR')} FCFA
Bénéfice net SKAL cumulé : ${totalDeliveredNet.toLocaleString('fr-FR')} FCFA
Répartition par domaine :
${Object.entries(byDomain).map(([d, v]) => `  - ${d} : ${v.count} projets · ${v.ca.toLocaleString('fr-FR')} FCFA`).join('\n')}
Derniers projets livrés :
${delivered.slice(-6).map((p: any) => `  - ${p.start_date} · ${p.name} (${p.domain}) — ${Number(p.budget ?? 0).toLocaleString('fr-FR')} FCFA`).join('\n')}`;

    if (rank(level) >= rank('restricted')) {
      context += `\n\n--- Période demandée ---
Revenus : ${revenu.toLocaleString('fr-FR')} FCFA
Dépenses : ${depense.toLocaleString('fr-FR')} FCFA
Solde : ${(revenu - depense).toLocaleString('fr-FR')} FCFA
M-1 — Revenus : ${prevRevenu.toLocaleString('fr-FR')} (${variation(revenu, prevRevenu) ?? 'n/a'}%) | Dépenses : ${prevDepense.toLocaleString('fr-FR')} (${variation(depense, prevDepense) ?? 'n/a'}%)
N-1 — Revenus : ${yRevenu.toLocaleString('fr-FR')} (${variation(revenu, yRevenu) ?? 'n/a'}%) | Dépenses : ${yDepense.toLocaleString('fr-FR')} (${variation(depense, yDepense) ?? 'n/a'}%)`;
    } else if (rank(level) >= rank('internal')) {
      context += `\nActivité : ${(tx ?? []).length} mouvements enregistrés (montants masqués)`;
    } else {
      return new Response(JSON.stringify({ error: "Niveau d'accès insuffisant pour ce rapport" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ error: "AI gateway not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await withAiRetry(() => generateText({
      model,
      system: `Tu rédiges un rapport financier synthétique pour SKAL SERVICES SARL, entreprise multidisciplinaire au Bénin (Architecture & BTP, Géomatique & SIG, Graphisme & IA, Web & Digital), active depuis 2023.
Niveau d'accès demandeur : ${level}.
RÈGLES IMPORTANTES :
- Tu DOIS t'appuyer sur l'historique des projets livrés fournis ci-dessous. NE JAMAIS écrire "rien n'a été fait", "aucune activité", "entreprise nouvelle" ou équivalents : SKAL a un historique réel.
- Si la période demandée est calme, dis-le explicitement par rapport à l'historique global ("activité ralentie ce mois vs. cumul de N projets livrés depuis 2023…").
- INTERDIT : pourcentages de répartition internes, capital social, noms de prestataires, mécanismes confidentiels.
- Format markdown clair avec sections : Vue d'ensemble (contextualisée historique), Comparatifs (M-1, N-1), Performance par domaine, Faits saillants, Recommandations actionnables.`,
      prompt: `Données agrégées :\n${context}\n\nGénère le rapport en mettant la période demandée en perspective avec l'historique global de l'entreprise.`,
    }));

    await client.rpc("log_ai_access", {
      _agent_slug: "financial-report", _entity: "finances",
      _requested: level, _granted: level,
      _prompt_hash: null, _status: "ok", _error: null,
      _duration_ms: Date.now() - t0,
    });

    const showAmounts = rank(level) >= rank('restricted');
    const payload = {
      report: text,
      level,
      period: { start, end },
      summary: {
        transactions: (tx ?? []).length,
        revenu: showAmounts ? revenu : null,
        depense: showAmounts ? depense : null,
        solde: showAmounts ? revenu - depense : null,
      },
      comparisons: showAmounts ? {
        previous: { from: toISO(prevStart), to: toISO(prevEnd), revenu: prevRevenu, depense: prevDepense,
          var_revenu: variation(revenu, prevRevenu), var_depense: variation(depense, prevDepense) },
        year: { from: toISO(yStart), to: toISO(yEnd), revenu: yRevenu, depense: yDepense,
          var_revenu: variation(revenu, yRevenu), var_depense: variation(depense, yDepense) },
      } : {},
      monthlySeries: showAmounts ? monthlySeries : [],
      byCategory: showAmounts ? byCategory : [],
      filters: { project_id: projectId ?? null, category: category ?? null, associe_id: associeId ?? null },
      transactions: showAmounts ? (tx ?? []) : [],
    };

    if (persist) {
      await client.from('financial_reports').insert({
        generated_by: userRes.user.id,
        period_label: period,
        period_start: toISO(start),
        period_end: toISO(end),
        level,
        filters: payload.filters,
        summary: payload.summary,
        comparisons: payload.comparisons,
        report_markdown: text,
        source,
      });
    }

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    if (client) {
      await client.rpc("log_ai_access", {
        _agent_slug: "financial-report", _entity: "finances",
        _requested: userLevel, _granted: userLevel,
        _prompt_hash: null, _status: "error", _error: msg.slice(0, 500),
        _duration_ms: Date.now() - t0,
      }).catch(() => {});
    }
    return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
