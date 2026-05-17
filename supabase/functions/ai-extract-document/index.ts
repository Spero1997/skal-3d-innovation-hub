import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";
import { withAiRetry, checkRateLimit } from "../_shared/ai-retry.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Missing Authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } });
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: userRes } = await userClient.auth.getUser();
    if (!userRes?.user) return new Response(JSON.stringify({ error: "Unauthenticated" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const rl = checkRateLimit(`extract-doc:${userRes.user.id}`, 10, 15);
    if (!('ok' in rl) || !rl.ok) {
      return new Response(JSON.stringify({ error: "Rate limit dépassé" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { document_id, kind = "generic" } = await req.json();
    if (!document_id) return new Response(JSON.stringify({ error: "document_id requis" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Fetch document + latest version (via user client so RLS enforces access)
    const { data: doc, error: docErr } = await userClient.from("documents").select("id, name, current_version, project_id, kind").eq("id", document_id).single();
    if (docErr || !doc) return new Response(JSON.stringify({ error: "Document inaccessible" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: ver } = await userClient.from("document_versions").select("*").eq("document_id", document_id).eq("version", doc.current_version).single();
    if (!ver) return new Response(JSON.stringify({ error: "Version introuvable" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: signed } = await admin.storage.from("project-files").createSignedUrl(ver.storage_path, 120);
    if (!signed?.signedUrl) return new Response(JSON.stringify({ error: "Téléchargement impossible" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Download bytes (limit ~10MB)
    const resp = await fetch(signed.signedUrl);
    const buf = new Uint8Array(await resp.arrayBuffer());
    if (buf.length > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Fichier trop volumineux (>10Mo)" }), { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const mime = ver.mime_type || "application/octet-stream";
    const base64 = btoa(String.fromCharCode(...buf));
    const dataUrl = `data:${mime};base64,${base64}`;

    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const provider = createLovableAiGatewayProvider(lovableKey);
    const model = provider("google/gemini-2.5-flash");

    const schemaHint = kind === "invoice" || kind === "facture"
      ? `{ "supplier_name": string, "invoice_number": string, "issue_date": "YYYY-MM-DD", "due_date": "YYYY-MM-DD", "amount_ht": number, "vat_rate": number, "amount_ttc": number, "currency": string, "line_items": [{ "label": string, "quantity": number, "unit_price": number, "total": number }] }`
      : kind === "devis" || kind === "quote"
      ? `{ "issuer": string, "client_name": string, "quote_number": string, "issue_date": "YYYY-MM-DD", "validity_days": number, "amount_ht": number, "amount_ttc": number, "currency": string, "line_items": [{ "label": string, "quantity": number, "unit_price": number, "total": number }] }`
      : `{ "title": string, "summary": string, "key_dates": [string], "amounts": [{ "label": string, "value": number, "currency": string }], "parties": [string] }`;

    const sys = `Tu es un expert d'extraction documentaire. Analyse le document fourni (image ou PDF). Renvoie UNIQUEMENT un objet JSON valide qui suit ce schéma indicatif:\n${schemaHint}\nSi un champ est absent, mets null. Aucune phrase autour. Renvoie aussi un champ "_summary" (1-3 phrases) et "_confidence" (0-100).`;

    const isImage = mime.startsWith("image/") || mime === "application/pdf";
    const userParts: any[] = [{ type: "text", text: `Extraction (${kind}) du document: ${ver.original_name}` }];
    if (isImage) userParts.push({ type: "image", image: dataUrl });

    const t0 = Date.now();
    let text = "";
    try {
      const res = await withAiRetry(() => generateText({
        model,
        system: sys,
        messages: [{ role: "user", content: userParts }],
      }));
      text = res.text;
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e?.message || "Échec IA" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse JSON safely
    let data: any = {};
    const match = text.match(/\{[\s\S]*\}/);
    try { data = JSON.parse(match ? match[0] : text); } catch { data = { _raw: text }; }
    const summary = data._summary || null;
    const confidence = typeof data._confidence === "number" ? Math.max(0, Math.min(100, data._confidence)) : null;
    delete data._summary; delete data._confidence;

    const { data: inserted, error: insErr } = await userClient.from("document_extractions").insert({
      document_id,
      version: doc.current_version,
      kind,
      data,
      summary,
      model: "google/gemini-2.5-flash",
      confidence,
      created_by: userRes.user.id,
    }).select().single();
    if (insErr) return new Response(JSON.stringify({ error: insErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    await admin.rpc("log_ai_access", {
      _agent_slug: "extract-document",
      _entity: "documents",
      _requested: "internal",
      _granted: "internal",
      _prompt_hash: document_id,
      _status: "ok",
      _error: null,
      _duration_ms: Date.now() - t0,
    });

    return new Response(JSON.stringify({ ok: true, extraction: inserted }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});