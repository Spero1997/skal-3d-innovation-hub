
-- ============================================================
-- LOT 1 — Moteur financier dynamique
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE public.confidentiality_level AS ENUM ('public','internal','restricted','secret');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.beneficiary_type AS ENUM (
    'caisse','spero','associe','apporteur_affaires',
    'prestataire_interne','prestataire_externe','commission_commercial',
    'dividende_pool','custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.allocation_basis AS ENUM ('gross','net_after_caisse','net_after_costs','fixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.distribution_status AS ENUM ('appliquee','en_attente_validation','rejetee','annulee');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.commission_status AS ENUM ('a_valider','validee','payee','annulee');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.validation_status AS ENUM ('en_attente','approuvee','rejetee');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add status column to revenue_distributions if missing
ALTER TABLE public.revenue_distributions
  ADD COLUMN IF NOT EXISTS status public.distribution_status NOT NULL DEFAULT 'appliquee',
  ADD COLUMN IF NOT EXISTS rule_id uuid,
  ADD COLUMN IF NOT EXISTS rule_set_id uuid;

-- ============================================================
-- finance_rule_sets
-- ============================================================
CREATE TABLE IF NOT EXISTS public.finance_rule_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  version integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT false,
  effective_from date,
  effective_to date,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.finance_rule_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin manage rule sets" ON public.finance_rule_sets
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "direction view rule sets" ON public.finance_rule_sets
  FOR SELECT TO authenticated USING (is_direction(auth.uid()));

CREATE TRIGGER finance_rule_sets_updated_at
  BEFORE UPDATE ON public.finance_rule_sets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- finance_rules
-- ============================================================
CREATE TABLE IF NOT EXISTS public.finance_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_set_id uuid NOT NULL REFERENCES public.finance_rule_sets(id) ON DELETE CASCADE,
  name text NOT NULL,
  priority integer NOT NULL DEFAULT 100,
  condition jsonb NOT NULL DEFAULT '{}'::jsonb,
  allocations jsonb NOT NULL DEFAULT '[]'::jsonb,
  requires_validation boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_finance_rules_set ON public.finance_rules(rule_set_id, priority);
ALTER TABLE public.finance_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin manage rules" ON public.finance_rules
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "direction view rules" ON public.finance_rules
  FOR SELECT TO authenticated USING (is_direction(auth.uid()));

CREATE TRIGGER finance_rules_updated_at
  BEFORE UPDATE ON public.finance_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- apporteurs_affaires
-- ============================================================
CREATE TABLE IF NOT EXISTS public.apporteurs_affaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_email text,
  contact_phone text,
  default_commission_rate numeric(5,2) NOT NULL DEFAULT 10.0,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.apporteurs_affaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage apporteurs" ON public.apporteurs_affaires
  FOR ALL TO authenticated
  USING (is_direction(auth.uid()))
  WITH CHECK (is_direction(auth.uid()));

CREATE TRIGGER apporteurs_updated_at
  BEFORE UPDATE ON public.apporteurs_affaires
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- prestataires
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prestataires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'externe', -- 'interne'|'externe'
  speciality text,
  contact_email text,
  contact_phone text,
  default_rate numeric(5,2),
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT prestataires_kind_check CHECK (kind IN ('interne','externe'))
);
ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage prestataires" ON public.prestataires
  FOR ALL TO authenticated
  USING (is_direction(auth.uid()))
  WITH CHECK (is_direction(auth.uid()));

CREATE TRIGGER prestataires_updated_at
  BEFORE UPDATE ON public.prestataires
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- commissions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid,
  distribution_id uuid,
  beneficiary_type public.beneficiary_type NOT NULL,
  beneficiary_user_id uuid,
  beneficiary_apporteur_id uuid REFERENCES public.apporteurs_affaires(id) ON DELETE SET NULL,
  beneficiary_prestataire_id uuid REFERENCES public.prestataires(id) ON DELETE SET NULL,
  beneficiary_label text,
  amount numeric(14,2) NOT NULL,
  status public.commission_status NOT NULL DEFAULT 'a_valider',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_commissions_tx ON public.commissions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage commissions" ON public.commissions
  FOR ALL TO authenticated
  USING (is_direction(auth.uid()))
  WITH CHECK (is_direction(auth.uid()));

