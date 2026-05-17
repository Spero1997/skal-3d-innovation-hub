ALTER TABLE public.ai_access_log ADD COLUMN IF NOT EXISTS duration_ms integer;

CREATE OR REPLACE FUNCTION public.log_ai_access(
  _agent_slug text,
  _entity text,
  _requested confidentiality_level,
  _granted confidentiality_level,
  _prompt_hash text,
  _status text,
  _error text,
  _duration_ms integer DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.ai_access_log(user_id, agent_slug, entity, requested_level, granted_level, prompt_hash, status, error, duration_ms)
  VALUES (auth.uid(), _agent_slug, _entity, _requested, _granted, _prompt_hash, _status, _error, _duration_ms)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$function$;

CREATE INDEX IF NOT EXISTS idx_ai_access_log_created_at ON public.ai_access_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_access_log_user_id ON public.ai_access_log(user_id);