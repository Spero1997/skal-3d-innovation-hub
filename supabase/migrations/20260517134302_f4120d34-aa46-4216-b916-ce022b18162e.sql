-- =========================================
-- LOT 4 — Projets & Tâches avancés
-- =========================================

-- 1) Extend tasks: sous-tâches, dates, estimations
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS parent_task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS estimated_hours numeric(8,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS actual_hours numeric(8,2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tasks_parent ON public.tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);

-- 2) Task dependencies
DO $$ BEGIN
  CREATE TYPE public.dependency_type AS ENUM ('finish_to_start','start_to_start','finish_to_finish','start_to_finish');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  predecessor_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  successor_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  type public.dependency_type NOT NULL DEFAULT 'finish_to_start',
  lag_days integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  UNIQUE (predecessor_id, successor_id),
  CHECK (predecessor_id <> successor_id)
);

ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members view deps"
ON public.task_dependencies FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    WHERE t.id = task_dependencies.successor_id
      AND public.can_access_project(auth.uid(), t.project_id)
  )
);

CREATE POLICY "managers manage deps"
ON public.task_dependencies FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON p.id = t.project_id
    WHERE t.id = task_dependencies.successor_id
      AND (public.is_direction(auth.uid()) OR p.manager_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON p.id = t.project_id
    WHERE t.id = task_dependencies.successor_id
      AND (public.is_direction(auth.uid()) OR p.manager_id = auth.uid())
  )
);

-- 3) Time entries
CREATE TABLE IF NOT EXISTS public.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_time_entries_task ON public.time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON public.time_entries(user_id);

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own entries"
ON public.time_entries FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "direction view all entries"
ON public.time_entries FOR SELECT TO authenticated
USING (public.is_direction(auth.uid()));

CREATE POLICY "manager view project entries"
ON public.time_entries FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON p.id = t.project_id
    WHERE t.id = time_entries.task_id AND p.manager_id = auth.uid()
  )
);

CREATE TRIGGER trg_time_entries_updated
BEFORE UPDATE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Recompute actual_hours on tasks when time_entries change
CREATE OR REPLACE FUNCTION public.recompute_task_actual_hours()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_task uuid;
BEGIN
  v_task := COALESCE(NEW.task_id, OLD.task_id);
  UPDATE public.tasks SET actual_hours = COALESCE((
    SELECT ROUND(SUM(COALESCE(duration_minutes,0))::numeric / 60, 2)
    FROM public.time_entries WHERE task_id = v_task AND ended_at IS NOT NULL
  ), 0)
  WHERE id = v_task;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS trg_time_recompute ON public.time_entries;
CREATE TRIGGER trg_time_recompute
AFTER INSERT OR UPDATE OR DELETE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.recompute_task_actual_hours();

-- 4) Project templates
CREATE TABLE IF NOT EXISTS public.project_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  domain public.project_domain NOT NULL DEFAULT 'autre',
  tasks_structure jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "internal view templates"
ON public.project_templates FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()));

CREATE POLICY "direction manage templates"
ON public.project_templates FOR ALL TO authenticated
USING (public.is_direction(auth.uid()))
WITH CHECK (public.is_direction(auth.uid()));

CREATE TRIGGER trg_project_templates_updated
BEFORE UPDATE ON public.project_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Instantiate template into a project
CREATE OR REPLACE FUNCTION public.instantiate_project_template(_template_id uuid, _project_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_tpl public.project_templates%ROWTYPE;
  v_task jsonb;
  v_sub jsonb;
  v_parent_id uuid;
  v_count integer := 0;
  v_pos integer := 0;
BEGIN
  SELECT * INTO v_tpl FROM public.project_templates WHERE id = _template_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Template introuvable'; END IF;
  IF NOT (public.is_direction(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.projects WHERE id = _project_id AND manager_id = auth.uid()
  )) THEN RAISE EXCEPTION 'Accès refusé'; END IF;

  FOR v_task IN SELECT * FROM jsonb_array_elements(v_tpl.tasks_structure)
  LOOP
    v_pos := v_pos + 1;
    INSERT INTO public.tasks (project_id, title, description, status, priority, position, created_by, estimated_hours)
    VALUES (
      _project_id,
      COALESCE(v_task->>'title','(sans titre)'),
      v_task->>'description',
      COALESCE((v_task->>'status')::public.task_status, 'a_faire'),
      COALESCE((v_task->>'priority')::public.project_priority, 'normale'),
      v_pos,
      auth.uid(),
      COALESCE((v_task->>'estimated_hours')::numeric, 0)
    ) RETURNING id INTO v_parent_id;
    v_count := v_count + 1;

    IF v_task ? 'subtasks' THEN
      FOR v_sub IN SELECT * FROM jsonb_array_elements(v_task->'subtasks')
      LOOP
        INSERT INTO public.tasks (project_id, parent_task_id, title, description, status, priority, position, created_by, estimated_hours)
        VALUES (
          _project_id, v_parent_id,
          COALESCE(v_sub->>'title','(sans titre)'),
          v_sub->>'description',
          COALESCE((v_sub->>'status')::public.task_status, 'a_faire'),
          COALESCE((v_sub->>'priority')::public.project_priority, 'normale'),
          0, auth.uid(),
          COALESCE((v_sub->>'estimated_hours')::numeric, 0)
        );
        v_count := v_count + 1;
      END LOOP;
    END IF;
  END LOOP;

  RETURN v_count;
END $$;
