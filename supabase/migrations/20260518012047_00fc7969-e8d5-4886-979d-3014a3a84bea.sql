
CREATE OR REPLACE FUNCTION public.apply_ai_distribution(_validation_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  v_val public.financial_validations%ROWTYPE;
  v_tx public.transactions%ROWTYPE;
  v_sug jsonb;
  v_caisse numeric(14,2);
  v_spero numeric(14,2);
  v_associe numeric(14,2);
  v_prest numeric(14,2);
BEGIN
  IF NOT public.is_direction(auth.uid()) THEN
    RAISE EXCEPTION 'Permission refusée';
  END IF;

  SELECT * INTO v_val FROM public.financial_validations WHERE id = _validation_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Validation introuvable'; END IF;
  IF v_val.entity_type <> 'transaction_ai_suggestion' THEN
    RAISE EXCEPTION 'Type validation incorrect';
  END IF;

  v_sug := v_val.context->'ai_suggestion';
  IF v_sug IS NULL THEN RAISE EXCEPTION 'Aucune suggestion IA disponible'; END IF;

  SELECT * INTO v_tx FROM public.transactions WHERE id = v_val.entity_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Transaction introuvable'; END IF;

  IF EXISTS (SELECT 1 FROM public.revenue_distributions WHERE transaction_id = v_tx.id) THEN
    RAISE EXCEPTION 'Répartition déjà appliquée';
  END IF;

  v_caisse := COALESCE((v_sug->>'caisse')::numeric, ROUND(v_tx.amount * 0.15, 2));
  v_spero := COALESCE((v_sug->>'spero')::numeric, 0);
  v_associe := COALESCE((v_sug->>'associe')::numeric, 0);
  v_prest := COALESCE((v_sug->>'prestataire')::numeric, 0);

  INSERT INTO public.revenue_distributions(
    transaction_id, project_id, case_used, gross_amount,
    caisse_share, prestataire_share, net_after_caisse_and_prestataire,
    spero_share, associe_share, status
  ) VALUES (
    v_tx.id, v_tx.project_id, 'cas1_interne', v_tx.amount,
    v_caisse, v_prest, v_tx.amount - v_caisse - v_prest,
    v_spero, v_associe, 'appliquee'
  );

  INSERT INTO public.commissions (transaction_id, beneficiary_type, beneficiary_label, amount, status)
  VALUES
    (v_tx.id, 'spero', 'Spero (IA)', v_spero, 'validee'),
    (v_tx.id, 'associe', 'Associé (IA)', v_associe, 'validee');
  IF v_prest > 0 THEN
    INSERT INTO public.commissions (transaction_id, beneficiary_type, beneficiary_label, amount, status)
    VALUES (v_tx.id, 'prestataire_externe', 'Prestataire (IA)', v_prest, 'validee');
  END IF;

  UPDATE public.financial_validations
    SET status = 'approuvee', validator_id = auth.uid(), validated_at = now()
    WHERE id = _validation_id;

  RETURN jsonb_build_object('ok', true, 'caisse', v_caisse, 'spero', v_spero, 'associe', v_associe, 'prestataire', v_prest);
END;
$$;
