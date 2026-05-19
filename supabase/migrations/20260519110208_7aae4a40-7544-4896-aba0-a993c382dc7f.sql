
-- Fix infinite recursion between projects <-> tasks policies
CREATE OR REPLACE FUNCTION public.user_is_task_assignee_on_project(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.tasks WHERE project_id = _project_id AND assignee_id = _user_id)
$$;

DROP POLICY IF EXISTS "chef_projet view own projects" ON public.projects;
CREATE POLICY "chef_projet view own projects" ON public.projects
FOR SELECT TO authenticated
USING (manager_id = auth.uid() OR public.user_is_task_assignee_on_project(auth.uid(), id));

DROP POLICY IF EXISTS "secretaire view projects" ON public.projects;
CREATE POLICY "secretaire view projects" ON public.projects
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'secretaire'::public.app_role)
  AND (manager_id = auth.uid() OR public.user_is_task_assignee_on_project(auth.uid(), id))
);

-- Backfill: activity log of imported projects should reflect the project's start_date,
-- not the import timestamp.
UPDATE public.project_activity pa
SET created_at = (p.start_date::timestamptz + interval '12 hours')
FROM public.projects p
WHERE pa.project_id = p.id
  AND pa.action = 'project_created'
  AND p.start_date IS NOT NULL
  AND date_trunc('minute', pa.created_at) = date_trunc('minute', p.created_at);
