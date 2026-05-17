import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

// Public endpoint: validates a share token and returns metadata + a short-lived signed URL.
// POST { token, password?, download?: boolean }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (status: number, body: any) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { token, password, download } = await req.json().catch(() => ({}));
    if (!token) return json(400, { error: "token requis" });

    const { data: share, error } = await admin.from("document_shares").select("*").eq("token", token).maybeSingle();
    if (error || !share) return json(404, { error: "Lien introuvable" });
    if (share.revoked_at) return json(410, { error: "Lien révoqué" });
    if (share.expires_at && new Date(share.expires_at) < new Date()) return json(410, { error: "Lien expiré" });
    if (share.max_downloads != null && share.download_count >= share.max_downloads) return json(410, { error: "Quota de téléchargements atteint" });

    if (share.password_hash) {
      if (!password) return json(401, { needs_password: true });
      const enc = new TextEncoder().encode(password);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
      if (hex !== share.password_hash) return json(401, { error: "Mot de passe invalide", needs_password: true });
    }

    const { data: doc } = await admin.from("documents").select("id, name, kind, current_version").eq("id", share.document_id).single();
    if (!doc) return json(404, { error: "Document introuvable" });
    const version = share.version ?? doc.current_version;
    const { data: ver } = await admin.from("document_versions").select("*").eq("document_id", share.document_id).eq("version", version).single();
    if (!ver) return json(404, { error: "Version introuvable" });

    const meta = {
      document: { name: doc.name, kind: doc.kind, version, original_name: ver.original_name, mime_type: ver.mime_type, size_bytes: ver.size_bytes },
      share: { label: share.label, expires_at: share.expires_at, downloads_left: share.max_downloads == null ? null : share.max_downloads - share.download_count },
    };

    if (!download) return json(200, { ok: true, ...meta });

    const { data: signed, error: sErr } = await admin.storage.from("project-files").createSignedUrl(ver.storage_path, 300, { download: ver.original_name });
    if (sErr || !signed?.signedUrl) return json(500, { error: "URL de téléchargement indisponible" });

    await admin.from("document_shares").update({ download_count: share.download_count + 1 }).eq("id", share.id);

    return json(200, { ok: true, download_url: signed.signedUrl, ...meta });
  } catch (e: any) {
    return json(500, { error: e?.message || String(e) });
  }
});