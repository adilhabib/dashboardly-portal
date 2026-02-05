-- Fix: Add authorization checks to increment_loyalty_points function
-- This function was vulnerable because any authenticated user could call it
-- to modify loyalty points for any customer

CREATE OR REPLACE FUNCTION public.increment_loyalty_points(
  customer_id uuid, 
  points_to_add numeric
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points NUMERIC;
  new_points NUMERIC;
BEGIN
  -- Authorization: Only admins can modify loyalty points
  -- Customers in this system are created by admins (walk-in/phone orders)
  -- and don't have their own auth accounts, so we only allow admin access
  IF NOT public.has_role('admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can modify loyalty points';
  END IF;
  
  -- Validate points_to_add is reasonable (positive and within limits)
  IF points_to_add < 0 THEN
    RAISE EXCEPTION 'Invalid points value: cannot be negative';
  END IF;
  
  IF points_to_add > 100000 THEN
    RAISE EXCEPTION 'Invalid points value: exceeds maximum allowed (100000)';
  END IF;
  
  -- Get current points for the customer
  SELECT loyalty_points INTO current_points
  FROM public.customer
  WHERE id = customer_id;
  
  -- Check if customer exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer not found with ID: %', customer_id;
  END IF;
  
  -- Calculate new points
  new_points := COALESCE(current_points, 0) + points_to_add;
  
  -- Update the customer record
  UPDATE public.customer
  SET loyalty_points = new_points
  WHERE id = customer_id;
  
  RETURN new_points;
END;
$$;