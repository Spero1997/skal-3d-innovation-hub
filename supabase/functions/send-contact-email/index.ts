import { corsHeaders } from "@supabase/supabase-js/cors";
import { z } from "npm:zod@3.23.8";

const TO_EMAIL = "skalservice.0@gmail.com";

const BodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { name, email, subject, message } = parsed.data;
    const subj = subject && subject.length > 0 ? subject : `Nouveau message de ${name}`;

    const html = `
      <div style="font-family: -apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#121212;">
        <h2 style="font-size:20px;margin:0 0 16px;">Nouveau message — Skal Service</h2>
        <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">De</p>
        <p style="margin:0 0 16px;font-size:16px;"><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
        <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Sujet</p>
        <p style="margin:0 0 16px;font-size:16px;">${escapeHtml(subj)}</p>
        <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Message</p>
        <div style="white-space:pre-wrap;background:#f6f4ef;padding:16px;border-left:3px solid #ff5f1f;font-size:15px;line-height:1.55;">${escapeHtml(message)}</div>
        <p style="margin-top:24px;font-size:12px;color:#888;">Envoyé depuis le formulaire de contact du site.</p>
      </div>`;

    // Enqueue via Lovable Email (transactional queue)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const enqueueRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/enqueue_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
      body: JSON.stringify({
        p_queue: "transactional_emails",
        p_payload: {
          to: TO_EMAIL,
          reply_to: email,
          subject: subj,
          html,
          template_name: "contact_form",
        },
      }),
    });

    if (!enqueueRes.ok) {
      const txt = await enqueueRes.text();
      console.error("enqueue_email failed", enqueueRes.status, txt);
      return new Response(JSON.stringify({ error: "enqueue_failed", detail: txt }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-email error", err);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});