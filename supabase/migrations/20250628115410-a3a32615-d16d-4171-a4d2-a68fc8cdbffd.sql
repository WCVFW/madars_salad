
-- Create payment_history table to track all payment transactions
CREATE TABLE public.payment_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription_id uuid REFERENCES public.user_subscriptions,
  order_id uuid REFERENCES public.orders,
  transaction_id text,
  razorpay_payment_id text,
  razorpay_order_id text,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  invoice_number text,
  billing_address jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX idx_payment_history_status ON public.payment_history(payment_status);

-- Enable RLS on payment_history table
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_history table
CREATE POLICY "Users can view their own payment history" 
  ON public.payment_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment history" 
  ON public.payment_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all payment history
CREATE POLICY "Admins can view all payment history" 
  ON public.payment_history 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all payment history" 
  ON public.payment_history 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add razorpay fields to orders table if not exists
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_signature text;

-- Update orders table to include billing address
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS billing_address jsonb;
