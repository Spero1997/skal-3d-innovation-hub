
-- ENUMS
CREATE TYPE public.project_domain AS ENUM ('architecture_btp','geomatique_sig','graphisme_ia','web_digital','autre');
CREATE TYPE public.project_status AS ENUM ('prospect','en_cours','en_pause','livre','annule');
CREATE TYPE public.project_priority AS ENUM ('basse','normale','haute','urgente');
CREATE TYPE public.task_status AS ENUM ('a_faire','en_cours','en_revue','termine');

-- CLIENTS
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text,
  phone text,
  address text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  description text,
  domain public.project_domain NOT NULL DEFAULT 'autre',
  status public.project_status NOT NULL DEFAULT 'prospect',
  priority public.project_priority NOT NULL DEFAULT 'normale',
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  manager_id uuid,
  budget numeric(14,2) DEFAULT 0,
  amount_invoiced numeric(14,2) DEFAULT 0,
  amount_collected numeric(14,2) DEFAULT 0,
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  start_date date,
  due_date date,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_projects_manager ON public.projects(manager_id);
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);

-- TASKS
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status public.task_status NOT NULL DEFAULT 'a_faire',
  priority public.project_priority NOT NULL DEFAULT 'normale',
  assignee_id uuid,
  due_date date,
  position integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);

-- PROJECT ACTIVITY
CREATE TABLE public.project_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  actor_id uuid,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_activity ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_activity_project ON public.project_activity(project_id);

-- PROJECT COMMENTS
CREATE TABLE public.project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_comments_project ON public.project_comments(project_id);

-- HELPER: is direction (super_admin / associe / comptable)
CREATE OR REPLACE FUNCTION public.is_direction(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin','associe','comptable')
  )
$$;

-- HELPER: can access project (direction OR manager OR has task assigned)
CREATE OR REPLACE FUNCTION public.can_access_project(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    public.is_direction(_user_id)
    OR EXISTS (SELECT 1 FROM public.projects WHERE id = _project_id AND manager_id = _user_id)
    OR EXISTS (SELECT 1 FROM public.tasks WHERE project_id = _project_id AND assignee_id = _user_id)
$$;

-- RLS: CLIENTS — direction full, chef_projet read only
CREATE POLICY "direction manage clients" ON public.clients
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));

CREATE POLICY "chef_projet view clients" ON public.clients
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'chef_projet'));

-- RLS: PROJECTS
CREATE POLICY "direction manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));

CREATE POLICY "chef_projet view own projects" ON public.projects
  FOR SELECT TO authenticated
  USING (manager_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.tasks WHERE project_id = projects.id AND assignee_id = auth.uid()
  ));

CREATE POLICY "chef_projet update own projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (manager_id = auth.uid())
  WITH CHECK (manager_id = auth.uid());

CREATE POLICY "chef_projet create projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'chef_projet') AND manager_id = auth.uid());

-- RLS: TASKS
CREATE POLICY "direction manage tasks" ON public.tasks
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));

CREATE POLICY "project members view tasks" ON public.tasks
  FOR SELECT TO authenticated
  USING (public.can_access_project(auth.uid(), project_id) OR assignee_id = auth.uid());

CREATE POLICY "project manager manage tasks" ON public.tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = tasks.project_id AND manager_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = tasks.project_id AND manager_id = auth.uid()));

CREATE POLICY "assignee update own task" ON public.tasks
  FOR UPDATE TO authenticated
  USING (assignee_id = auth.uid())
  WITH CHECK (assignee_id = auth.uid());

-- RLS: ACTIVITY
CREATE POLICY "members view activity" ON public.project_activity
  FOR SELECT TO authenticated
  USING (public.can_access_project(auth.uid(), project_id));

CREATE POLICY "members insert activity" ON public.project_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.can_access_project(auth.uid(), project_id) AND actor_id = auth.uid());

-- RLS: COMMENTS
CREATE POLICY "members view comments" ON public.project_comments
  FOR SELECT TO authenticated
  USING (public.can_access_project(auth.uid(), project_id));

CREATE POLICY "members create comments" ON public.project_comments
  FOR INSERT TO authenticated
  WITH CHECK (public.can_access_project(auth.uid(), project_id) AND author_id = auth.uid());

CREATE POLICY "author or direction delete comments" ON public.project_comments
  FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_direction(auth.uid()));

-- Updated_at triggers
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files','project-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "project files - members read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-files'
    AND public.can_access_project(auth.uid(), ((storage.foldername(name))[1])::uuid)
  );

CREATE POLICY "project files - members upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-files'
    AND public.can_access_project(auth.uid(), ((storage.foldername(name))[1])::uuid)
  );

CREATE POLICY "project files - direction or manager delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-files'
    AND (
      public.is_direction(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = ((storage.foldername(name))[1])::uuid
          AND p.manager_id = auth.uid()
      )
    )
  );
