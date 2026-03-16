-- 1. Enable RLS on order_logs and add policies
ALTER TABLE public.order_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all order logs"
ON public.order_logs
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

CREATE POLICY "Users can view own order logs"
ON public.order_logs
FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

CREATE POLICY "Admins can insert order logs"
ON public.order_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update order logs"
ON public.order_logs
FOR UPDATE
TO authenticated
USING (public.has_role('admin'));

CREATE POLICY "Admins can delete order logs"
ON public.order_logs
FOR DELETE
TO authenticated
USING (public.has_role('admin'));

-- 2. Restrict inventory_items: remove public SELECT, add admin-only
DROP POLICY IF EXISTS "Public can view inventory items" ON public.inventory_items;

CREATE POLICY "Admins can view inventory items"
ON public.inventory_items
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- 3. Also restrict inventory_purchases public SELECT to admin-only
DROP POLICY IF EXISTS "inventory_purchases_select_all" ON public.inventory_purchases