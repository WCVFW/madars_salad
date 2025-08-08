
-- Add pause tracking and limit configuration to user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN pause_limit_days integer DEFAULT 30,
ADD COLUMN total_paused_days integer DEFAULT 0,
ADD COLUMN pause_periods jsonb DEFAULT '[]'::jsonb;

-- Create a function to calculate total paused days from pause_periods
CREATE OR REPLACE FUNCTION calculate_paused_days(pause_periods jsonb)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    period jsonb;
    total_days integer := 0;
    start_date date;
    end_date date;
BEGIN
    FOR period IN SELECT * FROM jsonb_array_elements(pause_periods)
    LOOP
        start_date := (period->>'start_date')::date;
        end_date := (period->>'end_date')::date;
        
        -- If end_date is null, use current date
        IF end_date IS NULL THEN
            end_date := CURRENT_DATE;
        END IF;
        
        total_days := total_days + (end_date - start_date + 1);
    END LOOP;
    
    RETURN total_days;
END;
$$;

-- Create a trigger to automatically update total_paused_days when pause_periods changes
CREATE OR REPLACE FUNCTION update_total_paused_days()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.total_paused_days := calculate_paused_days(NEW.pause_periods);
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_paused_days
    BEFORE UPDATE OF pause_periods ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_total_paused_days();

-- Update existing subscriptions to have default pause limits
UPDATE public.user_subscriptions 
SET pause_limit_days = 30, 
    total_paused_days = 0, 
    pause_periods = '[]'::jsonb
WHERE pause_limit_days IS NULL;
