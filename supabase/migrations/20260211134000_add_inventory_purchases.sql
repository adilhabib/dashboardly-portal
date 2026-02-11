CREATE TABLE IF NOT EXISTS public.inventory_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id),
  purchase_date DATE NOT NULL,
  purchase_month DATE NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC NOT NULL CHECK (unit_cost >= 0),
  total_cost NUMERIC NOT NULL CHECK (total_cost >= 0),
  supplier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_purchases_purchase_date
  ON public.inventory_purchases (purchase_date DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_purchases_purchase_month
  ON public.inventory_purchases (purchase_month DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_purchases_inventory_item_id
  ON public.inventory_purchases (inventory_item_id);

ALTER TABLE public.inventory_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory purchases"
ON public.inventory_purchases
FOR SELECT
USING (public.has_role('admin'));

CREATE POLICY "Admins can insert inventory purchases"
ON public.inventory_purchases
FOR INSERT
WITH CHECK (public.has_role('admin'));

CREATE OR REPLACE FUNCTION public.sync_inventory_purchase_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.purchase_month = DATE_TRUNC('month', NEW.purchase_date)::DATE;
  NEW.total_cost = ROUND((NEW.quantity * NEW.unit_cost)::NUMERIC, 2);
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_inventory_purchase_fields_trigger
BEFORE INSERT OR UPDATE ON public.inventory_purchases
FOR EACH ROW
EXECUTE FUNCTION public.sync_inventory_purchase_fields();

CREATE OR REPLACE FUNCTION public.apply_inventory_purchase_to_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.inventory_items
  SET
    quantity = quantity + NEW.quantity,
    last_restocked = NEW.purchase_date::TIMESTAMPTZ
  WHERE id = NEW.inventory_item_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apply_inventory_purchase_to_stock_trigger
AFTER INSERT ON public.inventory_purchases
FOR EACH ROW
EXECUTE FUNCTION public.apply_inventory_purchase_to_stock();
