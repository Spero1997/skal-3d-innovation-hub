-- is_direction étendu
CREATE OR REPLACE FUNCTION public.is_direction(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin','associe','comptable','secretaire')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin','associe','comptable','chef_projet','prestataire','secretaire')
  )
$$;

CREATE OR REPLACE FUNCTION public.on_transaction_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT user_id FROM public.user_roles
           WHERE role IN ('super_admin','associe','comptable','secretaire')
  LOOP
    PERFORM public.notify_user(r.user_id,'transaction',
      CASE WHEN NEW.type='revenu' THEN 'Nouveau revenu' ELSE 'Nouvelle dépense' END,
      NEW.amount::text || ' XOF — ' || COALESCE(NEW.description,''),
      '/admin/finances');
  END LOOP;
  RETURN NEW;
END;$$;

-- Policies parallèles chef_projet → secretaire
CREATE POLICY "secretaire view clients" ON public.clients
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'secretaire'));

CREATE POLICY "secretaire view projects" ON public.projects
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'secretaire') AND (
      manager_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.tasks WHERE tasks.project_id = projects.id AND tasks.assignee_id = auth.uid())
    )
  );

CREATE POLICY "secretaire update projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'secretaire') AND manager_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'secretaire') AND manager_id = auth.uid());

CREATE POLICY "secretaire create projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'secretaire') AND manager_id = auth.uid());

CREATE POLICY "secretaire view own invoices" ON public.invoices
  FOR SELECT
  USING (
    public.has_role(auth.uid(),'secretaire') AND EXISTS (
      SELECT 1 FROM public.projects p WHERE p.id = invoices.project_id AND p.manager_id = auth.uid()
    )
  );

-- Matrice IA : cumul max(comptable, chef_projet)
INSERT INTO public.ai_data_access(role, entity, max_level)
SELECT 'secretaire'::public.app_role, entity, MAX(max_level)::public.confidentiality_level
FROM public.ai_data_access
WHERE role IN ('comptable','chef_projet')
GROUP BY entity
ON CONFLICT DO NOTHING;

-- Seuils IA : copie du comptable
INSERT INTO public.ai_role_thresholds(role, agent_slug, min_confidence, allow_force)
SELECT 'secretaire'::public.app_role, agent_slug, min_confidence, allow_force
FROM public.ai_role_thresholds
WHERE role = 'comptable'
ON CONFLICT DO NOTHING;