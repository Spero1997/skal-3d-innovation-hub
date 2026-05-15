
-- ============== ENUMS ==============
CREATE TYPE public.invoice_status AS ENUM ('brouillon','envoyee','partiellement_payee','payee','annulee');
CREATE TYPE public.notification_type AS ENUM ('task_assigned','comment','transaction','invoice','project_status','deadline','mention','system');

-- ============== INVOICES ==============
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  amount_ht numeric(14,2) NOT NULL DEFAULT 0,
  vat_rate numeric(5,2) NOT NULL DEFAULT 18,
  amount_ttc numeric(14,2) NOT NULL DEFAULT 0,
  amount_paid numeric(14,2) NOT NULL DEFAULT 0,
  status public.invoice_status NOT NULL DEFAULT 'brouillon',
  payment_terms text DEFAULT '40% à la commande, 60% à la livraison',
  notes text,
  line_items jsonb DEFAULT '[]'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "direction manage invoices" ON public.invoices
  FOR ALL USING (public.is_direction(auth.uid())) WITH CHECK (public.is_direction(auth.uid()));
CREATE POLICY "chef_projet view own invoices" ON public.invoices
  FOR SELECT USING (
    public.has_role(auth.uid(),'chef_projet') AND EXISTS (
      SELECT 1 FROM public.projects p WHERE p.id = invoices.project_id AND p.manager_id = auth.uid()
    )
  );
CREATE TRIGGER invoices_set_updated BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-numbering INV-2026-0001
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := 'INV-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 4, '0');
  END IF;
  NEW.amount_ttc := ROUND(NEW.amount_ht * (1 + NEW.vat_rate/100), 2);
  RETURN NEW;
END;$$;
CREATE TRIGGER invoices_auto_number BEFORE INSERT OR UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

-- ============== PAYOUTS ==============
CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL,
  beneficiary_role text NOT NULL DEFAULT 'associe',
  amount numeric(14,2) NOT NULL,
  payout_date date NOT NULL DEFAULT CURRENT_DATE,
  period_start date,
  period_end date,
  description text,
  related_distribution_ids uuid[],
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "direction manage payouts" ON public.payouts
  FOR ALL USING (public.is_direction(auth.uid())) WITH CHECK (public.is_direction(auth.uid()));
CREATE POLICY "beneficiary view own payouts" ON public.payouts
  FOR SELECT USING (beneficiary_id = auth.uid());

