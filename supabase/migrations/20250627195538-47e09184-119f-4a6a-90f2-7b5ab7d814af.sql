
-- Add payment_status and admin_approval fields to user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN payment_method text DEFAULT 'upi',
ADD COLUMN payment_status text DEFAULT 'pending',
ADD COLUMN admin_approved boolean DEFAULT false,
ADD COLUMN admin_approved_at timestamp with time zone,
ADD COLUMN admin_approved_by uuid,
ADD COLUMN pause_start_date date,
ADD COLUMN pause_end_date date;

-- Create orders table to track payment and approval workflow
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription_id uuid REFERENCES public.user_subscriptions,
  order_amount numeric NOT NULL,
  payment_method text NOT NULL DEFAULT 'upi',
  payment_status text NOT NULL DEFAULT 'pending',
  admin_approved boolean DEFAULT false,
  admin_approved_at timestamp with time zone,
  admin_approved_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view and update all orders (assuming admin role exists)
CREATE POLICY "Admins can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders" 
  ON public.orders 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Update subscription status options to include paused
-- (Note: This is informational - the status column already exists as text)
