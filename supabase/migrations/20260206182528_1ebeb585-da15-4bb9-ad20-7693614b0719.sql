-- Fix financial_summary VIEW - Views cannot have RLS directly,
-- but we need to ensure proper access control
-- financial_summary is a VIEW over financial_transactions, which already has RLS

-- Recreate the financial_summary view with security_invoker enabled
-- This ensures the view respects the RLS policies of the underlying table

DROP VIEW IF EXISTS public.financial_summary;

CREATE VIEW public.financial_summary
WITH (security_invoker = on) AS
SELECT 
  user_id,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance,
  COUNT(*) as total_transactions,
  MAX(created_at) as last_transaction_date
FROM public.financial_transactions
GROUP BY user_id;