
-- Fix 1: Harden create_order function with customer existence validation and numeric range checks
CREATE OR REPLACE FUNCTION public.create_order(order_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_order_id UUID;
  result JSONB;
  input_customer_id UUID;
  v_subtotal NUMERIC;
  v_tax NUMERIC;
  v_delivery_fee NUMERIC;
  v_total NUMERIC;
BEGIN
  -- Extract customer_id from input
  input_customer_id := (order_data->>'customer_id')::UUID;
  
  -- Authentication check
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required: User must be logged in to create orders';
  END IF;
  
  -- Authorization check
  IF NOT (auth.uid() = input_customer_id OR public.has_role('admin')) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot create orders for other customers';
  END IF;
  
  -- Validate customer exists
  IF NOT EXISTS (SELECT 1 FROM public.customer WHERE id = input_customer_id) THEN
    RAISE EXCEPTION 'Validation error: customer not found';
  END IF;
  
  -- Validate required fields
  IF order_data->>'order_type' IS NULL THEN
    RAISE EXCEPTION 'Validation error: order_type is required';
  END IF;
  
  IF order_data->>'payment_method' IS NULL THEN
    RAISE EXCEPTION 'Validation error: payment_method is required';
  END IF;
  
  -- Parse and validate numeric fields
  v_subtotal := COALESCE((order_data->>'subtotal')::NUMERIC, 0);
  v_tax := COALESCE((order_data->>'tax')::NUMERIC, 0);
  v_delivery_fee := COALESCE((order_data->>'delivery_fee')::NUMERIC, 0);
  v_total := (order_data->>'total')::NUMERIC;
  
  IF v_total <= 0 THEN
    RAISE EXCEPTION 'Validation error: total must be greater than 0';
  END IF;
  
  IF v_total > 1000000 THEN
    RAISE EXCEPTION 'Validation error: total exceeds maximum allowed';
  END IF;
  
  IF v_subtotal < 0 OR v_tax < 0 OR v_delivery_fee < 0 THEN
    RAISE EXCEPTION 'Validation error: numeric values cannot be negative';
  END IF;

  -- Insert the order
  INSERT INTO orders (
    customer_id, order_type, status, payment_status, payment_method,
    subtotal, tax, delivery_fee, total, special_instructions,
    created_at, updated_at
  ) VALUES (
    input_customer_id,
    order_data->>'order_type',
    COALESCE(order_data->>'status', 'pending'),
    COALESCE(order_data->>'payment_status', 'pending'),
    order_data->>'payment_method',
    v_subtotal, v_tax, v_delivery_fee, v_total,
    order_data->>'special_instructions',
    NOW(), NOW()
  ) RETURNING id INTO new_order_id;
  
  SELECT row_to_json(o)::JSONB INTO result
  FROM orders o WHERE o.id = new_order_id;
  
  RETURN result;
END;
$function$;

-- Fix 2: Update customer INSERT policy to allow admins to create walk-in customers
DROP POLICY IF EXISTS "Users can insert own customer data" ON public.customer;

CREATE POLICY "Users can insert own customer data"
ON public.customer
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id OR public.has_role('admin'));
