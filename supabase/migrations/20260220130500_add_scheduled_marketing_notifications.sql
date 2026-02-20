-- Add scheduling and delivery tracking for promotional notifications
ALTER TABLE public.marketing_notifications
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS send_status TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS last_error TEXT NULL;

-- Keep status values bounded
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'marketing_notifications_send_status_check'
      AND conrelid = 'public.marketing_notifications'::regclass
  ) THEN
    ALTER TABLE public.marketing_notifications
    ADD CONSTRAINT marketing_notifications_send_status_check
      CHECK (send_status IN ('draft', 'scheduled', 'sending', 'sent', 'failed'));
  END IF;
END $$;

-- Fast lookup for scheduler worker
CREATE INDEX IF NOT EXISTS idx_marketing_notifications_schedule_lookup
  ON public.marketing_notifications (send_status, scheduled_for)
  WHERE send_status = 'scheduled';

