// Cron: chaque lundi 07h00 — digest hebdo direction (super_admin/associe/comptable)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " XOF";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const h = {
    "Content-Type": "application/json",
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
  };

  try {
    // Agrégat
    const payloadRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/weekly_director_digest_payload`, {
      method: "POST",
      headers: h,
      body: "{}",
    });
    const payload = await payloadRes.json();

    // Destinataires : direction
    const rolesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_roles?select=user_id&role=in.(super_admin,associe,comptable,secretaire)`,
      { headers: h },
    );
    const roles = (await rolesRes.json()) as Array<{ user_id: string }>;
    const uniqUsers = [...new Set(roles.map((r) => r.user_id))];

    let sent = 0;
    for (const userId of uniqUsers) {
      // Préférence : si l'utilisateur a coupé 'system' ou choisi weekly_digest, on envoie
      const prefRes = await fetch(
        `${SUPABASE_URL}/rest/v1/notification_preferences?user_id=eq.${userId}&notification_type=eq.system&select=channel,frequency`,
        { headers: h },
      );
      const prefs = (await prefRes.json()) as Array<{ channel: string; frequency: string }>;
      const pref = prefs[0];
      if (pref && pref.channel === "off") continue;

      // email
      const userRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
        { headers: h },
      );
      const userJson = await userRes.json();
      const email = userJson?.email;
      if (!email) continue;

      const html = `
        <div style="font-family:-apple-system,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#121212;">
          <h2 style="font-size:20px;margin:0 0 4px;">Digest hebdo — Direction SKAL</h2>
          <p style="margin:0 0 20px;color:#666;font-size:13px;">Semaine du ${payload.period_start} au ${payload.period_end}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Revenus encaissés</td><td style="text-align:right;font-weight:600;">${fmt(Number(payload.revenue_week))}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Dépenses</td><td style="text-align:right;font-weight:600;">${fmt(Number(payload.expenses_week))}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Net</td><td style="text-align:right;font-weight:700;color:${Number(payload.net_week) >= 0 ? "#059669" : "#dc2626"};">${fmt(Number(payload.net_week))}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Nouveaux projets</td><td style="text-align:right;">${payload.new_projects}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Factures en retard</td><td style="text-align:right;color:#dc2626;">${payload.overdue_invoices}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Distributions à valider</td><td style="text-align:right;">${payload.pending_distributions}</td></tr>
            <tr><td style="padding:8px 0;">Projets à risque (≤7j)</td><td style="text-align:right;">${payload.projects_at_risk}</td></tr>
          </table>
          <p style="margin-top:24px;">
            <a href="https://skalservice.lovable.app/admin" style="background:#F97316;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;">Ouvrir le tableau de bord</a>
          </p>
          <p style="margin-top:24px;font-size:11px;color:#888;">Préférences : https://skalservice.lovable.app/admin/parametres/notifications</p>
        </div>`;

      const enq = await fetch(`${SUPABASE_URL}/rest/v1/rpc/enqueue_email`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          p_queue: "transactional_emails",
          p_payload: {
            to: email,
            subject: `[SKAL] Digest direction — ${payload.period_end}`,
            template_name: "weekly_director_digest",
            html,
          },
        }),
      });

      await fetch(`${SUPABASE_URL}/rest/v1/email_log`, {
        method: "POST",
        headers: { ...h, Prefer: "return=minimal" },
        body: JSON.stringify({
          user_id: userId,
          to_email: email,
          subject: `[SKAL] Digest direction — ${payload.period_end}`,
          template_name: "weekly_director_digest",
          status: enq.ok ? "queued" : "failed",
          error: enq.ok ? null : await enq.text(),
        }),
      });
      if (enq.ok) sent++;
    }

    return new Response(JSON.stringify({ ok: true, sent, payload }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cron-weekly-digest error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
