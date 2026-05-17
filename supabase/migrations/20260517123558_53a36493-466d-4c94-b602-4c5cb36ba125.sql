
-- ===== AI Agents catalog =====
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  model text NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  max_level public.confidentiality_level NOT NULL DEFAULT 'internal',
  system_prompt text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin manage ai agents" ON public.ai_agents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE POLICY "direction view ai agents" ON public.ai_agents
  FOR SELECT TO authenticated
  USING (public.is_direction(auth.uid()));

CREATE TRIGGER trg_ai_agents_updated
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== AI Access Log =====
CREATE TABLE IF NOT EXISTS public.ai_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  agent_slug text,
  requested_level public.confidentiality_level,
  granted_level public.confidentiality_level,
  entity text,
  prompt_hash text,
  status text NOT NULL DEFAULT 'ok',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin view ai log" ON public.ai_access_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE POLICY "users view own ai log" ON public.ai_access_log
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Inserts only via SECURITY DEFINER function below.

-- ===== Confidentiality helper =====
CREATE OR REPLACE FUNCTION public.get_user_max_ai_level(_user_id uuid, _entity text)
RETURNS public.confidentiality_level
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lvl public.confidentiality_level := 'public';
  v_role public.app_role;
BEGIN
  IF _user_id IS NULL THEN RETURN 'public'; END IF;
  -- Super admin always gets secret
  IF public.has_role(_user_id, 'super_admin'::public.app_role) THEN
    RETURN 'secret';
  END IF;
  -- Highest level across user's roles for this entity
  FOR v_role IN SELECT role FROM public.user_roles WHERE user_id = _user_id LOOP
    SELECT GREATEST(v_lvl, max_level) INTO v_lvl
    FROM public.ai_data_access
    WHERE role = v_role AND entity = _entity;
  END LOOP;
  RETURN COALESCE(v_lvl, 'public');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_max_ai_level(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_max_ai_level(uuid, text) TO authenticated;

-- ===== Logger (SECURITY DEFINER so RLS allows inserts) =====
CREATE OR REPLACE FUNCTION public.log_ai_access(
  _agent_slug text, _entity text,
  _requested public.confidentiality_level, _granted public.confidentiality_level,
  _prompt_hash text, _status text, _error text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.ai_access_log(user_id, agent_slug, entity, requested_level, granted_level, prompt_hash, status, error)
  VALUES (auth.uid(), _agent_slug, _entity, _requested, _granted, _prompt_hash, _status, _error)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_ai_access(text, text, public.confidentiality_level, public.confidentiality_level, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.log_ai_access(text, text, public.confidentiality_level, public.confidentiality_level, text, text, text) TO authenticated;

-- ===== Seed default access matrix =====
INSERT INTO public.ai_data_access (role, entity, max_level) VALUES
  ('super_admin','finances','secret'),
  ('super_admin','distributions','secret'),
  ('super_admin','commissions','secret'),
  ('super_admin','rules','secret'),
  ('associe','finances','restricted'),
  ('associe','distributions','restricted'),
  ('associe','commissions','restricted'),
  ('associe','rules','internal'),
  ('comptable','finances','restricted'),
  ('comptable','distributions','internal'),
  ('comptable','commissions','internal'),
  ('chef_projet','finances','public'),
  ('chef_projet','distributions','public'),
  ('chef_projet','commissions','public'),
  ('chef_projet','projects','internal')
ON CONFLICT DO NOTHING;

-- ===== Seed a default agent =====
INSERT INTO public.ai_agents (slug, name, description, model, max_level, system_prompt) VALUES
  ('skal-assistant', 'Skal Assistant', 'Assistant interne polyvalent', 'google/gemini-3-flash-preview', 'internal',
   'Tu es l''assistant interne de SKAL SERVICES. Ne révèle JAMAIS de pourcentages de répartition, de capital, de noms de prestataires, ni de mécanismes financiers internes. Si on te demande ces informations, refuse poliment.')
ON CONFLICT (slug) DO NOTHING;
