-- =====================================================
-- FIX 1: Categories table - Replace overly permissive policies with admin-only
-- =====================================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON public.categories;

-- Create admin-only policies for category management
CREATE POLICY "Admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (public.has_role('admin'));

CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (public.has_role('admin'));

-- =====================================================
-- FIX 2: Orders table - Replace overly permissive policies
-- =====================================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to view all orders" ON public.orders;

-- Create proper admin policies for order management
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.has_role('admin'));

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (public.has_role('admin'));

CREATE POLICY "Admins can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (public.has_role('admin'));

-- =====================================================
-- FIX 3: Food images table - Replace overly permissive policies with admin-only
-- =====================================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can delete food images" ON public.food_images;
DROP POLICY IF EXISTS "Authenticated users can insert food images" ON public.food_images;
DROP POLICY IF EXISTS "Authenticated users can update food images" ON public.food_images;

-- Create admin-only policies for food image management
CREATE POLICY "Admins can insert food images" 
ON public.food_images 
FOR INSERT 
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update food images" 
ON public.food_images 
FOR UPDATE 
USING (public.has_role('admin'));

CREATE POLICY "Admins can delete food images" 
ON public.food_images 
FOR DELETE 
USING (public.has_role('admin'));

-- =====================================================
-- FIX 4: Fix function search_path issues
-- =====================================================

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(requested_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = requested_role
  );
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Fix update_customer_updated_at function
CREATE OR REPLACE FUNCTION public.update_customer_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;

-- Fix record_financial_transaction function
CREATE OR REPLACE FUNCTION public.record_financial_transaction(p_amount numeric, p_type text, p_description text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  INSERT INTO public.financial_transactions (
    user_id,
    amount,
    type,
    description
  ) VALUES (
    auth.uid(),
    p_amount,
    p_type,
    p_description
  ) RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;

-- Fix record_order_income function
CREATE OR REPLACE FUNCTION public.record_order_income()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.financial_transactions (
        user_id,
        amount,
        type,
        description,
        status
    )
    VALUES (
        auth.uid(),
        NEW.total,
        'income',
        'Order #' || substring(NEW.id::text, 1, 8),
        'completed'
    );
    
    RETURN NEW;
END;
$$;

-- Fix update_banners_updated_at function
CREATE OR REPLACE FUNCTION public.update_banners_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Fix update_customers_updated_at function
CREATE OR REPLACE FUNCTION public.update_customers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$;

-- Fix update_food_sizes_updated_at function
CREATE OR REPLACE FUNCTION public.update_food_sizes_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$;

-- Fix update_orders_updated_at function
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;

-- Fix increment_loyalty_points function (customer version)
CREATE OR REPLACE FUNCTION public.increment_loyalty_points(customer_id uuid, points_to_add numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points NUMERIC;
  new_points NUMERIC;
BEGIN
  SELECT loyalty_points INTO current_points
  FROM public.customer
  WHERE id = customer_id;
  
  new_points := COALESCE(current_points, 0) + points_to_add;
  
  UPDATE public.customer
  SET loyalty_points = new_points
  WHERE id = customer_id;
  
  RETURN new_points;
END;
$$;

-- Fix assign_admin_to_email trigger function
CREATE OR REPLACE FUNCTION public.assign_admin_to_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'habib661@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_timestamp function
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;

-- =====================================================
-- FIX 5: Banners table - Add admin management policies
-- =====================================================

-- Add admin policies for banner management (currently missing INSERT/UPDATE/DELETE)
CREATE POLICY "Admins can insert banners" 
ON public.banners 
FOR INSERT 
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update banners" 
ON public.banners 
FOR UPDATE 
USING (public.has_role('admin'));

CREATE POLICY "Admins can delete banners" 
ON public.banners 
FOR DELETE 
USING (public.has_role('admin'));

-- =====================================================
-- FIX 6: customer_details table - Enable RLS and add policies
-- =====================================================

-- Enable RLS on customer_details
ALTER TABLE public.customer_details ENABLE ROW LEVEL SECURITY;

-- Add user-scoped policies
CREATE POLICY "Users can view their own customer details" 
ON public.customer_details 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own customer details" 
ON public.customer_details 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own customer details" 
ON public.customer_details 
FOR UPDATE 
USING (auth.uid() = customer_id);

-- Admin policies for customer_details
CREATE POLICY "Admins can view all customer details" 
ON public.customer_details 
FOR SELECT 
USING (public.has_role('admin'));

CREATE POLICY "Admins can manage all customer details" 
ON public.customer_details 
FOR ALL 
USING (public.has_role('admin'));