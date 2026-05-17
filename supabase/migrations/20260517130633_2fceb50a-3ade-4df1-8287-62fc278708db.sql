-- Trigger: notify super_admins when an AI suggestion is forced
CREATE OR REPLACE FUNCTION public.on_ai_suggestion_forced()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  v_actor_email text;
  v_body text;
BEGIN
  IF NEW.decision <> 'forced' THEN
    RETURN NEW;
  END IF;
  SELECT email INTO v_actor_email FROM auth.users WHERE id = NEW.user_id;
  v_body := COALESCE(v_actor_email, 'Un utilisateur')
    || ' a forcé ' || NEW.field
    || ' (' || COALESCE(NEW.value_before,'∅') || ' → ' || COALESCE(NEW.value_after,'∅') || ')'
    || ' — confiance ' || COALESCE(NEW.confidence::text,'?') || '% / seuil ' || COALESCE(NEW.threshold::text,'?') || '%';
  FOR r IN SELECT user_id FROM public.user_roles WHERE role = 'super_admin'::public.app_role LOOP
    IF r.user_id <> NEW.user_id THEN
      PERFORM public.notify_user(r.user_id, 'system'::public.notification_type,
        'Suggestion IA forcée', v_body, '/admin/finances/historique-ia');
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ai_suggestion_forced ON public.ai_suggestion_audit;
CREATE TRIGGER trg_ai_suggestion_forced
  AFTER INSERT ON public.ai_suggestion_audit
  FOR EACH ROW EXECUTE FUNCTION public.on_ai_suggestion_forced();

-- Seed thresholds for additional AI fields (project_type, involvement_level)
INSERT INTO public.ai_role_thresholds (role, agent_slug, min_confidence, allow_force)
SELECT r, slug, conf, force
FROM (VALUES
  ('super_admin'::public.app_role, 'classify-project-type',        50, true),
  ('associe'::public.app_role,     'classify-project-type',        65, true),
  ('comptable'::public.app_role,   'classify-project-type',        70, false),
  ('chef_projet'::public.app_role, 'classify-project-type',        75, false),
  ('super_admin'::public.app_role, 'classify-involvement-level',   50, true),
  ('associe'::public.app_role,     'classify-involvement-level',   65, true),
  ('comptable'::public.app_role,   'classify-involvement-level',   70, false),
  ('chef_projet'::public.app_role, 'classify-involvement-level',   75, false)
) AS v(r, slug, conf, force)
WHERE NOT EXISTS (
  SELECT 1 FROM public.ai_role_thresholds t WHERE t.role = v.r AND t.agent_slug = v.slug
);