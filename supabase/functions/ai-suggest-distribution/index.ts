import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText, Output } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { validation_id } = await req.json();
    if (!validation_id) {
      return new Response(JSON.stringify({ error: "validation_id requis" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: validation, error: vErr } = await supabase
      .from("financial_validations").select("*").eq("id", validation_id).single();
    if (vErr || !validation) throw new Error(vErr?.message ?? "validation introuvable");

    const ctx = validation.context ?? {};
    const amount = Number(ctx.amount ?? 0);
    const caisse = Math.round(amount * 0.15);
    const remaining = amount - caisse;

    let project: any = null;
    if (ctx.project_id) {
      const { data: p } = await supabase.from("projects").select("name,domain,description,budget,manager_id").eq("id", ctx.project_id).maybeSingle();
      project = p;
    }

    const gateway = createLovableAiGatewayProvider(Deno.env.get("LOVABLE_API_KEY")!);
    const model = gateway("google/gemini-3-flash-preview");

    const { output } = await generateText({
      model,
      system: `Tu es expert répartition financière SKAL SERVICES SARL (Bénin).
RÈGLE ABSOLUE: la caisse reçoit toujours 15% du brut (déjà comptabilisée).
Tu dois proposer la répartition des 85% restants entre: spero, associe, prestataire_externe.
Total des 3 = 100% du restant (somme = ${remaining} XOF).
Heuristiques:
- Projet 100% interne (pas de sous-traitance): spero 75-85%, associe 15-25%, prestataire 0
- Projet avec prestataire externe forfait: prestataire 35-45%, spero 35-45%, associe 15-25%
- BTP/Architecture: part associé plus haute (20-30%)
- Web/Digital/Graphisme/IA: part Spero plus haute (70-85%)
Justifie en 1-2 phrases.`,
      output: Output.object({
        schema: z.object({
          spero_percent: z.number().min(0).max(100),
          associe_percent: z.number().min(0).max(100),
          prestataire_percent: z.number().min(0).max(100),
          rationale: z.string(),
        }),
      }),
      prompt: `Transaction: ${amount} XOF (caisse 15% = ${caisse} déjà retenue, à répartir: ${remaining}).
Description: ${ctx.description ?? "—"}
Projet: ${project ? `${project.name} (domaine: ${project.domain}, budget: ${project.budget ?? "?"})` : "aucun projet lié"}

Réponds en JSON. Les 3 pourcentages portent sur le restant (${remaining}) et doivent totaliser 100.`,
    });

    const sum = output.spero_percent + output.associe_percent + output.prestataire_percent;
    const norm = (p: number) => Math.round((p / sum) * 100 * 100) / 100;
    const sp = norm(output.spero_percent);
    const ap = norm(output.associe_percent);
    const pp = 100 - sp - ap;

    const suggestion = {
      caisse: caisse,
      caisse_percent_of_gross: 15,
      spero: Math.round(remaining * sp / 100),
      associe: Math.round(remaining * ap / 100),
      prestataire: Math.round(remaining * pp / 100),
      spero_percent_of_remaining: sp,
      associe_percent_of_remaining: ap,
      prestataire_percent_of_remaining: pp,
      rationale: output.rationale,
      generated_at: new Date().toISOString(),
    };

    await supabase.from("financial_validations").update({
      context: { ...ctx, ai_suggestion: suggestion, need_ai_suggestion: false },
    }).eq("id", validation_id);

    return new Response(JSON.stringify({ ok: true, suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});