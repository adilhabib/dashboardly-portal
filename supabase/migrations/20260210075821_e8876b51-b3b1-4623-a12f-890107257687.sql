-- Clean up duplicate RLS policies on early_access_signups table

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all early access signups" ON public.early_access_signups;
DROP POLICY IF EXISTS "Admins can view early access signups" ON public.early_access_signups;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.early_access_signups;

-- SELECT: Admins only
CREATE POLICY "Admins can view early access signups"
ON public.early_access_signups
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- INSERT: Public access (intentional for signup forms)
CREATE POLICY "Anyone can insert early access signups"
ON public.early_access_signups
FOR INSERT
WITH CHECK (true);