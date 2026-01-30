-- Fix the last function without search_path
CREATE OR REPLACE FUNCTION public.create_orders_table(table_name text, table_schema jsonb)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Your implementation here
END;
$$;