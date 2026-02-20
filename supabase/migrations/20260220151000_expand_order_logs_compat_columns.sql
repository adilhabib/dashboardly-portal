-- Expand compatibility columns used by legacy order log triggers/functions.
ALTER TABLE IF EXISTS public.order_logs
ADD COLUMN IF NOT EXISTS changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS event_type TEXT NULL,
ADD COLUMN IF NOT EXISTS changed_field TEXT NULL,
ADD COLUMN IF NOT EXISTS old_value TEXT NULL,
ADD COLUMN IF NOT EXISTS new_value TEXT NULL,
ADD COLUMN IF NOT EXISTS user_id UUID NULL;

CREATE INDEX IF NOT EXISTS idx_order_logs_changed_at ON public.order_logs(changed_at DESC);

