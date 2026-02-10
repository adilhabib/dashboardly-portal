-- Clean up food_sizes RLS policies to use has_role() consistently

-- Drop existing policies with mixed JWT checks
DROP POLICY IF EXISTS "Allow authenticated users to delete food sizes" ON public.food_sizes;
DROP POLICY IF EXISTS "Allow authenticated users to insert food sizes" ON public.food_sizes;
DROP POLICY IF EXISTS "Allow authenticated users to update food sizes" ON public.food_sizes;
DROP POLICY IF EXISTS "Allow public read access" ON public.food_sizes;

-- SELECT: Public read access
CREATE POLICY "Public can view food sizes"
ON public.food_sizes
FOR SELECT
USING (true);

-- INSERT: Admins only
CREATE POLICY "Admins can insert food sizes"
ON public.food_sizes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'));

-- UPDATE: Admins only
CREATE POLICY "Admins can update food sizes"
ON public.food_sizes
FOR UPDATE
TO authenticated
USING (public.has_role('admin'));

-- DELETE: Admins only
CREATE POLICY "Admins can delete food sizes"
ON public.food_sizes
FOR DELETE
TO authenticated
USING (public.has_role('admin'));