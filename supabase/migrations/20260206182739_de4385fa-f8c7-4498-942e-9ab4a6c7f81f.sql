-- Clean up duplicate RLS policies on foods and categories tables

-- ============ FOODS TABLE ============
-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage foods" ON public.foods;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.foods;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.foods;
DROP POLICY IF EXISTS "Allow public read access" ON public.foods;
DROP POLICY IF EXISTS "Foods are visible to everyone" ON public.foods;

-- Create clean policies for foods
-- SELECT: Public read access for menu viewing
CREATE POLICY "Public can view foods"
ON public.foods
FOR SELECT
USING (true);

-- INSERT: Admins only
CREATE POLICY "Admins can insert foods"
ON public.foods
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'));

-- UPDATE: Admins only
CREATE POLICY "Admins can update foods"
ON public.foods
FOR UPDATE
TO authenticated
USING (public.has_role('admin'));

-- DELETE: Admins only
CREATE POLICY "Admins can delete foods"
ON public.foods
FOR DELETE
TO authenticated
USING (public.has_role('admin'));

-- ============ CATEGORIES TABLE ============
-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to select categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;

-- Create clean policies for categories
-- SELECT: Public read access for menu browsing
CREATE POLICY "Public can view categories"
ON public.categories
FOR SELECT
USING (true);

-- INSERT: Admins only
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'));

-- UPDATE: Admins only
CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.has_role('admin'));

-- DELETE: Admins only
CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (public.has_role('admin'));