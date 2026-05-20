
-- ============================================================
-- 1. finance_rules: case_description (lisible humain)
-- ============================================================
ALTER TABLE public.finance_rules
  ADD COLUMN IF NOT EXISTS case_description text;

UPDATE public.finance_rules
  SET case_description = 'Cas standard — répartition par défaut : 15 % en caisse entreprise, puis solde entre les bénéficiaires définis dans les allocations. À adapter selon le type d''affaire (interne, sous-traitée, au coût).'
  WHERE case_description IS NULL;

-- ============================================================
-- 2. Génération automatique du code projet
--    Format : SKAL-<DOM>-<YYYY>-<NNN>
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_project_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year text := to_char(COALESCE(NEW.start_date, CURRENT_DATE), 'YYYY');
  v_dom  text := UPPER(LEFT(REPLACE(COALESCE(NEW.domain::text,'AUT'),'_',''), 4));
  v_seq  int;
BEGIN
  IF NEW.code IS NOT NULL AND NEW.code <> '' THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) + 1 INTO v_seq
    FROM public.projects
    WHERE code LIKE 'SKAL-' || v_dom || '-' || v_year || '-%';

  NEW.code := 'SKAL-' || v_dom || '-' || v_year || '-' || lpad(v_seq::text, 3, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_autocode ON public.projects;
CREATE TRIGGER trg_projects_autocode
  BEFORE INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_project_code();

-- ============================================================
-- 3. Numéro de facture non prédictible
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt int := 0;
  v_candidate text;
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    LOOP
      v_candidate := 'INV-'
        || to_char(COALESCE(NEW.issue_date, CURRENT_DATE), 'YYYY') || '-'
        || UPPER(encode(extensions.gen_random_bytes(4), 'hex'));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.invoices WHERE number = v_candidate);
      v_attempt := v_attempt + 1;
      IF v_attempt > 10 THEN
        RAISE EXCEPTION 'Could not generate unique invoice number';
      END IF;
    END LOOP;
    NEW.number := v_candidate;
  END IF;
  NEW.amount_ttc := ROUND(NEW.amount_ht * (1 + NEW.vat_rate/100), 2);
  RETURN NEW;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS invoices_number_unique ON public.invoices(number);

-- ============================================================
-- 4. Données : projets revus + Ruche d'Or web
-- ============================================================

-- Construction R+1 : 15M CA brut, 750k bénéfice net SKAL (~5%)
UPDATE public.projects
  SET budget = 15000000, amount_invoiced = 15000000, amount_collected = 750000
  WHERE name = 'Construction R+1 — Suivi de chantier';

-- Construction plain-pied : 10M CA brut, 500k bénéfice net SKAL (~5%)
UPDATE public.projects
  SET budget = 10000000, amount_invoiced = 10000000, amount_collected = 500000
  WHERE name = 'Construction plain-pied — Suivi de chantier';

-- Ruche d'Or website
INSERT INTO public.projects
  (name, code, domain, status, priority, budget, amount_invoiced, amount_collected,
   start_date, due_date, completed_at, progress, description)
SELECT
  'Site web — La Ruche d''Or',
  'SKAL-WEBD-2024-001',
  'web_digital'::project_domain,
  'livre'::project_status,
  'normale'::project_priority,
  650000, 650000, 650000,
  '2024-11-01'::date, '2024-12-15'::date, '2024-12-20'::timestamptz,
  100,
  'Conception et développement du site vitrine de La Ruche d''Or — design moderne, responsive, SEO, intégration formulaire de contact.'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Site web — La Ruche d''Or');

-- ============================================================
-- 5. Renumérotation aléatoire des factures + synchro montants
-- ============================================================

-- Resynchroniser les factures sur le CA brut (budget) et la start_date du projet
UPDATE public.invoices i
  SET amount_ht  = p.budget,
      amount_ttc = ROUND(p.budget * (1 + COALESCE(i.vat_rate,0)/100), 2),
      amount_paid = p.budget,
      issue_date = COALESCE(p.start_date, i.issue_date),
      due_date = COALESCE(p.start_date, i.issue_date) + INTERVAL '30 days',
      status = 'payee'
  FROM public.projects p
  WHERE p.id = i.project_id
    AND p.status = 'livre'
    AND p.budget IS NOT NULL
    AND p.budget > 0;

-- Renumérotation aléatoire (toutes factures)
UPDATE public.invoices
  SET number = 'INV-' || to_char(issue_date,'YYYY') || '-' || UPPER(encode(extensions.gen_random_bytes(4),'hex'));

-- Facture pour Ruche d'Or web (si pas déjà créée)
INSERT INTO public.invoices
  (number, project_id, issue_date, due_date, amount_ht, amount_ttc, amount_paid, vat_rate, status, payment_terms, line_items)
SELECT
  'INV-2024-' || UPPER(encode(extensions.gen_random_bytes(4),'hex')),
  p.id, p.start_date, p.start_date + INTERVAL '30 days',
  p.budget, p.budget, p.budget, 0, 'payee',
  '40% à la commande, 60% à la livraison',
  jsonb_build_array(jsonb_build_object(
    'description', 'Site web vitrine — La Ruche d''Or (design + dev + SEO)',
    'quantity', 1, 'unit_price', p.budget))
FROM public.projects p
WHERE p.name = 'Site web — La Ruche d''Or'
  AND NOT EXISTS (SELECT 1 FROM public.invoices WHERE project_id = p.id);
