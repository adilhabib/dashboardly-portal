-- Clean up duplicate RLS policies on orders table

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to delete orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- SELECT: Users see their own orders, admins see all
CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = customer_id OR public.has_role('admin'));

-- INSERT: Users can insert their own, admins can insert any
CREATE POLICY "Users can insert own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = customer_id OR public.has_role('admin'));

-- UPDATE: Users can update their own, admins can update any
CREATE POLICY "Users can update own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id OR public.has_role('admin'));

-- DELETE: Only admins can delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.has_role('admin'));