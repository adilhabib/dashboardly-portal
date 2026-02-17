-- Comprehensive Fix for Marketing Notifications
-- This script ensures the table exists and has the correct settings for the admin panel

-- 1. Ensure Table exists with correct structure
CREATE TABLE IF NOT EXISTS public.marketing_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Ensure RLS is enabled
ALTER TABLE public.marketing_notifications ENABLE ROW LEVEL SECURITY;

-- 3. Reset Policies for Safety
DROP POLICY IF EXISTS "Admins can insert marketing notifications" ON public.marketing_notifications;
DROP POLICY IF EXISTS "Admins can update marketing notifications" ON public.marketing_notifications;
DROP POLICY IF EXISTS "Admins can delete marketing notifications" ON public.marketing_notifications;
DROP POLICY IF EXISTS "Admins can view all marketing notifications" ON public.marketing_notifications;
DROP POLICY IF EXISTS "Public can view active marketing notifications" ON public.marketing_notifications;

-- 4. Create Correct Policies (Using the public.has_role function)
CREATE POLICY "Admins can manage marketing notifications"
ON public.marketing_notifications
FOR ALL
TO authenticated
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Public can view active marketing notifications"
ON public.marketing_notifications
FOR SELECT
USING (is_active = true OR public.has_role('admin'));