-- ============== NOTIFICATIONS ==============
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'system',
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON public.notifications(user_id, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "system insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Helper to push notification
CREATE OR REPLACE FUNCTION public.notify_user(
  _user_id uuid, _type public.notification_type, _title text, _body text, _link text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications(user_id,type,title,body,link)
  VALUES (_user_id, _type, _title, _body, _link);
END;$$;

-- Trigger: task assigned
CREATE OR REPLACE FUNCTION public.on_task_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_proj text;
BEGIN
  SELECT name INTO v_proj FROM public.projects WHERE id = NEW.project_id;
  IF TG_OP = 'INSERT' THEN
    IF NEW.assignee_id IS NOT NULL AND NEW.assignee_id <> COALESCE(NEW.created_by, '00000000-0000-0000-0000-000000000000'::uuid) THEN
      PERFORM public.notify_user(NEW.assignee_id,'task_assigned',
        'Nouvelle tâche assignée',
        NEW.title || ' — ' || COALESCE(v_proj,''),
        '/admin/projets/' || NEW.project_id::text);
    END IF;
    INSERT INTO public.project_activity(project_id, actor_id, action, metadata)
    VALUES (NEW.project_id, NEW.created_by, 'task_created', jsonb_build_object('task_id',NEW.id,'title',NEW.title));
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.assignee_id IS DISTINCT FROM OLD.assignee_id AND NEW.assignee_id IS NOT NULL THEN
      PERFORM public.notify_user(NEW.assignee_id,'task_assigned',
        'Tâche assignée',
        NEW.title || ' — ' || COALESCE(v_proj,''),
        '/admin/projets/' || NEW.project_id::text);
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.project_activity(project_id, actor_id, action, metadata)
      VALUES (NEW.project_id, auth.uid(), 'task_status_changed',
        jsonb_build_object('task_id',NEW.id,'from',OLD.status,'to',NEW.status));
    END IF;
  END IF;
  RETURN NEW;
END;$$;
CREATE TRIGGER tasks_notify AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.on_task_change();

-- Trigger: comment created
CREATE OR REPLACE FUNCTION public.on_comment_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_manager uuid; v_proj text;
BEGIN
  SELECT manager_id, name INTO v_manager, v_proj FROM public.projects WHERE id = NEW.project_id;
  IF v_manager IS NOT NULL AND v_manager <> NEW.author_id THEN
    PERFORM public.notify_user(v_manager,'comment','Nouveau commentaire',
      COALESCE(v_proj,'') || ' : ' || left(NEW.body,80),
      '/admin/projets/' || NEW.project_id::text);
  END IF;
  INSERT INTO public.project_activity(project_id, actor_id, action, metadata)
  VALUES (NEW.project_id, NEW.author_id, 'comment_created', jsonb_build_object('comment_id',NEW.id));
  RETURN NEW;
END;$$;
CREATE TRIGGER comments_notify AFTER INSERT ON public.project_comments
  FOR EACH ROW EXECUTE FUNCTION public.on_comment_created();

-- Trigger: project status change
CREATE OR REPLACE FUNCTION public.on_project_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.project_activity(project_id, actor_id, action, metadata)
    VALUES (NEW.id, auth.uid(), 'project_status_changed',
      jsonb_build_object('from',OLD.status,'to',NEW.status));
    IF NEW.manager_id IS NOT NULL THEN
      PERFORM public.notify_user(NEW.manager_id,'project_status',
        'Statut projet mis à jour',
        NEW.name || ' → ' || NEW.status,
        '/admin/projets/' || NEW.id::text);
    END IF;
  ELSIF TG_OP='INSERT' THEN
    INSERT INTO public.project_activity(project_id, actor_id, action, metadata)
    VALUES (NEW.id, NEW.created_by, 'project_created', jsonb_build_object('name',NEW.name));
  END IF;
  RETURN NEW;
END;$$;
CREATE TRIGGER projects_journal AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.on_project_change();

-- Trigger: transaction recorded → notify direction
CREATE OR REPLACE FUNCTION public.on_transaction_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT user_id FROM public.user_roles WHERE role IN ('super_admin','associe','comptable')
  LOOP
    PERFORM public.notify_user(r.user_id,'transaction',
      CASE WHEN NEW.type='revenu' THEN 'Nouveau revenu' ELSE 'Nouvelle dépense' END,
      NEW.amount::text || ' XOF — ' || COALESCE(NEW.description,''),
      '/admin/finances');
  END LOOP;
  RETURN NEW;
END;$$;
CREATE TRIGGER tx_notify AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.on_transaction_created();

-- ============== TEAM INVITATIONS ==============
CREATE TABLE public.team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role app_role NOT NULL,
  invited_by uuid,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24),'hex'),
  accepted_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "super_admin manage invitations" ON public.team_invitations
  FOR ALL USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- ============== STORAGE policies for project-files ==============
DROP POLICY IF EXISTS "members read project files" ON storage.objects;
DROP POLICY IF EXISTS "members upload project files" ON storage.objects;
DROP POLICY IF EXISTS "members delete project files" ON storage.objects;

CREATE POLICY "members read project files" ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files' AND (
    public.is_direction(auth.uid()) OR
    public.can_access_project(auth.uid(), ((storage.foldername(name))[1])::uuid)
  ));
CREATE POLICY "members upload project files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND (
    public.is_direction(auth.uid()) OR
    public.can_access_project(auth.uid(), ((storage.foldername(name))[1])::uuid)
  ));
CREATE POLICY "members delete project files" ON storage.objects FOR DELETE
  USING (bucket_id = 'project-files' AND (
    public.is_direction(auth.uid()) OR
    public.can_access_project(auth.uid(), ((storage.foldername(name))[1])::uuid)
  ));
