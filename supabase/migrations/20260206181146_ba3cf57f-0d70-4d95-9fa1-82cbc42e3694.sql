-- Fix remaining issues - drop existing conflicting policies first

-- 1. Fix profiles - remove the public SELECT policy "Anyone can view profiles"
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- 2. Fix orders - drop the existing "Admins can insert orders" before recreating
-- (already exists from previous migration partial success - skip)

-- 3. Add admin access to financial_transactions for reporting
-- Check if policy exists first by attempting to drop
DROP POLICY IF EXISTS "Admins can view all financial transactions" ON public.financial_transactions;

CREATE POLICY "Admins can view all financial transactions"
ON public.financial_transactions
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- 4. Add admin access to order_items for fulfillment
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- 5. Add admin access to order_status_updates for support
DROP POLICY IF EXISTS "Admins can view all order status updates" ON public.order_status_updates;
DROP POLICY IF EXISTS "Admins can insert order status updates" ON public.order_status_updates;

CREATE POLICY "Admins can view all order status updates"
ON public.order_status_updates
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

CREATE POLICY "Admins can insert order status updates"
ON public.order_status_updates
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'));