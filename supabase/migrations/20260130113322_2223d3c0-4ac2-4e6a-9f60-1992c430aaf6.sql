-- Fix 1: Enable RLS on addresses table and add proper policies
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Add SELECT policy for users to view their own addresses
CREATE POLICY "Users can view their own addresses" 
ON public.addresses 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add INSERT policy for users to add their own addresses
CREATE POLICY "Users can insert their own addresses" 
ON public.addresses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for users to update their own addresses
CREATE POLICY "Users can update their own addresses" 
ON public.addresses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admin can view all addresses (for order management)
CREATE POLICY "Admins can view all addresses" 
ON public.addresses 
FOR SELECT 
USING (public.has_role('admin'));

-- Admin can manage all addresses
CREATE POLICY "Admins can manage all addresses" 
ON public.addresses 
FOR ALL 
USING (public.has_role('admin'));

-- Fix 2: Remove overly permissive customer table policies
DROP POLICY IF EXISTS "Allow authenticated users to select customers" ON public.customer;
DROP POLICY IF EXISTS "Allow authenticated users to update customers" ON public.customer;
DROP POLICY IF EXISTS "Allow authenticated users to insert customers" ON public.customer;
DROP POLICY IF EXISTS "Allow authenticated users to delete customers" ON public.customer;

-- Fix 3: Update create_order function with authorization checks
CREATE OR REPLACE FUNCTION public.create_order(order_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id UUID;
  result JSONB;
  input_customer_id UUID;
BEGIN
  -- Extract customer_id from input
  input_customer_id := (order_data->>'customer_id')::UUID;
  
  -- Authorization check: ensure the authenticated user matches the customer_id
  -- OR the user is an admin (admins can create orders for any customer)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required: User must be logged in to create orders';
  END IF;
  
  -- Allow if user is admin OR if creating order for themselves
  IF NOT (auth.uid() = input_customer_id OR public.has_role('admin')) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot create orders for other customers';
  END IF;
  
  -- Validate required fields
  IF order_data->>'order_type' IS NULL THEN
    RAISE EXCEPTION 'Validation error: order_type is required';
  END IF;
  
  IF order_data->>'payment_method' IS NULL THEN
    RAISE EXCEPTION 'Validation error: payment_method is required';
  END IF;
  
  IF (order_data->>'total')::NUMERIC <= 0 THEN
    RAISE EXCEPTION 'Validation error: total must be greater than 0';
  END IF;

  -- Insert the order with the provided data
  INSERT INTO orders (
    customer_id,
    order_type,
    status,
    payment_status,
    payment_method,
    subtotal,
    tax,
    delivery_fee,
    total,
    special_instructions,
    created_at,
    updated_at
  ) VALUES (
    input_customer_id,
    order_data->>'order_type',
    COALESCE(order_data->>'status', 'pending'),
    COALESCE(order_data->>'payment_status', 'pending'),
    order_data->>'payment_method',
    COALESCE((order_data->>'subtotal')::NUMERIC, 0),
    COALESCE((order_data->>'tax')::NUMERIC, 0),
    COALESCE((order_data->>'delivery_fee')::NUMERIC, 0),
    (order_data->>'total')::NUMERIC,
    order_data->>'special_instructions',
    NOW(),
    NOW()
  ) RETURNING id INTO new_order_id;
  
  -- Get the complete order data to return
  SELECT row_to_json(o)::JSONB INTO result
  FROM orders o
  WHERE o.id = new_order_id;
  
  RETURN result;
END;
$$;