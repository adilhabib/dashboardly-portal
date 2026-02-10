-- Clean up duplicate RLS policies on customer_details table

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage all customer details" ON public.customer_details;
DROP POLICY IF EXISTS "Admins can view all customer details" ON public.customer_details;
DROP POLICY IF EXISTS "Users can insert their own customer details" ON public.customer_details;
DROP POLICY IF EXISTS "Users can update their own customer details" ON public.customer_details;
DROP POLICY IF EXISTS "Users can view their own customer details" ON public.customer_details;

-- SELECT: Users see their own, admins see all
CREATE POLICY "Users can view own customer details"
ON public.customer_details
FOR SELECT
TO authenticated
USING (auth.uid() = customer_id OR public.has_role('admin'));

-- INSERT: Users can insert their own
CREATE POLICY "Users can insert own customer details"
ON public.customer_details
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = customer_id OR public.has_role('admin'));

-- UPDATE: Users can update their own, admins can update any
CREATE POLICY "Users can update own customer details"
ON public.customer_details
FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id OR public.has_role('admin'));

-- DELETE: Only admins
CREATE POLICY "Admins can delete customer details"
ON public.customer_details
FOR DELETE
TO authenticated
USING (public.has_role('admin'));