import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

// Confidentiality ordering
const LEVELS = ["public", "internal", "restricted", "secret"] as const;
type Level = typeof LEVELS[number];
const rank = (l: Level) => LEVELS.indexOf(l);

// Forbidden patterns that must NEVER appear in any AI response, regardless of caller.
// These protect strategic confidentiality (rules, distributions, capital).
const FORBIDDEN_KEYWORDS = [
  /\b\d{1,3}\s*%\s*(de|du|sur)\s*(revenu|chiffre|bénéfice|benefice|marge)/gi,
  /\bcapital\s+social\b/gi,
  /\bpacte\s+d['']?associés?\b/gi,
  /\brépartition\s+(financière|interne|stratégique)\b/gi,
];

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitize(text: string): string {
  let out = text;
  for (const re of FORBIDDEN_KEYWORDS) out = out.replace(re, "[information confidentielle]");
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) {
      return new Response(JSON.stringify({ error: "Missing Authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: auth } },
    });

    const { data: userRes } = await userClient.auth.getUser();
    if (!userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { agent_slug = "skal-assistant", entity = "general", prompt } = body ?? {};
    if (!prompt || typeof prompt !== "string" || prompt.length > 4000) {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load agent
    const { data: agent } = await userClient
      .from("ai_agents")
      .select("slug, name, model, max_level, system_prompt, is_active")
      .eq("slug", agent_slug)
      .maybeSingle();

    if (!agent || !agent.is_active) {
      return new Response(JSON.stringify({ error: "Agent unavailable" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve user's max level for this entity
    const { data: lvlData } = await userClient.rpc("get_user_max_ai_level", {
      _user_id: userRes.user.id, _entity: entity,
    });
    const userLevel = (lvlData as Level) ?? "public";

    // Effective level = min(agent.max_level, user level)
    const effective: Level = rank(userLevel as Level) <= rank(agent.max_level as Level)
      ? (userLevel as Level)
      : (agent.max_level as Level);

    const promptHash = await sha256(prompt);
    const apiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) {
      await userClient.rpc("log_ai_access", {
        _agent_slug: agent.slug, _entity: entity,
        _requested: userLevel, _granted: effective,
        _prompt_hash: promptHash, _status: "error", _error: "missing_api_key",
      });
      return new Response(JSON.stringify({ error: "AI gateway not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway(agent.model);

    const systemPrompt = [
      agent.system_prompt,
      "",
      `Niveau de confidentialité de l'utilisateur : ${effective}.`,
      "INTERDIT : pourcentages de répartition, capital, mécanismes financiers internes, noms de prestataires, montants de distribution, ratios stratégiques.",
      "Si la question porte sur ces sujets, refuse poliment et propose un sujet alternatif.",
    ].join("\n");

    try {
      const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt,
      });
      const safe = sanitize(text);

      await userClient.rpc("log_ai_access", {
        _agent_slug: agent.slug, _entity: entity,
        _requested: userLevel, _granted: effective,
        _prompt_hash: promptHash, _status: "ok", _error: null,
      });

      return new Response(JSON.stringify({ text: safe, level: effective }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      await userClient.rpc("log_ai_access", {
        _agent_slug: agent.slug, _entity: entity,
        _requested: userLevel, _granted: effective,
        _prompt_hash: promptHash, _status: "error", _error: msg.slice(0, 500),
      });
      const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
      return new Response(JSON.stringify({ error: msg }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
