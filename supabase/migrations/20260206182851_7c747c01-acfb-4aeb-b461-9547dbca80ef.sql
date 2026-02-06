-- Clean up duplicate RLS policies on addresses table

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;

-- Create clean, consolidated policies

-- SELECT: Users see their own addresses, admins see all
CREATE POLICY "Users can view own addresses"
ON public.addresses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role('admin'));

-- INSERT: Users can only insert their own addresses
CREATE POLICY "Users can insert own addresses"
ON public.addresses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own, admins can update any
CREATE POLICY "Users can update own addresses"
ON public.addresses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role('admin'));

-- DELETE: Users can delete their own, admins can delete any
CREATE POLICY "Users can delete own addresses"
ON public.addresses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.has_role('admin'));