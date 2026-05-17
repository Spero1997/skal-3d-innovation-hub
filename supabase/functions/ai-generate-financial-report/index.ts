import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

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

    const { period = 'month', from, to } = await req.json().catch(() => ({}));

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

    // Aggregate transactions (RLS will block if not direction — that's intentional)
    const { data: tx, error: txErr } = await client
      .from('transactions')
      .select('type, amount, transaction_date, category')
      .gte('transaction_date', start.toISOString().slice(0, 10))
      .lte('transaction_date', end.toISOString().slice(0, 10));

    if (txErr) {
      return new Response(JSON.stringify({ error: "Accès refusé aux finances" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const revenu = (tx ?? []).filter((t: any) => t.type === 'revenu').reduce((s: number, t: any) => s + Number(t.amount), 0);
    const depense = (tx ?? []).filter((t: any) => t.type === 'depense').reduce((s: number, t: any) => s + Number(t.amount), 0);

    // Build summary respecting confidentiality
    let context = `Période : ${start.toISOString().slice(0,10)} → ${end.toISOString().slice(0,10)}
Nombre de transactions : ${(tx ?? []).length}`;

    if (rank(level) >= rank('restricted')) {
      context += `\nRevenus : ${revenu.toLocaleString('fr-FR')} FCFA
Dépenses : ${depense.toLocaleString('fr-FR')} FCFA
Solde : ${(revenu - depense).toLocaleString('fr-FR')} FCFA`;
    } else if (rank(level) >= rank('internal')) {
      context += `\nActivité : ${(tx ?? []).length} mouvements enregistrés (montants masqués)`;
    } else {
      return new Response(JSON.stringify({ error: "Niveau d'accès insuffisant pour ce rapport" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ error: "AI gateway not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system: `Tu rédiges un rapport financier synthétique pour SKAL SERVICES.
Niveau d'accès demandeur : ${level}.
INTERDIT : pourcentages de répartition, capital social, noms de prestataires, mécanismes internes.
Format : markdown clair avec sections : Vue d'ensemble, Faits saillants, Recommandations.`,
      prompt: `Données agrégées :\n${context}\n\nGénère le rapport.`,
    });

    await client.rpc("log_ai_access", {
      _agent_slug: "financial-report", _entity: "finances",
      _requested: level, _granted: level,
      _prompt_hash: null, _status: "ok", _error: null,
      _duration_ms: Date.now() - t0,
    });

    const showAmounts = rank(level) >= rank('restricted');
    return new Response(JSON.stringify({
      report: text,
      level,
      period: { start, end },
      summary: {
        transactions: (tx ?? []).length,
        revenu: showAmounts ? revenu : null,
        depense: showAmounts ? depense : null,
        solde: showAmounts ? revenu - depense : null,
      },
      transactions: showAmounts ? (tx ?? []) : [],
    }), {
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
