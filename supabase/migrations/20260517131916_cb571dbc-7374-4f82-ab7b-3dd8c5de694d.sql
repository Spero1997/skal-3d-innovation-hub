-- Table d'historique des rapports financiers générés
CREATE TABLE public.financial_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at timestamptz NOT NULL DEFAULT now(),
  generated_by uuid,
  period_label text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  level text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  comparisons jsonb NOT NULL DEFAULT '{}'::jsonb,
  report_markdown text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction view financial_reports"
ON public.financial_reports FOR SELECT TO authenticated
USING (is_direction(auth.uid()));

CREATE POLICY "direction insert financial_reports"
ON public.financial_reports FOR INSERT TO authenticated
WITH CHECK (is_direction(auth.uid()) OR auth.uid() IS NULL);

CREATE POLICY "super_admin delete financial_reports"
ON public.financial_reports FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE INDEX idx_financial_reports_generated_at ON public.financial_reports(generated_at DESC);

-- Activer pg_cron + pg_net pour planification mensuelle
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;