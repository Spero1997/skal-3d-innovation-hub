import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const LEVELS = ["public", "internal", "restricted", "secret"] as const;
type Level = typeof LEVELS[number];
const rank = (l: Level) => LEVELS.indexOf(l);

const FORBIDDEN = [
  /\b\d{1,3}\s*%\s*(de|du|sur)\s*(revenu|chiffre|bénéfice|benefice|marge)/gi,
  /\bcapital\s+social\b/gi,
  /\bpacte\s+d['']?associés?\b/gi,
  /\brépartition\s+(financière|interne|stratégique)\b/gi,
];
const sanitize = (t: string) => FORBIDDEN.reduce((s, re) => s.replace(re, "[information confidentielle]"), t);

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Missing Authorization" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: u } = await userClient.auth.getUser();
    if (!u?.user) return new Response(JSON.stringify({ error: "Unauthenticated" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    const { conversation_id, agent_slug, entity = "general", prompt, title } =
      await req.json().catch(() => ({}));
    if (!prompt || typeof prompt !== "string" || prompt.length > 8000) {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve or create conversation
    let convId = conversation_id as string | undefined;
    let slug = agent_slug as string | undefined;
    if (convId) {
      const { data: c } = await userClient.from("ai_conversations")
        .select("id, agent_slug, entity").eq("id", convId).maybeSingle();
      if (!c) return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      slug = c.agent_slug;
    } else {
      if (!slug) return new Response(JSON.stringify({ error: "agent_slug required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      const { data: c, error } = await userClient.from("ai_conversations").insert({
        user_id: u.user.id, agent_slug: slug, entity,
        title: (title ?? prompt).slice(0, 80),
      }).select("id").single();
      if (error) return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      convId = c.id;
    }

    // Load agent
    const { data: agent } = await userClient.from("ai_agents")
      .select("slug, model, max_level, system_prompt, is_active")
      .eq("slug", slug).maybeSingle();
    if (!agent || !agent.is_active) {
      return new Response(JSON.stringify({ error: "Agent unavailable" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // User effective level
    const { data: lvl } = await userClient.rpc("get_user_max_ai_level", {
      _user_id: u.user.id, _entity: entity,
    });
    const userLevel = (lvl as Level) ?? "public";
    const effective: Level = rank(userLevel) <= rank(agent.max_level as Level)
      ? userLevel : (agent.max_level as Level);

    // Load history (last 20)
    const { data: history } = await userClient.from("ai_messages")
      .select("role, content").eq("conversation_id", convId)
      .order("created_at", { ascending: true }).limit(20);

    // Save user message
    await userClient.from("ai_messages").insert({
      conversation_id: convId, role: "user", content: prompt,
    });

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway(agent.model);
    const system = [
      agent.system_prompt ?? "",
      "",
      `Niveau de confidentialité utilisateur : ${effective}.`,
      "INTERDIT : pourcentages de répartition, capital social, mécanismes financiers internes, noms de prestataires, ratios stratégiques.",
      "Refuse poliment si demandé.",
    ].join("\n");

    const messages = [
      ...(history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: prompt },
    ];

    const t0 = Date.now();
    const promptHash = await sha256(prompt);
    try {
      const { text } = await generateText({ model, system, messages });
      const safe = sanitize(text);
      const duration = Date.now() - t0;

      await userClient.from("ai_messages").insert({
        conversation_id: convId, role: "assistant", content: safe,
        granted_level: effective, model: agent.model, duration_ms: duration,
      });
      await userClient.from("ai_conversations").update({ updated_at: new Date().toISOString() })
        .eq("id", convId);
      await userClient.rpc("log_ai_access", {
        _agent_slug: slug, _entity: entity,
        _requested: userLevel, _granted: effective,
        _prompt_hash: promptHash, _status: "ok", _error: null, _duration_ms: duration,
      });

      return new Response(JSON.stringify({
        conversation_id: convId, text: safe, level: effective,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      await userClient.rpc("log_ai_access", {
        _agent_slug: slug, _entity: entity,
        _requested: userLevel, _granted: effective,
        _prompt_hash: promptHash, _status: "error", _error: msg.slice(0, 500),
        _duration_ms: Date.now() - t0,
      });
      const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
      return new Response(JSON.stringify({ error: msg, conversation_id: convId }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});