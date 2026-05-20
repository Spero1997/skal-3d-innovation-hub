import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supaUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supaUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'Not signed in' }, 401);

    const { data: roles } = await userClient.from('user_roles').select('role').eq('user_id', user.id);
    const isSuper = (roles ?? []).some((r: any) => r.role === 'super_admin');
    if (!isSuper) return json({ error: 'Only super_admin can invite' }, 403);

    const { email, role, full_name } = await req.json();
    if (!email || !role) return json({ error: 'email and role required' }, 400);
    const validRoles = ['super_admin','associe','comptable','chef_projet','secretaire'];
    if (!validRoles.includes(role)) return json({ error: 'invalid role' }, 400);

    const admin = createClient(supaUrl, serviceKey);

    // Try to invite. If user already exists, look them up and just (re)assign the role.
    let newUserId: string | undefined;
    const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: full_name ?? email },
    });

    if (invErr) {
      const msg = String(invErr.message ?? '').toLowerCase();
      const alreadyExists =
        msg.includes('already') || msg.includes('registered') || msg.includes('exists') ||
        (invErr as any)?.status === 422;
      if (!alreadyExists) return json({ error: invErr.message }, 400);

      // Find existing user by listing pages (max 10 pages of 100)
      for (let page = 1; page <= 10 && !newUserId; page++) {
        const { data: list } = await admin.auth.admin.listUsers({ page, perPage: 100 });
        const found = list?.users?.find((u: any) => (u.email ?? '').toLowerCase() === email.toLowerCase());
        if (found) newUserId = found.id;
        if (!list?.users?.length) break;
      }
      if (!newUserId) return json({ error: 'Utilisateur existant mais introuvable' }, 404);
    } else {
      newUserId = invited.user?.id;
    }

    if (newUserId) {
      // Idempotent: ignore unique-violation if role already present
      const { error: roleErr } = await admin
        .from('user_roles')
        .upsert({ user_id: newUserId, role }, { onConflict: 'user_id,role' });
      if (roleErr) return json({ error: `Rôle non assigné: ${roleErr.message}` }, 400);
    }

    return json({ ok: true, user_id: newUserId, reused: !!invErr });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
