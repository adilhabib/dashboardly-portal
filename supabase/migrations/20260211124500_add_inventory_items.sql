CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT,
  unit TEXT NOT NULL DEFAULT 'pcs',
  quantity NUMERIC NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reorder_level NUMERIC NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  cost_per_unit NUMERIC CHECK (cost_per_unit IS NULL OR cost_per_unit >= 0),
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  last_restocked TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view inventory items"
ON public.inventory_items
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert inventory items"
ON public.inventory_items
FOR INSERT
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can update inventory items"
ON public.inventory_items
FOR UPDATE
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admins can delete inventory items"
ON public.inventory_items
FOR DELETE
USING (public.has_role('admin'));

CREATE OR REPLACE FUNCTION public.update_inventory_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_items_updated_at_trigger
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_items_updated_at();
