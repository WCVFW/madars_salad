-- Update products table to match exact requirements
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS dish_name TEXT;

-- Update dish_name from existing name field
UPDATE public.products 
SET dish_name = name 
WHERE dish_name IS NULL;

-- Rename is_active to is_enabled for clarity
ALTER TABLE public.products 
RENAME COLUMN is_active TO is_enabled;

-- Update RLS policies to use new column name
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Recreate policies with new column name
CREATE POLICY "Anyone can view enabled products" 
ON public.products 
FOR SELECT 
USING (is_enabled = true);

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));