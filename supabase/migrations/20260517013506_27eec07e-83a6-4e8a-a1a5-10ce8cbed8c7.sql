
-- 1) Tighten notifications INSERT policy (was WITH CHECK true)
DROP POLICY IF EXISTS "system insert notifications" ON public.notifications;
CREATE POLICY "direction or self insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_direction(auth.uid())
    OR user_id = auth.uid()
  );

-- 2) Revoke public execute on internal/trigger/helper functions.
--    RLS policies and triggers run with the table owner's privileges,
--    so removing PUBLIC/anon/authenticated EXECUTE does not break them.
DO $$
DECLARE fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.has_role(uuid, app_role)',
    'public.is_admin_user(uuid)',
    'public.is_internal_user(uuid)',
    'public.is_direction(uuid)',
    'public.can_access_project(uuid, uuid)',
    'public.notify_user(uuid, notification_type, text, text, text)',
    'public.handle_new_user()',
    'public.handle_revenue_distribution()',
    'public.update_updated_at_column()',
    'public.set_invoice_number()',
    'public.on_task_change()',
    'public.on_comment_created()',
    'public.on_project_change()',
    'public.on_transaction_created()'
  ]
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', fn);
  END LOOP;
END $$;
