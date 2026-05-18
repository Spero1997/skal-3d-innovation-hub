
-- Activate the existing rule set
UPDATE public.finance_rule_sets SET is_active = true WHERE id = '31691c08-4165-408d-8210-62b4e14c67d6';

-- Add domain-aware rules (priority before generic ones)
INSERT INTO public.finance_rules (rule_set_id, name, priority, condition, allocations, requires_validation, notes) VALUES
  ('31691c08-4165-408d-8210-62b4e14c67d6', 'Architecture/BTP — Interne', 5,
    '{"distribution_case":"cas1_interne","project_domain":"architecture_btp"}'::jsonb,
    '[{"basis":"gross","beneficiary_type":"caisse","beneficiary_label":"Caisse","percent":15},
      {"basis":"gross","beneficiary_type":"spero","beneficiary_label":"Spero","percent":65},
      {"basis":"gross","beneficiary_type":"associe","beneficiary_label":"Associé","percent":20}]'::jsonb,
    false, 'BTP plus capitalistique, part associé légèrement majorée'),
  ('31691c08-4165-408d-8210-62b4e14c67d6', 'Web/Digital — Interne', 6,
    '{"distribution_case":"cas1_interne","project_domain":"web_digital"}'::jsonb,
    '[{"basis":"gross","beneficiary_type":"caisse","beneficiary_label":"Caisse","percent":15},
      {"basis":"gross","beneficiary_type":"spero","beneficiary_label":"Spero","percent":75},
      {"basis":"gross","beneficiary_type":"associe","beneficiary_label":"Associé","percent":10}]'::jsonb,
    false, 'Web/Digital majoritairement Spero'),
  ('31691c08-4165-408d-8210-62b4e14c67d6', 'Graphisme/IA — Interne', 7,
    '{"distribution_case":"cas1_interne","project_domain":"graphisme_ia"}'::jsonb,
    '[{"basis":"gross","beneficiary_type":"caisse","beneficiary_label":"Caisse","percent":15},
      {"basis":"gross","beneficiary_type":"spero","beneficiary_label":"Spero","percent":75},
      {"basis":"gross","beneficiary_type":"associe","beneficiary_label":"Associé","percent":10}]'::jsonb,
    false, 'Graphisme/IA majoritairement Spero'),
  ('31691c08-4165-408d-8210-62b4e14c67d6', 'Géomatique/SIG — Interne', 8,
    '{"distribution_case":"cas1_interne","project_domain":"geomatique_sig"}'::jsonb,
    '[{"basis":"gross","beneficiary_type":"caisse","beneficiary_label":"Caisse","percent":15},
      {"basis":"gross","beneficiary_type":"spero","beneficiary_label":"Spero","percent":70},
      {"basis":"gross","beneficiary_type":"associe","beneficiary_label":"Associé","percent":15}]'::jsonb,
    false, 'Géomatique/SIG, équilibre standard');

-- New trigger: if no rule matches and no distribution_case, do NOT throw.
-- Instead: book caisse 15% immediately, queue a validation for AI suggestion on the remaining 85%.
CREATE OR REPLACE FUNCTION public.handle_revenue_distribution()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    INSERT INTO public.cash_movements (direction, amount, label, source_transaction_id, movement_date, created_by)
    VALUES ('entree', (v_engine->>'caisse')::numeric,
      'Caisse (règle dynamique)' || COALESCE(' — ' || NEW.description, ''),
      NEW.id, NEW.transaction_date, NEW.created_by);
    IF NEW.project_id IS NOT NULL THEN
      UPDATE public.projects SET amount_collected = COALESCE(amount_collected,0) + NEW.amount WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
  END IF;

  -- Legacy fallback when distribution_case is provided
  IF NEW.distribution_case IS NOT NULL THEN
    v_caisse := ROUND(NEW.amount * 0.15, 2);
    IF NEW.distribution_case = 'cas1_interne' THEN
      v_spero := ROUND(NEW.amount * 0.70, 2);
      v_associe := NEW.amount - v_caisse - v_spero;
      v_net := NEW.amount - v_caisse;
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
  END IF;

  -- NEW: no rule, no case -> book caisse 15% + queue AI suggestion for the rest
  v_caisse := ROUND(NEW.amount * 0.15, 2);
  v_net := NEW.amount - v_caisse;

  INSERT INTO public.cash_movements (direction, amount, label, source_transaction_id, movement_date, created_by)
  VALUES ('entree', v_caisse, '15% caisse (auto) — en attente IA' ||
    CASE WHEN NEW.description IS NOT NULL THEN ' — ' || NEW.description ELSE '' END,
    NEW.id, NEW.transaction_date, NEW.created_by);

  IF NEW.project_id IS NOT NULL THEN
    UPDATE public.projects SET amount_collected = COALESCE(amount_collected,0) + NEW.amount WHERE id = NEW.project_id;
  END IF;

  INSERT INTO public.financial_validations(entity_type, entity_id, requested_by, status, context)
  VALUES ('transaction_ai_suggestion', NEW.id, NEW.created_by, 'en_attente',
    jsonb_build_object(
      'need_ai_suggestion', true,
      'amount', NEW.amount,
      'caisse_booked', v_caisse,
      'remaining_to_split', v_net,
      'project_id', NEW.project_id,
      'description', NEW.description
    ));

  RETURN NEW;
END;
$function$;
