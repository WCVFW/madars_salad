-- Fix the foreign key relationship between user_subscriptions and profiles tables
-- Add proper foreign key constraint to make the relationship explicit

-- First, add a foreign key reference from user_subscriptions to profiles
ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT fk_user_subscriptions_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add missing tables and relationships for subscription management
-- Create subscription_days table for tracking individual meal days
CREATE TABLE public.subscription_days (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id uuid NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  meal_date date NOT NULL,
  meal_taken boolean NOT NULL DEFAULT false,
  cancelled boolean NOT NULL DEFAULT false,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(subscription_id, meal_date)
);

-- Add RLS to subscription_days
ALTER TABLE public.subscription_days ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_days
CREATE POLICY "Users can view own subscription days" 
ON public.subscription_days 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_subscriptions.id = subscription_days.subscription_id 
    AND user_subscriptions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own subscription days" 
ON public.subscription_days 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_subscriptions.id = subscription_days.subscription_id 
    AND user_subscriptions.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all subscription days" 
ON public.subscription_days 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add next_cycle_start column to user_subscriptions for tracking next billing cycle
ALTER TABLE public.user_subscriptions 
ADD COLUMN next_cycle_start date;

-- Create function to auto-generate subscription days when subscription is created/updated
CREATE OR REPLACE FUNCTION public.generate_subscription_days(
  subscription_id_param uuid,
  start_date_param date,
  end_date_param date,
  delivery_days_param text[]
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_date date := start_date_param;
  day_of_week text;
  day_mapping jsonb := '{"Monday": "M", "Tuesday": "T", "Wednesday": "W", "Thursday": "R", "Friday": "F", "Saturday": "S", "Sunday": "U"}';
BEGIN
  -- Delete existing subscription days for this subscription
  DELETE FROM public.subscription_days WHERE subscription_id = subscription_id_param;
  
  -- Generate days until end_date or 365 days from start if no end_date
  WHILE current_date <= COALESCE(end_date_param, start_date_param + INTERVAL '365 days') LOOP
    -- Get day of week
    day_of_week := to_char(current_date, 'Day');
    day_of_week := trim(day_of_week);
    
    -- Check if this day is in delivery_days
    IF (day_mapping->>day_of_week) = ANY(delivery_days_param) THEN
      INSERT INTO public.subscription_days (subscription_id, meal_date)
      VALUES (subscription_id_param, current_date)
      ON CONFLICT (subscription_id, meal_date) DO NOTHING;
    END IF;
    
    current_date := current_date + INTERVAL '1 day';
  END LOOP;
END;
$$;

-- Create trigger to auto-generate subscription days
CREATE OR REPLACE FUNCTION public.handle_subscription_days_generation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only generate days for active subscriptions
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    PERFORM public.generate_subscription_days(
      NEW.id,
      NEW.start_date,
      NEW.end_date,
      NEW.delivery_days
    );
  END IF;
  
  RETURN NEW;
END;
$$;