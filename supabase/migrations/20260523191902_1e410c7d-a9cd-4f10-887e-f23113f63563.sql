
-- 1) financial_reports: remove anon insert escape hatch
DROP POLICY IF EXISTS "direction insert financial_reports" ON public.financial_reports;
CREATE POLICY "direction insert financial_reports"
ON public.financial_reports
FOR INSERT
TO authenticated
WITH CHECK (public.is_direction(auth.uid()));

-- 2) is_direction(): remove 'secretaire' (over-broad access)
CREATE OR REPLACE FUNCTION public.is_direction(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin','associe','comptable')
  )
$function$;

-- 3) Drop broken storage delete policies on project-files
DROP POLICY IF EXISTS "project files - direction or manager delete" ON storage.objects;
DROP POLICY IF EXISTS "project managers delete project-files" ON storage.objects;

-- 4) Realtime channel authorization: only allow user's own notification topic
DROP POLICY IF EXISTS "users can read own notification channel" ON realtime.messages;
CREATE POLICY "users can read own notification channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = ('notif-' || auth.uid()::text)
);

-- 5) Revoke EXECUTE from anon (and from authenticated for the trigger-only function)
REVOKE EXECUTE ON FUNCTION public.generate_project_code() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.apply_ai_distribution(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.user_is_task_assignee_on_project(uuid, uuid) FROM anon, public;
