-- Fix the remaining function with no search_path (assign_admin_to_email with text param)
CREATE OR REPLACE FUNCTION public.assign_admin_to_email(email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert admin role for the user with the given email
    INSERT INTO public.user_roles (user_id, role)
    SELECT u.id, 'admin'::app_role
    FROM auth.users u
    WHERE u.email = assign_admin_to_email.email
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Fix remaining RLS policy always true - check foods table for 'Authenticated users can manage foods' policy
DROP POLICY IF EXISTS "Authenticated users can manage foods" ON public.foods;

-- Replace with admin-only policy for managing foods
CREATE POLICY "Admins can manage foods" 
ON public.foods 
FOR ALL 
USING (public.has_role('admin'));

-- Also fix food_details table policy
DROP POLICY IF EXISTS "Authenticated users can manage food details" ON public.food_details;

-- Replace with admin-only policy
CREATE POLICY "Admins can manage food details" 
ON public.food_details 
FOR ALL 
USING (public.has_role('admin'));