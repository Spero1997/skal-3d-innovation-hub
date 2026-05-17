import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText, Output } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const Schema = z.object({
  project_type: z.enum(['interne', 'forfait', 'au_cout', 'mixte']),
  suggested_domain: z.enum(['architecture_btp', 'geomatique_sig', 'graphisme_ia', 'web_digital', 'autre']),
  involvement_level: z.enum(['faible', 'moyen', 'fort']),
  suggested_rule_set_id: z.string().nullable(),
  rationale: z.string(),
  confidence: z.number().min(0).max(1),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const t0 = Date.now();
  let client: any = null;
  let userId: string | null = null;
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Missing Authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } });
    const { data: userRes } = await client.auth.getUser();
    if (!userRes?.user) return new Response(JSON.stringify({ error: "Unauthenticated" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    userId = userRes.user.id;

    const { name, description, budget, client: clientName } = await req.json().catch(() => ({}));
    if (!description || typeof description !== "string") {
      return new Response(JSON.stringify({ error: "description is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Load available rule sets to suggest one
    const { data: ruleSets } = await client.from('finance_rule_sets')
      .select('id, name, description, is_active').eq('is_active', true);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ error: "AI gateway not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const ruleSetList = (ruleSets ?? []).map((r: any) => `- ${r.id} : ${r.name}${r.description ? ` — ${r.description}` : ''}`).join('\n') || '(aucun)';

    const { output } = await generateText({
      model,
      output: Output.object({ schema: Schema }),
      system: `Tu classifies des projets pour SKAL SERVICES (Bénin, multidisciplinaire).
Domaines : architecture_btp, geomatique_sig, graphisme_ia, web_digital, autre.
Types : interne (100% interne), forfait (prestataire au forfait), au_cout (prestataire facturé au coût réel), mixte.
Niveaux d'implication : faible / moyen / fort.
Ne révèle JAMAIS de pourcentages financiers ni de mécanismes internes.

Jeux de règles disponibles (suggère le plus pertinent si évident, sinon null) :
${ruleSetList}`,
      prompt: `Projet : ${name ?? '(sans nom)'}
Client : ${clientName ?? 'inconnu'}
Budget : ${budget ?? 'non communiqué'}
Description : ${description}`,
    });

    await client.rpc("log_ai_access", {
      _agent_slug: "classify-project", _entity: "projects",
      _requested: "internal", _granted: "internal",
      _prompt_hash: null, _status: "ok", _error: null,
      _duration_ms: Date.now() - t0,
    });

    return new Response(JSON.stringify(output), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    if (client) {
      await client.rpc("log_ai_access", {
        _agent_slug: "classify-project", _entity: "projects",
        _requested: "internal", _granted: "internal",
        _prompt_hash: null, _status: "error", _error: msg.slice(0, 500),
        _duration_ms: Date.now() - t0,
      }).catch(() => {});
    }
    return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
