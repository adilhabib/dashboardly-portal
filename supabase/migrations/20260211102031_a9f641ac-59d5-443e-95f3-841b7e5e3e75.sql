
-- Allow admins to manage marketing notifications
CREATE POLICY "Admins can insert marketing notifications"
ON public.marketing_notifications
FOR INSERT
WITH CHECK (has_role('admin'::text));

CREATE POLICY "Admins can update marketing notifications"
ON public.marketing_notifications
FOR UPDATE
USING (has_role('admin'::text));

CREATE POLICY "Admins can delete marketing notifications"
ON public.marketing_notifications
FOR DELETE
USING (has_role('admin'::text));

-- Also allow admins to view all (not just active)
CREATE POLICY "Admins can view all marketing notifications"
ON public.marketing_notifications
FOR SELECT
USING (has_role('admin'::text));
