
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  meals_per_day INTEGER NOT NULL DEFAULT 1,
  meals_per_week INTEGER NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery zones table for PIN code validation
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pincode TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  is_serviceable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
  delivery_pincode TEXT NOT NULL,
  meals_per_day INTEGER NOT NULL,
  meals_per_week INTEGER NOT NULL,
  delivery_days TEXT[] NOT NULL, -- Array like ['M', 'T', 'W', 'T', 'F']
  meal_preference TEXT NOT NULL CHECK (meal_preference IN ('veg', 'non-veg')),
  meals_delivered INTEGER DEFAULT 0,
  meals_cancelled INTEGER DEFAULT 0,
  carry_forward_meals INTEGER DEFAULT 0,
  cancellation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal deliveries table to track individual meals
CREATE TABLE public.meal_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'delivered', 'cancelled', 'skipped')) DEFAULT 'scheduled',
  meals_count INTEGER NOT NULL DEFAULT 1,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create holidays table for admin-declared holidays
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT, -- NULL for global holidays, specific for location-based
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription settings table for cutoff times and limits
CREATE TABLE public.subscription_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cancellation_cutoff_hours INTEGER DEFAULT 24, -- Hours before delivery
  max_cancellations_per_month INTEGER DEFAULT 5,
  carry_forward_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_plans (public read)
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.subscription_plans
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for delivery_zones (public read for PIN validation)
CREATE POLICY "Anyone can check delivery zones" ON public.delivery_zones
  FOR SELECT USING (is_serviceable = true);

CREATE POLICY "Admins can manage delivery zones" ON public.delivery_zones
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for meal_deliveries
CREATE POLICY "Users can view own meal deliveries" ON public.meal_deliveries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_subscriptions 
      WHERE id = meal_deliveries.subscription_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own meal deliveries" ON public.meal_deliveries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_subscriptions 
      WHERE id = meal_deliveries.subscription_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all meal deliveries" ON public.meal_deliveries
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for holidays (public read)
CREATE POLICY "Anyone can view holidays" ON public.holidays
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage holidays" ON public.holidays
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for subscription_settings (public read)
CREATE POLICY "Anyone can view settings" ON public.subscription_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.subscription_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert sample data
INSERT INTO public.subscription_plans (name, description, price, meals_per_day, meals_per_week, plan_type) VALUES
('Essential Weekly', 'Perfect for individuals - 1 meal per day, 5 days a week', 1500.00, 1, 5, 'weekly'),
('Family Weekly', 'Great for families - 2 meals per day, 7 days a week', 3500.00, 2, 7, 'weekly'),
('Premium Monthly', 'Premium plan - 3 meals per day, 30 days a month', 12000.00, 3, 30, 'monthly'),
('Starter Plan', 'Try our service - 1 meal per day, 3 days a week', 900.00, 1, 3, 'weekly');

INSERT INTO public.delivery_zones (pincode, city, state) VALUES
('560001', 'Bangalore', 'Karnataka'),
('560002', 'Bangalore', 'Karnataka'),
('560003', 'Bangalore', 'Karnataka'),
('400001', 'Mumbai', 'Maharashtra'),
('400002', 'Mumbai', 'Maharashtra'),
('110001', 'Delhi', 'Delhi'),
('600001', 'Chennai', 'Tamil Nadu'),
('500001', 'Hyderabad', 'Telangana');

INSERT INTO public.subscription_settings (cancellation_cutoff_hours, max_cancellations_per_month, carry_forward_limit) VALUES
(24, 5, 10);

INSERT INTO public.holidays (date, name, description) VALUES
('2024-01-26', 'Republic Day', 'National Holiday'),
('2024-08-15', 'Independence Day', 'National Holiday'),
('2024-10-02', 'Gandhi Jayanti', 'National Holiday');
