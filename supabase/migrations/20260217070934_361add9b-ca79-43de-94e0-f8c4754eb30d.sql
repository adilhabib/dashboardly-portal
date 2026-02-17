-- Create a function that inserts into push_queue when a marketing notification is created
CREATE OR REPLACE FUNCTION public.notify_marketing_push()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only send push if the notification is active
  IF NEW.is_active IS TRUE OR NEW.is_active IS NULL THEN
    INSERT INTO public.push_queue (user_id, title, body, payload, status)
    SELECT 
      d.user_id,
      NEW.title,
      NEW.message,
      jsonb_build_object('type', 'marketing', 'image_url', NEW.image_url, 'notification_id', NEW.id),
      'pending'
    FROM public.devices d;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on insert
CREATE TRIGGER on_marketing_notification_created
AFTER INSERT ON public.marketing_notifications
FOR EACH ROW
EXECUTE FUNCTION public.notify_marketing_push();
