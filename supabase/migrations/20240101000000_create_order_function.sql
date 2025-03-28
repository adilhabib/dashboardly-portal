-- Create a function to insert orders with server-side privileges
CREATE OR REPLACE FUNCTION create_order(order_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
DECLARE
  new_order_id UUID;
  result JSONB;
BEGIN
  -- Insert the order with the provided data
  INSERT INTO orders (
    user_id,
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
    (order_data->>'user_id')::UUID,
    order_data->>'order_type',
    order_data->>'status',
    order_data->>'payment_status',
    order_data->>'payment_method',
    (order_data->>'subtotal')::NUMERIC,
    (order_data->>'tax')::NUMERIC,
    (order_data->>'delivery_fee')::NUMERIC,
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_order(JSONB) TO authenticated;

-- Add a comment explaining the function
COMMENT ON FUNCTION create_order(JSONB) IS 'Creates an order with server privileges, bypassing RLS policies';