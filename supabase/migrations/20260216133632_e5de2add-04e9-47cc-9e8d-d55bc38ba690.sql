
CREATE TABLE public.inventory_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  purchase_month date NOT NULL,
  quantity numeric NOT NULL,
  unit_cost numeric NOT NULL,
  total_cost numeric NOT NULL,
  supplier text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inventory purchases"
ON public.inventory_purchases FOR ALL
TO authenticated
USING (has_role('admin'::text))
WITH CHECK (has_role('admin'::text));

CREATE POLICY "Public can view inventory purchases"
ON public.inventory_purchases FOR SELECT
USING (true);
