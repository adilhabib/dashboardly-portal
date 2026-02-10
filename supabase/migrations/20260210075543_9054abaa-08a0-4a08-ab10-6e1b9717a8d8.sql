-- Clean up duplicate RLS policies on customer table

-- Drop all existing policies
DROP POLICY IF EXISTS "Admin can update all customer data" ON public.customer;
DROP POLICY IF EXISTS "Admin can view all customer data" ON public.customer;
DROP POLICY IF EXISTS "New users can insert customer data" ON public.customer;
DROP POLICY IF EXISTS "Users can update their own customer data" ON public.customer;
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.customer;

-- SELECT: Users see their own data, admins see all
CREATE POLICY "Users can view own customer data"
ON public.customer
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role('admin'));

-- INSERT: Users can insert their own record
CREATE POLICY "Users can insert own customer data"
ON public.customer
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own, admins can update any
CREATE POLICY "Users can update own customer data"
ON public.customer
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.has_role('admin'));