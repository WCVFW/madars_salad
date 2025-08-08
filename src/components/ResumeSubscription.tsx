
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Play } from "lucide-react";
import { format, isAfter, addDays, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResumeSubscriptionProps {
  subscriptionId: string;
  onResume: () => void;
  deliveryDays?: string[];
}

const ResumeSubscription = ({ subscriptionId, onResume, deliveryDays = [] }: ResumeSubscriptionProps) => {
  const { toast } = useToast();
  const [resumeDate, setResumeDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<Date>();

  // Day mapping for delivery days
  const dayMap: { [key: string]: number } = {
    'U': 0, // Sunday
    'M': 1, // Monday
    'T': 2, // Tuesday
    'W': 3, // Wednesday
    'R': 4, // Thursday
    'F': 5, // Friday
    'S': 6  // Saturday
  };

  useEffect(() => {
    fetchHolidays();
    calculateNextDeliveryDate();
  }, [deliveryDays]);

  const fetchHolidays = async () => {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('date')
        .eq('is_active', true)
        .gte('date', new Date().toISOString().split('T')[0]);

      if (error) throw error;
      
      const holidayDates = data?.map(h => h.date) || [];
      setHolidays(holidayDates);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const calculateNextDeliveryDate = () => {
    if (deliveryDays.length === 0) return;

    const today = new Date();
    const deliveryDayNumbers = deliveryDays.map(day => dayMap[day]).filter(day => day !== undefined);
    
    // Find the next available delivery day
    for (let i = 1; i <= 14; i++) { // Check next 2 weeks
      const checkDate = addDays(today, i);
      const dayOfWeek = checkDate.getDay();
      
      if (deliveryDayNumbers.includes(dayOfWeek) && !holidays.includes(checkDate.toISOString().split('T')[0])) {
        setNextDeliveryDate(checkDate);
        setResumeDate(checkDate);
        break;
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, new Date())) return true;
    
    // Disable holidays
    if (holidays.includes(date.toISOString().split('T')[0])) return true;
    
    // If delivery days are specified, only allow those days
    if (deliveryDays.length > 0) {
      const dayOfWeek = date.getDay();
      const deliveryDayNumbers = deliveryDays.map(day => dayMap[day]).filter(day => day !== undefined);
      return !deliveryDayNumbers.includes(dayOfWeek);
    }
    
    return false;
  };

  const handleResume = async () => {
    if (!resumeDate) {
      toast({ title: "Please select a resume date", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'active',
          start_date: resumeDate.toISOString().split('T')[0],
          pause_start_date: null,
          pause_end_date: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({ title: "Subscription resumed successfully!" });
      onResume();
      
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast({ title: "Failed to resume subscription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-green-600" />
          Resume Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextDeliveryDate && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Recommended:</strong> Next delivery date is {format(nextDeliveryDate, 'PPP')}
            </p>
          </div>
        )}
        
        <div>
          <Label htmlFor="resumeDate">Select Resume Date</Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !resumeDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {resumeDate ? format(resumeDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={resumeDate}
                onSelect={setResumeDate}
                disabled={isDateDisabled}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500 mt-1">
            Only delivery days are selectable. Holidays are automatically excluded.
          </p>
        </div>

        <Button 
          onClick={handleResume}
          disabled={!resumeDate || loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? "Resuming..." : "Resume Subscription"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeSubscription;
