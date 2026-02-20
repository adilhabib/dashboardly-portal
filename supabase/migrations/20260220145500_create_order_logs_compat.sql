-- Compatibility table for existing order status/payment triggers that write to public.order_logs
-- This prevents order updates from failing when legacy trigger code references this table.
CREATE TABLE IF NOT EXISTS public.order_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  old_status TEXT NULL,
  new_status TEXT NULL,
  status TEXT NULL,
  old_payment_status TEXT NULL,
  new_payment_status TEXT NULL,
  payment_status TEXT NULL,
  action TEXT NULL,
  message TEXT NULL,
  details JSONB NULL DEFAULT '{}'::jsonb,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  changed_by UUID NULL,
  customer_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_logs_order_id ON public.order_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_order_logs_created_at ON public.order_logs(created_at DESC);

