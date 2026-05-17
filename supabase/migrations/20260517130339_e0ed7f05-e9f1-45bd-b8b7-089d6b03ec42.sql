CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON public.audit_log(actor_id);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin view audit_log"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE POLICY "users insert own audit_log"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);

-- Trigger: track role changes
CREATE OR REPLACE FUNCTION public.on_user_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_email text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT email INTO v_target_email FROM auth.users WHERE id = NEW.user_id;
    INSERT INTO public.audit_log(actor_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(), 'role_granted', 'user', NEW.user_id,
      jsonb_build_object('role', NEW.role, 'target_email', v_target_email));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT email INTO v_target_email FROM auth.users WHERE id = OLD.user_id;
    INSERT INTO public.audit_log(actor_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(), 'role_revoked', 'user', OLD.user_id,
      jsonb_build_object('role', OLD.role, 'target_email', v_target_email));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_roles_audit ON public.user_roles;
CREATE TRIGGER trg_user_roles_audit
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.on_user_role_change();