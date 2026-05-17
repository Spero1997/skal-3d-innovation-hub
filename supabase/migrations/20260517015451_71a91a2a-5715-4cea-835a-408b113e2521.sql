
CREATE OR REPLACE FUNCTION public.simulate_rule_set(_rule_set_id uuid, _amount numeric, _context jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
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
