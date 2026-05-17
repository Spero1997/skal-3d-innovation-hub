-- Audit table
CREATE TABLE public.ai_suggestion_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  agent_slug text NOT NULL,
  entity text NOT NULL,
  field text NOT NULL,
  value_before text,
  value_after text,
  confidence integer,
  threshold integer,
  decision text NOT NULL CHECK (decision IN ('applied','blocked','forced','ignored')),
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_suggestion_audit_created ON public.ai_suggestion_audit(created_at DESC);
CREATE INDEX idx_ai_suggestion_audit_user ON public.ai_suggestion_audit(user_id);
ALTER TABLE public.ai_suggestion_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction view audit" ON public.ai_suggestion_audit
  FOR SELECT TO authenticated
  USING (is_direction(auth.uid()));

CREATE POLICY "users view own audit" ON public.ai_suggestion_audit
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users insert own audit" ON public.ai_suggestion_audit
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Per-role threshold table
CREATE TABLE public.ai_role_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  agent_slug text NOT NULL DEFAULT 'classify-project',
  min_confidence integer NOT NULL DEFAULT 70 CHECK (min_confidence BETWEEN 0 AND 100),
  allow_force boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, agent_slug)
);
ALTER TABLE public.ai_role_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction view thresholds" ON public.ai_role_thresholds
  FOR SELECT TO authenticated
  USING (is_direction(auth.uid()));

CREATE POLICY "authenticated view thresholds" ON public.ai_role_thresholds
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "super_admin manage thresholds" ON public.ai_role_thresholds
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Seed defaults per role
INSERT INTO public.ai_role_thresholds (role, agent_slug, min_confidence, allow_force) VALUES
  ('super_admin', 'classify-project', 50, true),
  ('associe',     'classify-project', 60, true),
  ('comptable',   'classify-project', 70, false),
  ('chef_projet', 'classify-project', 80, false);