-- Troubleshooting and Fixing the "target_topic" error
-- Run these steps in your Supabase SQL Editor

-- 1. Identify which trigger is causing the issue
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement, 
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'marketing_notifications';

-- 2. Check the trigger function source (if you find a trigger name in step 1)
-- Example: if trigger name is 'send_fcm_on_notification'
-- SELECT routine_definition 
-- FROM information_schema.routines 
-- WHERE routine_name = 'YOUR_FUNCTION_NAME_HERE';

-- 3. EMERGENCY FIX: Drop all triggers on the marketing_notifications table 
-- (This will stop the "target_topic" error immediately)

DO $$ 
DECLARE 
    trig_record RECORD;
BEGIN 
    FOR trig_record IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'marketing_notifications' 
          AND event_object_schema = 'public'
    LOOP
        EXECUTE 'DROP TRIGGER ' || trig_record.trigger_name || ' ON public.marketing_notifications;';
    END LOOP;
END $$;

-- 4. Re-add the basic table structure if needed (Optional but safe)
ALTER TABLE public.marketing_notifications 
ADD COLUMN IF NOT EXISTS target_topic TEXT;
