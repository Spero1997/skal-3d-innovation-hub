
-- =========================================
-- LOT 6 — Notifications & Communications
-- =========================================

-- Channel + frequency enums
DO $$ BEGIN
  CREATE TYPE public.notification_channel AS ENUM ('off','in_app','email','both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_frequency AS ENUM ('immediate','daily_digest','weekly_digest');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  notification_type public.notification_type NOT NULL,
  channel public.notification_channel NOT NULL DEFAULT 'both',
  frequency public.notification_frequency NOT NULL DEFAULT 'immediate',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, notification_type)
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own prefs select" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own prefs insert" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own prefs update" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own prefs delete" ON public.notification_preferences FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_notif_prefs_updated
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Email log
CREATE TABLE IF NOT EXISTS public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  to_email text NOT NULL,
  subject text NOT NULL,
  template_name text,
  notification_id uuid,
  status text NOT NULL DEFAULT 'queued',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "super_admin reads email_log" ON public.email_log FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_email_log_user ON public.email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_email_log_created ON public.email_log(created_at DESC);

-- Channel resolver
CREATE OR REPLACE FUNCTION public.get_user_notification_channel(
  _user_id uuid, _type public.notification_type
) RETURNS public.notification_channel
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT channel FROM public.notification_preferences
       WHERE user_id = _user_id AND notification_type = _type),
    'in_app'::public.notification_channel
  )
$$;

-- Extend notify_user to enqueue an email when wanted
CREATE OR REPLACE FUNCTION public.notify_user(
  _user_id uuid, _type public.notification_type, _title text, _body text, _link text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_notif_id uuid;
  v_channel public.notification_channel;
  v_freq public.notification_frequency;
  v_email text;
  v_url text;
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.notifications(user_id,type,title,body,link)
  VALUES (_user_id, _type, _title, _body, _link)
  RETURNING id INTO v_notif_id;

  v_channel := public.get_user_notification_channel(_user_id, _type);
  IF v_channel IN ('email','both') THEN
    SELECT COALESCE(frequency,'immediate') INTO v_freq
      FROM public.notification_preferences
      WHERE user_id = _user_id AND notification_type = _type;

    -- Digests are batched by cron; only send immediate ones here
    IF COALESCE(v_freq,'immediate') = 'immediate' THEN
      SELECT email INTO v_email FROM auth.users WHERE id = _user_id;
      IF v_email IS NOT NULL THEN
        v_url := 'https://skalservice.lovable.app' || COALESCE(_link,'');
        BEGIN
          PERFORM public.enqueue_email(
            'transactional_emails',
            jsonb_build_object(
              'to', v_email,
              'subject', '[SKAL] ' || _title,
              'template_name', 'notification_immediate',
              'html',
              '<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#121212;">'
              || '<h2 style="font-size:18px;margin:0 0 12px;">' || _title || '</h2>'
              || '<p style="font-size:15px;line-height:1.55;color:#333;">' || COALESCE(_body,'') || '</p>'
              || CASE WHEN _link IS NOT NULL THEN
                  '<p style="margin-top:20px;"><a href="' || v_url || '" style="background:#F97316;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;">Ouvrir</a></p>'
                 ELSE '' END
              || '<p style="margin-top:24px;font-size:11px;color:#888;">Vous recevez cet email selon vos préférences SKAL Services. Modifier : '
              || 'https://skalservice.lovable.app/admin/parametres/notifications</p></div>'
            )
          );
          INSERT INTO public.email_log(user_id,to_email,subject,template_name,notification_id,status)
          VALUES (_user_id, v_email, '[SKAL] '||_title, 'notification_immediate', v_notif_id, 'queued');
        EXCEPTION WHEN OTHERS THEN
          INSERT INTO public.email_log(user_id,to_email,subject,template_name,notification_id,status,error)
          VALUES (_user_id, v_email, '[SKAL] '||_title, 'notification_immediate', v_notif_id, 'failed', SQLERRM);
        END;
      END IF;
    END IF;
  END IF;
END;
$$;

-- Weekly director digest payload
CREATE OR REPLACE FUNCTION public.weekly_director_digest_payload()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_start date := (now() - interval '7 days')::date;
  v_revenu numeric := 0;
  v_dep numeric := 0;
  v_new_proj int := 0;
  v_overdue_inv int := 0;
  v_pending_dist int := 0;
  v_at_risk int := 0;
BEGIN
  SELECT COALESCE(SUM(amount),0) INTO v_revenu
    FROM public.transactions
    WHERE type='revenu' AND status='encaissee' AND transaction_date >= v_start;
  SELECT COALESCE(SUM(amount),0) INTO v_dep
    FROM public.transactions
    WHERE type='depense' AND transaction_date >= v_start;
  SELECT COUNT(*) INTO v_new_proj FROM public.projects WHERE created_at >= v_start;
  SELECT COUNT(*) INTO v_overdue_inv FROM public.invoices
    WHERE status NOT IN ('paid','cancelled') AND due_date < now();
  SELECT COUNT(*) INTO v_pending_dist FROM public.revenue_distributions
    WHERE status = 'en_attente_validation';
  SELECT COUNT(*) INTO v_at_risk FROM public.projects
    WHERE status IN ('en_cours','en_pause') AND end_date IS NOT NULL AND end_date < now() + interval '7 days';

  RETURN jsonb_build_object(
    'period_start', v_start,
    'period_end', now()::date,
    'revenue_week', v_revenu,
    'expenses_week', v_dep,
    'net_week', v_revenu - v_dep,
    'new_projects', v_new_proj,
    'overdue_invoices', v_overdue_inv,
    'pending_distributions', v_pending_dist,
    'projects_at_risk', v_at_risk
  );
END $$;