CREATE POLICY "beneficiary view own commissions" ON public.commissions
  FOR SELECT TO authenticated
  USING (beneficiary_user_id = auth.uid());

CREATE TRIGGER commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- financial_validations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.financial_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL, -- 'transaction'|'distribution'|'payout'|'commission'
  entity_id uuid NOT NULL,
  requested_by uuid,
  validator_id uuid,
  status public.validation_status NOT NULL DEFAULT 'en_attente',
  comment text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  validated_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_validations_status ON public.financial_validations(status, created_at DESC);
ALTER TABLE public.financial_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage validations" ON public.financial_validations
  FOR ALL TO authenticated
  USING (is_direction(auth.uid()))
  WITH CHECK (is_direction(auth.uid()));

-- ============================================================
-- financial_scenarios
-- ============================================================
CREATE TABLE IF NOT EXISTS public.financial_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  rule_set_id uuid REFERENCES public.finance_rule_sets(id) ON DELETE SET NULL,
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.financial_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin manage scenarios" ON public.financial_scenarios
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- ============================================================
-- ai_data_access (matrice de confidentialité)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_data_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  entity text NOT NULL, -- 'finance_rules','distributions','commissions','clients',...
  max_level public.confidentiality_level NOT NULL DEFAULT 'internal',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, entity)
);
ALTER TABLE public.ai_data_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin manage ai access" ON public.ai_data_access
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "direction view ai access" ON public.ai_data_access
  FOR SELECT TO authenticated USING (is_direction(auth.uid()));

