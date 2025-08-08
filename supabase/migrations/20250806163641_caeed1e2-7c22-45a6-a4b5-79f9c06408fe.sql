-- Fix foreign key relationship for payment_history table
-- Add proper foreign key constraint to payment_history.user_id -> profiles.id
ALTER TABLE public.payment_history 
ADD CONSTRAINT fk_payment_history_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix foreign key relationship for orders table  
-- Add proper foreign key constraint to orders.user_id -> profiles.id
ALTER TABLE public.orders 
ADD CONSTRAINT fk_orders_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;