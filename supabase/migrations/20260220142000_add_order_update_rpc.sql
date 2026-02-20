-- Server-side order update functions for admin dashboard actions
CREATE OR REPLACE FUNCTION public.update_order_status(
  p_order_id uuid,
  p_status text
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.has_role('admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  IF p_status NOT IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid order status: %', p_status;
  END IF;

  UPDATE public.orders
  SET status = p_status,
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  RETURN v_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_order_payment_status(
  p_order_id uuid,
  p_payment_status text
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.has_role('admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  IF p_payment_status NOT IN ('pending', 'paid', 'failed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid payment status: %', p_payment_status;
  END IF;

  UPDATE public.orders
  SET payment_status = p_payment_status,
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  RETURN v_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_order_payment_status(uuid, text) TO authenticated;

