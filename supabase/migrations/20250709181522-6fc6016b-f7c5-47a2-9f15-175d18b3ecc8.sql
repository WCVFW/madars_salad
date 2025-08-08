-- Fix RLS policies for products table to allow admin operations properly
-- First drop existing duplicate policies
DROP POLICY IF EXISTS "Admins can read products" ON public.products;
DROP POLICY IF EXISTS "Admins can modify products" ON public.products;

-- Keep the working policies and ensure admin can do all operations
-- The "Admins can manage products" policy should handle all admin operations
-- Let's verify it's using the correct function
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Recreate the admin policy to ensure it works correctly
CREATE POLICY "Admins can manage all products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));