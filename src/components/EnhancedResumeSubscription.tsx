
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Play, AlertTriangle } from "lucide-react";
import { format, isAfter, addDays, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePauseLimits } from "@/hooks/usePauseLimits";

interface EnhancedResumeSubscriptionProps {
  subscriptionId: string;
  onResume: () => void;
  deliveryDays?: string[];
  currentStatus: string;
}

const EnhancedResumeSubscription = ({ 
  subscriptionId, 
  onResume, 
  deliveryDays = [],
  currentStatus 
}: EnhancedResumeSubscriptionProps) => {
  const { toast } = useToast();
  const { pauseLimits, loading: pauseLimitsLoading, resumeSubscription } = usePauseLimits(subscriptionId);
  const [resumeDate, setResumeDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<Date>();

  // Day mapping for delivery days
  const dayMap: { [key: string]: number } = {
    'U': 0, 'M': 1, 'T': 2, 'W': 3, 'R': 4, 'F': 5, 'S': 6
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
    
    for (let i = 1; i <= 14; i++) {
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
    if (isBefore(date, new Date())) return true;
    if (holidays.includes(date.toISOString().split('T')[0])) return true;
    
    if (deliveryDays.length > 0) {
      const dayOfWeek = date.getDay();
      const deliveryDayNumbers = deliveryDays.map(day => dayMap[day]).filter(day => day !== undefined);
      return !deliveryDayNumbers.includes(dayOfWeek);
    }
    
    return false;
  };

  const handleResumeNow = async () => {
    setLoading(true);
    try {
      const success = await resumeSubscription();
      if (success) {
        toast({ title: "Subscription resumed successfully!" });
        onResume();
      }
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast({ title: "Failed to resume subscription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeFromDate = async () => {
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

      // Also update pause periods to close current pause
      await resumeSubscription();

      toast({ title: "Subscription will resume on selected date!" });
      onResume();
    } catch (error) {
      console.error('Error scheduling resume:', error);
      toast({ title: "Failed to schedule resume", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'paused') {
    return null;
  }

  if (pauseLimitsLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-green-600" />
          Resume Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pause Limit Information */}
        {pauseLimits && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Pause Usage</span>
            </div>
            <p className="text-sm text-blue-700">
              Used: {pauseLimits.total_paused_days} of {pauseLimits.pause_limit_days} days
            </p>
            <p className="text-sm text-blue-700">
              Remaining: {pauseLimits.remainingPauseDays} days
            </p>
          </div>
        )}

        {/* Next Delivery Date Recommendation */}
        {nextDeliveryDate && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Recommended:</strong> Next delivery date is {format(nextDeliveryDate, 'PPP')}
            </p>
          </div>
        )}

        {/* Resume Now Button */}
        <Button 
          onClick={handleResumeNow}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? "Resuming..." : "Resume Now"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Resume from Date Selection */}
        <div>
          <Label htmlFor="resumeDate">Resume from Specific Date</Label>
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
          onClick={handleResumeFromDate}
          disabled={!resumeDate || loading}
          variant="outline"
          className="w-full"
        >
          {loading ? "Scheduling..." : "Resume from Selected Date"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedResumeSubscription;
