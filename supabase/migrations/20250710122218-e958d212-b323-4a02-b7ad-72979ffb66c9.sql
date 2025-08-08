-- Create product_submissions table for user-uploaded products pending admin approval
CREATE TABLE public.product_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid NULL,
  reviewed_at timestamp with time zone NULL,
  review_notes text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Product fields (same as products table)
  name text NOT NULL,
  description text NULL,
  price numeric NOT NULL,
  category text NULL,
  subcategory text NULL,
  dish_name text NULL,
  veg_or_nonveg text NULL,
  image_url text NULL,
  image_opened_url text NULL,
  recipe_link text NULL,
  swiggy_url text NULL,
  zomato_url text NULL,
  tags text NULL,
  dressing text NULL,
  crunch_topping text NULL,
  macros jsonb NULL,
  is_enabled boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE public.product_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for product submissions
CREATE POLICY "Users can submit products" 
ON public.product_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can view their own submissions" 
ON public.product_submissions 
FOR SELECT 
USING (auth.uid() = submitted_by);

CREATE POLICY "Admins can view all submissions" 
ON public.product_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all submissions" 
ON public.product_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_product_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_submissions_updated_at
BEFORE UPDATE ON public.product_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_product_submissions_updated_at();