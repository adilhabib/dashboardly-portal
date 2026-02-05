-- Fix 1: Profiles table - restrict SELECT to own profile or admins
-- Drop existing permissive SELECT policy if it exists
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create restrictive SELECT policy - users can only see their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role('admin'));

-- Fix 2: early_access_signups - restrict SELECT to admins only
-- The INSERT is intentionally public for signup forms (per project requirements)
DROP POLICY IF EXISTS "Anyone can view early access signups" ON public.early_access_signups;
DROP POLICY IF EXISTS "Users can view early access signups" ON public.early_access_signups;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.early_access_signups;

-- Only admins can view the signups data
CREATE POLICY "Admins can view early access signups"
ON public.early_access_signups
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- Add rate limiting protection for INSERT (basic spam protection)
-- Keep the existing public INSERT but add a note that additional protection
-- should be implemented at the application/edge function level