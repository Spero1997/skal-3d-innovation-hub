
-- ENUMS
CREATE TYPE public.transaction_type AS ENUM ('revenu','depense');
CREATE TYPE public.transaction_status AS ENUM ('prevue','encaissee','annulee');
CREATE TYPE public.distribution_case AS ENUM ('cas1_interne','cas2_forfait','cas3_au_cout');
CREATE TYPE public.cash_direction AS ENUM ('entree','sortie');

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  type public.transaction_type NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  description text,
  category text,
  status public.transaction_status NOT NULL DEFAULT 'encaissee',
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  -- Pour les revenus : règles de répartition
  distribution_case public.distribution_case,
  associe_id uuid,
  prestataire_name text,
  prestataire_cost numeric(14,2) DEFAULT 0 CHECK (prestataire_cost >= 0),
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_transactions_project ON public.transactions(project_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_type ON public.transactions(type);

-- REVENUE DISTRIBUTIONS
CREATE TABLE public.revenue_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL UNIQUE REFERENCES public.transactions(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  case_used public.distribution_case NOT NULL,
  gross_amount numeric(14,2) NOT NULL,
  caisse_share numeric(14,2) NOT NULL DEFAULT 0,
  prestataire_share numeric(14,2) NOT NULL DEFAULT 0,
  net_after_caisse_and_prestataire numeric(14,2) NOT NULL DEFAULT 0,
  spero_share numeric(14,2) NOT NULL DEFAULT 0,
  associe_share numeric(14,2) NOT NULL DEFAULT 0,
  associe_id uuid,
  prestataire_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.revenue_distributions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_distributions_project ON public.revenue_distributions(project_id);

-- CASH MOVEMENTS
CREATE TABLE public.cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction public.cash_direction NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  label text NOT NULL,
  source_transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  movement_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_cash_date ON public.cash_movements(movement_date);

-- VIEW : finance summary (live)
CREATE OR REPLACE VIEW public.finance_summary
WITH (security_invoker = on)
AS
SELECT
  COALESCE(SUM(CASE WHEN t.type='revenu' AND t.status='encaissee' THEN t.amount ELSE 0 END),0) AS total_revenue,
  COALESCE(SUM(CASE WHEN t.type='depense' AND t.status='encaissee' THEN t.amount ELSE 0 END),0) AS total_expense,
  COALESCE((SELECT SUM(CASE WHEN direction='entree' THEN amount ELSE -amount END) FROM public.cash_movements),0) AS caisse_balance,
  COALESCE((SELECT SUM(spero_share) FROM public.revenue_distributions),0) AS total_spero,
  COALESCE((SELECT SUM(associe_share) FROM public.revenue_distributions),0) AS total_associes,
  COALESCE((SELECT SUM(prestataire_share) FROM public.revenue_distributions),0) AS total_prestataires
FROM public.transactions t;

-- TRIGGER: calculate distribution + update project + create cash entry
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
BEGIN
  -- Only for income encaissée
  IF NEW.type <> 'revenu' OR NEW.status <> 'encaissee' THEN
    RETURN NEW;
  END IF;

  -- Avoid duplicate distribution if updated
  IF EXISTS (SELECT 1 FROM public.revenue_distributions WHERE transaction_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  IF NEW.distribution_case IS NULL THEN
    RAISE EXCEPTION 'distribution_case is required for revenu encaissé';
  END IF;

  -- 15% caisse always
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
    IF v_net < 0 THEN
      RAISE EXCEPTION 'Le coût prestataire dépasse le montant restant après caisse';
    END IF;
    v_spero := ROUND(v_net / 2, 2);
    v_associe := v_net - v_spero;
  END IF;

  INSERT INTO public.revenue_distributions (
    transaction_id, project_id, case_used, gross_amount,
    caisse_share, prestataire_share, net_after_caisse_and_prestataire,
    spero_share, associe_share, associe_id, prestataire_name
  ) VALUES (
    NEW.id, NEW.project_id, NEW.distribution_case, NEW.amount,
    v_caisse, v_prestataire, v_net,
    v_spero, v_associe, NEW.associe_id, NEW.prestataire_name
  );

  -- Caisse entry
  INSERT INTO public.cash_movements (direction, amount, label, source_transaction_id, movement_date, created_by)
  VALUES ('entree', v_caisse, '15% sur revenu' ||
    CASE WHEN NEW.description IS NOT NULL THEN ' — ' || NEW.description ELSE '' END,
    NEW.id, NEW.transaction_date, NEW.created_by);

  -- Update project amount_collected
  IF NEW.project_id IS NOT NULL THEN
    UPDATE public.projects
       SET amount_collected = COALESCE(amount_collected,0) + NEW.amount
     WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_revenue_distribution
AFTER INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.handle_revenue_distribution();

-- updated_at trigger for transactions
CREATE TRIGGER trg_transactions_updated BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS : direction only (super_admin / associe / comptable)
CREATE POLICY "direction manage transactions" ON public.transactions
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));

CREATE POLICY "direction view distributions" ON public.revenue_distributions
  FOR SELECT TO authenticated
  USING (public.is_direction(auth.uid()));

CREATE POLICY "direction manage cash" ON public.cash_movements
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));
