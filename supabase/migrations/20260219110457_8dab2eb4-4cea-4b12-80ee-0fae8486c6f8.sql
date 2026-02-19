-- Fix 1: Add admin authorization check to record_financial_transaction
-- Prevents any authenticated user from creating arbitrary financial transaction records
CREATE OR REPLACE FUNCTION public.record_financial_transaction(
  p_amount numeric,
  p_type text,
  p_description text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Authorization check: Only admins can record financial transactions
  IF NOT public.has_role('admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can record financial transactions';
  END IF;

  -- Validate amount is positive
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Validation error: amount must be greater than 0';
  END IF;

  -- Validate type
  IF p_type NOT IN ('income', 'expense') THEN
    RAISE EXCEPTION 'Validation error: type must be income or expense';
  END IF;

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

-- Fix 2: Ensure food_images has a public SELECT policy (for menu display)
-- Drop existing if present to avoid duplicates, then recreate cleanly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'food_images' 
    AND policyname = 'food_images_select_all'
  ) THEN
    EXECUTE 'CREATE POLICY "food_images_select_all" ON public.food_images FOR SELECT USING (true)';
  END IF;
END $$;

-- Fix 3: Ensure banners has both a public SELECT for active banners AND admin SELECT for all banners
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'banners' 
    AND policyname = 'Active banners are viewable by everyone'
  ) THEN
    EXECUTE 'CREATE POLICY "Active banners are viewable by everyone" ON public.banners FOR SELECT USING (is_active = true)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'banners' 
    AND policyname = 'Admins can view all banners'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all banners" ON public.banners FOR SELECT USING (has_role(''admin''::text))';
  END IF;
END $$;