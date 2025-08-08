
-- Add label field to delivery_addresses table
ALTER TABLE public.delivery_addresses 
ADD COLUMN IF NOT EXISTS label text DEFAULT 'Home';

-- Remove the single is_default constraint and allow multiple addresses per user
-- Update the table to support multiple addresses without forcing a default
ALTER TABLE public.delivery_addresses 
ALTER COLUMN is_default SET DEFAULT false;

-- Add address_id to user_subscriptions to link each subscription to a specific address
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS address_id uuid REFERENCES public.delivery_addresses(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_address_id ON public.user_subscriptions(address_id);

-- Enable RLS on delivery_addresses if not already enabled
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery_addresses table
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.delivery_addresses;
DROP POLICY IF EXISTS "Users can create their own addresses" ON public.delivery_addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.delivery_addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.delivery_addresses;

CREATE POLICY "Users can view their own addresses" 
  ON public.delivery_addresses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses" 
  ON public.delivery_addresses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
  ON public.delivery_addresses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
  ON public.delivery_addresses 
  FOR DELETE 
  USING (auth.uid() = user_id);
