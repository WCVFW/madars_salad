
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format, addDays, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";

interface MealCancellationProps {
  subscriptionId: string;
  onCancellationUpdate: () => void;
}

interface SubscriptionSettings {
  cancellation_cutoff_hours: number;
  max_cancellations_per_month: number;
  carry_forward_limit: number;
}

const MealCancellation = ({ subscriptionId, onCancellationUpdate }: MealCancellationProps) => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [monthlyCancellations, setMonthlyCancellations] = useState(0);

  useEffect(() => {
    fetchSettings();
    fetchMonthlyCancellations();
  }, [subscriptionId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchMonthlyCancellations = async () => {
    try {
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('meal_deliveries')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('status', 'cancelled')
        .gte('delivery_date', firstDay.toISOString().split('T')[0])
        .lte('delivery_date', lastDay.toISOString().split('T')[0]);

      if (error) throw error;
      setMonthlyCancellations(data?.length || 0);
    } catch (error) {
      console.error('Error fetching monthly cancellations:', error);
    }
  };

  const validateCancellation = (selectedDates: Date[]): { valid: boolean; message: string } => {
    if (!settings) return { valid: false, message: "Settings not loaded" };

    // Check monthly cancellation limit
    if (monthlyCancellations + selectedDates.length > settings.max_cancellations_per_month) {
      return { 
        valid: false, 
        message: `Cancellation limit exceeded. You can cancel ${settings.max_cancellations_per_month - monthlyCancellations} more meals this month.` 
      };
    }

    // Check cutoff time for each date
    const cutoffHours = settings.cancellation_cutoff_hours;
    const now = new Date();
    
    for (const date of selectedDates) {
      const cutoffTime = new Date(date);
      cutoffTime.setHours(cutoffTime.getHours() - cutoffHours);
      
      if (isAfter(now, cutoffTime)) {
        return { 
          valid: false, 
          message: `Cannot cancel meals within ${cutoffHours} hours of delivery. Some selected dates are too close.` 
        };
      }
    }

    return { valid: true, message: "" };
  };

  const getSelectedDates = (): Date[] => {
    if (!dateRange?.from) return [];
    if (!dateRange.to) return [dateRange.from];
    
    const dates: Date[] = [];
    let currentDate = new Date(dateRange.from);
    
    while (currentDate <= dateRange.to) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  };

  const handleCancelMeals = async () => {
    if (!dateRange?.from) {
      toast({ title: "Please select dates", variant: "destructive" });
      return;
    }

    const selectedDates = getSelectedDates();
    const validation = validateCancellation(selectedDates);
    
    if (!validation.valid) {
      toast({ title: validation.message, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Cancel meals for selected dates
      for (const date of selectedDates) {
        const { error } = await supabase
          .from('meal_deliveries')
          .update({ 
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            cancellation_reason: 'User cancelled'
          })
          .eq('subscription_id', subscriptionId)
          .eq('delivery_date', date.toISOString().split('T')[0])
          .eq('status', 'scheduled');

        if (error) throw error;
      }

      // Update subscription carry forward meals
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ 
          meals_cancelled: monthlyCancellations + selectedDates.length,
          carry_forward_meals: selectedDates.length // This should be calculated based on actual logic
        })
        .eq('id', subscriptionId);

      if (updateError) throw updateError;

      toast({ title: `Successfully cancelled ${selectedDates.length} meals` });
      setDateRange(undefined);
      setIsOpen(false);
      onCancellationUpdate();
      
    } catch (error) {
      console.error('Error cancelling meals:', error);
      toast({ title: "Failed to cancel meals", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const selectedDates = getSelectedDates();
  const validation = validateCancellation(selectedDates);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Cancel Meals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select Date Range to Cancel</Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick dates to cancel</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => isBefore(date, new Date())}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {selectedDates.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">
              Selected {selectedDates.length} day(s) to cancel
            </p>
            {!validation.valid && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{validation.message}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>Monthly cancellations used: {monthlyCancellations}/{settings?.max_cancellations_per_month}</p>
          <p>Cutoff time: {settings?.cancellation_cutoff_hours} hours before delivery</p>
        </div>

        <Button 
          onClick={handleCancelMeals}
          disabled={!validation.valid || loading || selectedDates.length === 0}
          className="w-full"
        >
          {loading ? "Cancelling..." : `Cancel ${selectedDates.length} Meal(s)`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealCancellation;
