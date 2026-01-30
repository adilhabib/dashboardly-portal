-- Fix remaining function search_path issues

-- Fix make_user_admin function (text parameter version)
CREATE OR REPLACE FUNCTION public.make_user_admin(email text)
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
    WHERE u.email = make_user_admin.email
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Fix create_user_with_log function
CREATE OR REPLACE FUNCTION public.create_user_with_log(user_email text, user_name text)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    -- This is a placeholder function
    RAISE NOTICE 'User created: % with name: %', user_email, user_name;
END;
$$;

-- Fix the remaining "always true" RLS policy on food_toppings
-- Drop overly permissive policies on food_toppings
DROP POLICY IF EXISTS "delete_policy" ON public.food_toppings;
DROP POLICY IF EXISTS "insert_policy" ON public.food_toppings;
DROP POLICY IF EXISTS "update_policy" ON public.food_toppings;

-- Create admin-only policies for food_toppings management
CREATE POLICY "Admins can insert food toppings" 
ON public.food_toppings 
FOR INSERT 
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update food toppings" 
ON public.food_toppings 
FOR UPDATE 
USING (public.has_role('admin'));

CREATE POLICY "Admins can delete food toppings" 
ON public.food_toppings 
FOR DELETE 
USING (public.has_role('admin'));