-- ============================================================
-- Function: apply_finance_rules
-- Orchestrator that resolves the active rule_set & matches a rule
-- ============================================================
CREATE OR REPLACE FUNCTION public.apply_finance_rules(_transaction_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx public.transactions%ROWTYPE;
  v_proj public.projects%ROWTYPE;
  v_set public.finance_rule_sets%ROWTYPE;
  v_rule public.finance_rules%ROWTYPE;
  v_alloc jsonb;
  v_caisse numeric(14,2) := 0;
  v_prestataire numeric(14,2) := 0;
  v_spero numeric(14,2) := 0;
  v_associe numeric(14,2) := 0;
  v_base numeric(14,2);
  v_amt numeric(14,2);
  v_pct numeric(7,4);
  v_match boolean;
  v_cond jsonb;
BEGIN
  SELECT * INTO v_tx FROM public.transactions WHERE id = _transaction_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','transaction not found'); END IF;
  IF v_tx.project_id IS NOT NULL THEN
    SELECT * INTO v_proj FROM public.projects WHERE id = v_tx.project_id;
  END IF;

  -- Find active rule_set (most recent active, effective)
  SELECT * INTO v_set FROM public.finance_rule_sets
    WHERE is_active = true
      AND (effective_from IS NULL OR effective_from <= v_tx.transaction_date)
      AND (effective_to   IS NULL OR effective_to   >= v_tx.transaction_date)
    ORDER BY created_at DESC LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('matched', false, 'reason','no active rule set');
  END IF;

  -- Find first matching rule by priority
  FOR v_rule IN
    SELECT * FROM public.finance_rules WHERE rule_set_id = v_set.id ORDER BY priority ASC, created_at ASC
  LOOP
    v_cond := v_rule.condition;
    v_match := true;
    IF v_cond ? 'project_domain' AND v_proj.id IS NOT NULL
      AND (v_cond->>'project_domain') <> v_proj.domain::text THEN v_match := false; END IF;
    IF v_cond ? 'distribution_case' AND v_tx.distribution_case IS NOT NULL
      AND (v_cond->>'distribution_case') <> v_tx.distribution_case::text THEN v_match := false; END IF;
    IF v_cond ? 'amount_min' AND v_tx.amount < (v_cond->>'amount_min')::numeric THEN v_match := false; END IF;
    IF v_cond ? 'amount_max' AND v_tx.amount > (v_cond->>'amount_max')::numeric THEN v_match := false; END IF;
    IF v_match THEN EXIT; END IF;
  END LOOP;

  IF NOT v_match OR v_rule.id IS NULL THEN
    RETURN jsonb_build_object('matched', false, 'rule_set_id', v_set.id);
  END IF;

  -- Compute allocations
  FOR v_alloc IN SELECT * FROM jsonb_array_elements(v_rule.allocations)
  LOOP
    v_pct := COALESCE((v_alloc->>'percent')::numeric, 0);
    v_base := CASE COALESCE(v_alloc->>'basis','gross')
      WHEN 'gross' THEN v_tx.amount
      WHEN 'net_after_caisse' THEN v_tx.amount - v_caisse
      WHEN 'net_after_costs' THEN v_tx.amount - v_caisse - v_prestataire
      ELSE v_tx.amount END;
    v_amt := COALESCE((v_alloc->>'fixed_amount')::numeric, ROUND(v_base * v_pct / 100, 2));

    CASE v_alloc->>'beneficiary_type'
      WHEN 'caisse' THEN v_caisse := v_caisse + v_amt;
      WHEN 'prestataire_externe' THEN v_prestataire := v_prestataire + v_amt;
      WHEN 'prestataire_interne' THEN v_prestataire := v_prestataire + v_amt;
      WHEN 'spero' THEN v_spero := v_spero + v_amt;
      WHEN 'associe' THEN v_associe := v_associe + v_amt;
      ELSE NULL;
    END CASE;

    -- Record commission row for traceability
    INSERT INTO public.commissions (
      transaction_id, beneficiary_type, beneficiary_label, amount,
      status
    ) VALUES (
      v_tx.id, (v_alloc->>'beneficiary_type')::public.beneficiary_type,
      v_alloc->>'beneficiary_label', v_amt,
      CASE WHEN v_rule.requires_validation THEN 'a_valider'::public.commission_status
           ELSE 'validee'::public.commission_status END
    );
  END LOOP;

  -- Insert distribution snapshot
  INSERT INTO public.revenue_distributions(
    transaction_id, project_id, case_used, gross_amount,
    caisse_share, prestataire_share, net_after_caisse_and_prestataire,
    spero_share, associe_share, associe_id, rule_set_id, rule_id, status
  ) VALUES (
    v_tx.id, v_tx.project_id, COALESCE(v_tx.distribution_case, 'cas1_interne'),
    v_tx.amount, v_caisse, v_prestataire,
    v_tx.amount - v_caisse - v_prestataire,
    v_spero, v_associe, v_tx.associe_id, v_set.id, v_rule.id,
    CASE WHEN v_rule.requires_validation THEN 'en_attente_validation'::public.distribution_status
         ELSE 'appliquee'::public.distribution_status END
  );

  IF v_rule.requires_validation THEN
    INSERT INTO public.financial_validations(entity_type, entity_id, requested_by, context)
    VALUES ('transaction', v_tx.id, v_tx.created_by,
      jsonb_build_object('rule_id', v_rule.id, 'amount', v_tx.amount));
  END IF;

  RETURN jsonb_build_object(
    'matched', true,
    'rule_set_id', v_set.id,
    'rule_id', v_rule.id,
    'caisse', v_caisse,
    'prestataire', v_prestataire,
    'spero', v_spero,
    'associe', v_associe,
    'requires_validation', v_rule.requires_validation
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.apply_finance_rules(uuid) FROM PUBLIC, anon, authenticated;

-- ============================================================
-- Refactor handle_revenue_distribution: try engine first, fallback legacy
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_revenue_distribution()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caisse numeric(14,2);
  v_prestataire numeric(14,2) := 0;
  v_net numeric(14,2);
  v_spero numeric(14,2) := 0;
  v_associe numeric(14,2) := 0;
  v_engine jsonb;
BEGIN
  IF NEW.type <> 'revenu' OR NEW.status <> 'encaissee' THEN RETURN NEW; END IF;
  IF EXISTS (SELECT 1 FROM public.revenue_distributions WHERE transaction_id = NEW.id) THEN RETURN NEW; END IF;

  -- Try the dynamic engine first
  v_engine := public.apply_finance_rules(NEW.id);
  IF (v_engine->>'matched')::boolean = true THEN
    -- engine handled it
    INSERT INTO public.cash_movements (direction, amount, label, source_transaction_id, movement_date, created_by)
    VALUES ('entree', (v_engine->>'caisse')::numeric,
      'Caisse (règle dynamique)' || COALESCE(' — ' || NEW.description, ''),
      NEW.id, NEW.transaction_date, NEW.created_by);
    IF NEW.project_id IS NOT NULL THEN
      UPDATE public.projects SET amount_collected = COALESCE(amount_collected,0) + NEW.amount WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
  END IF;

  -- ===== Legacy fallback (cas1/cas2/cas3) =====
  IF NEW.distribution_case IS NULL THEN
    RAISE EXCEPTION 'distribution_case is required for revenu encaissé (aucune règle dynamique ne matche)';
  END IF;

  v_caisse := ROUND(NEW.amount * 0.15, 2);

  IF NEW.distribution_case = 'cas1_interne' THEN
    v_net := NEW.amount - v_caisse;
    v_spero := ROUND(NEW.amount * 0.70, 2);
    v_associe := NEW.amount - v_caisse - v_spero;
  ELSIF NEW.distribution_case = 'cas2_forfait' THEN
    v_prestataire := ROUND(NEW.amount * 0.35, 2);
    v_spero := ROUND(NEW.amount * 0.35, 2);
    v_associe := NEW.amount - v_caisse - v_prestataire - v_spero;
    v_net := NEW.amount - v_caisse - v_prestataire;
  ELSIF NEW.distribution_case = 'cas3_au_cout' THEN
    v_prestataire := COALESCE(NEW.prestataire_cost, 0);
    v_net := NEW.amount - v_caisse - v_prestataire;
    IF v_net < 0 THEN RAISE EXCEPTION 'Coût prestataire trop élevé'; END IF;
    v_spero := ROUND(v_net / 2, 2);
    v_associe := v_net - v_spero;
  END IF;

  INSERT INTO public.revenue_distributions (
    transaction_id, project_id, case_used, gross_amount,
    caisse_share, prestataire_share, net_after_caisse_and_prestataire,
    spero_share, associe_share, associe_id, prestataire_name, status
  ) VALUES (
    NEW.id, NEW.project_id, NEW.distribution_case, NEW.amount,
    v_caisse, v_prestataire, v_net,
    v_spero, v_associe, NEW.associe_id, NEW.prestataire_name, 'appliquee'
  );

  INSERT INTO public.cash_movements (direction, amount, label, source_transaction_id, movement_date, created_by)
  VALUES ('entree', v_caisse, '15% sur revenu' ||
    CASE WHEN NEW.description IS NOT NULL THEN ' — ' || NEW.description ELSE '' END,
    NEW.id, NEW.transaction_date, NEW.created_by);

  IF NEW.project_id IS NOT NULL THEN
    UPDATE public.projects SET amount_collected = COALESCE(amount_collected,0) + NEW.amount WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_revenue_distribution() FROM PUBLIC, anon, authenticated;

-- ============================================================
-- Function: simulate_rule_set (preview without writing)
-- ============================================================
CREATE OR REPLACE FUNCTION public.simulate_rule_set(_rule_set_id uuid, _amount numeric, _context jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rule public.finance_rules%ROWTYPE;
  v_alloc jsonb;
  v_results jsonb := '[]'::jsonb;
  v_caisse numeric := 0;
  v_prestataire numeric := 0;
  v_base numeric;
  v_amt numeric;
  v_pct numeric;
  v_match boolean;
  v_cond jsonb;
BEGIN
  IF NOT has_role(auth.uid(),'super_admin'::app_role) AND NOT is_direction(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  FOR v_rule IN
    SELECT * FROM public.finance_rules WHERE rule_set_id = _rule_set_id ORDER BY priority ASC
  LOOP
    v_cond := v_rule.condition;
    v_match := true;
    IF v_cond ? 'amount_min' AND _amount < (v_cond->>'amount_min')::numeric THEN v_match := false; END IF;
    IF v_cond ? 'amount_max' AND _amount > (v_cond->>'amount_max')::numeric THEN v_match := false; END IF;
    IF v_cond ? 'project_domain' AND _context ? 'project_domain'
      AND (v_cond->>'project_domain') <> (_context->>'project_domain') THEN v_match := false; END IF;
    IF v_match THEN EXIT; END IF;
  END LOOP;

  IF NOT v_match OR v_rule.id IS NULL THEN
    RETURN jsonb_build_object('matched', false);
  END IF;

  FOR v_alloc IN SELECT * FROM jsonb_array_elements(v_rule.allocations)
  LOOP
    v_pct := COALESCE((v_alloc->>'percent')::numeric, 0);
    v_base := CASE COALESCE(v_alloc->>'basis','gross')
      WHEN 'gross' THEN _amount
      WHEN 'net_after_caisse' THEN _amount - v_caisse
      WHEN 'net_after_costs' THEN _amount - v_caisse - v_prestataire
      ELSE _amount END;
    v_amt := COALESCE((v_alloc->>'fixed_amount')::numeric, ROUND(v_base * v_pct / 100, 2));
    IF v_alloc->>'beneficiary_type' = 'caisse' THEN v_caisse := v_caisse + v_amt;
    ELSIF v_alloc->>'beneficiary_type' LIKE 'prestataire%' THEN v_prestataire := v_prestataire + v_amt; END IF;
    v_results := v_results || jsonb_build_object(
      'beneficiary_type', v_alloc->>'beneficiary_type',
      'label', v_alloc->>'beneficiary_label',
      'amount', v_amt,
      'percent', v_pct
    );
  END LOOP;

  RETURN jsonb_build_object('matched', true, 'rule_id', v_rule.id, 'allocations', v_results);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.simulate_rule_set(uuid, numeric, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.simulate_rule_set(uuid, numeric, jsonb) TO authenticated;

-- ============================================================
-- Seed: rule_set "Skal Historique v1" reproduisant les 3 cas
-- ============================================================
INSERT INTO public.finance_rule_sets (name, description, version, is_active, effective_from)
SELECT 'Skal Historique v1',
  'Reproduit les 3 cas de répartition historiques (interne / forfait / au coût). Désactivé par défaut.',
  1, false, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM public.finance_rule_sets WHERE name = 'Skal Historique v1');

DO $$
DECLARE v_set_id uuid;
BEGIN
  SELECT id INTO v_set_id FROM public.finance_rule_sets WHERE name = 'Skal Historique v1' LIMIT 1;
  IF v_set_id IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.finance_rules WHERE rule_set_id = v_set_id) THEN RETURN; END IF;

  INSERT INTO public.finance_rules (rule_set_id, name, priority, condition, allocations) VALUES
  (v_set_id, 'Cas 1 — Interne', 10,
   '{"distribution_case":"cas1_interne"}'::jsonb,
   '[
     {"beneficiary_type":"caisse","beneficiary_label":"Caisse","basis":"gross","percent":15},
     {"beneficiary_type":"spero","beneficiary_label":"Spero","basis":"gross","percent":70},
     {"beneficiary_type":"associe","beneficiary_label":"Associé","basis":"gross","percent":15}
   ]'::jsonb),
  (v_set_id, 'Cas 2 — Prestataire forfait', 20,
   '{"distribution_case":"cas2_forfait"}'::jsonb,
   '[
     {"beneficiary_type":"caisse","beneficiary_label":"Caisse","basis":"gross","percent":15},
     {"beneficiary_type":"prestataire_externe","beneficiary_label":"Prestataire","basis":"gross","percent":35},
     {"beneficiary_type":"spero","beneficiary_label":"Spero","basis":"gross","percent":35},
     {"beneficiary_type":"associe","beneficiary_label":"Associé","basis":"gross","percent":15}
   ]'::jsonb),
  (v_set_id, 'Cas 3 — Prestataire au coût', 30,
   '{"distribution_case":"cas3_au_cout"}'::jsonb,
   '[
     {"beneficiary_type":"caisse","beneficiary_label":"Caisse","basis":"gross","percent":15},
     {"beneficiary_type":"spero","beneficiary_label":"Spero","basis":"net_after_costs","percent":50},
     {"beneficiary_type":"associe","beneficiary_label":"Associé","basis":"net_after_costs","percent":50}
   ]'::jsonb);
END $$;

-- Seed default AI confidentiality matrix
INSERT INTO public.ai_data_access (role, entity, max_level) VALUES
  ('super_admin','finance_rules','secret'),
  ('super_admin','distributions','secret'),
  ('super_admin','commissions','secret'),
  ('associe','finance_rules','restricted'),
  ('associe','distributions','restricted'),
  ('comptable','finance_rules','restricted'),
  ('comptable','distributions','restricted'),
  ('comptable','commissions','restricted'),
  ('chef_projet','finance_rules','public'),
  ('chef_projet','distributions','public'),
  ('chef_projet','commissions','public')
ON CONFLICT (role, entity) DO NOTHING;
