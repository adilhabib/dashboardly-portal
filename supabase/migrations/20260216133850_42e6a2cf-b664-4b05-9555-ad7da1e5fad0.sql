
CREATE TRIGGER update_inventory_purchases_updated_at
BEFORE UPDATE ON public.inventory_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();
