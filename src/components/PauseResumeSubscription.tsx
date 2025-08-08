
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Pause, AlertTriangle } from "lucide-react";
import { format, isAfter, addDays, isBefore, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePauseLimits } from "@/hooks/usePauseLimits";
import EnhancedResumeSubscription from "./EnhancedResumeSubscription";

interface PauseResumeSubscriptionProps {
  subscription: {
    id: string;
    status: string;
    delivery_days: string[];
    pause_start_date?: string | null;
    pause_end_date?: string | null;
  };
  onUpdate: () => void;
}

const PauseResumeSubscription = ({ subscription, onUpdate }: PauseResumeSubscriptionProps) => {
  const { toast } = useToast();
  const { pauseLimits, loading: pauseLimitsLoading, addPausePeriod } = usePauseLimits(subscription.id);
  const [pauseStartDate, setPauseStartDate] = useState<Date>();
  const [pauseEndDate, setPauseEndDate] = useState<Date>();
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePause = async () => {
    if (!pauseStartDate || !pauseEndDate) {
      toast({ title: "Please select both start and end dates for pause", variant: "destructive" });
      return;
    }

    if (!isAfter(pauseEndDate, pauseStartDate)) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }

    // Check if pause would exceed limits
    const pauseDays = differenceInDays(pauseEndDate, pauseStartDate) + 1;
    if (pauseLimits && (pauseLimits.total_paused_days + pauseDays) > pauseLimits.pause_limit_days) {
      toast({ 
        title: "Pause limit exceeded", 
        description: `This pause would exceed your limit of ${pauseLimits.pause_limit_days} days. You have ${pauseLimits.remainingPauseDays} days remaining.`,
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      // Update subscription status
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'paused',
          pause_start_date: pauseStartDate.toISOString().split('T')[0],
          pause_end_date: pauseEndDate.toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id);

      if (subscriptionError) throw subscriptionError;

      // Add pause period to tracking
      const success = await addPausePeriod(pauseStartDate, pauseEndDate);
      if (!success) throw new Error("Failed to track pause period");

      toast({ title: "Subscription paused successfully!" });
      onUpdate();
      
    } catch (error) {
      console.error('Error pausing subscription:', error);
      toast({ title: "Failed to pause subscription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (subscription.status === 'paused') {
    return (
      <EnhancedResumeSubscription 
        subscriptionId={subscription.id}
        onResume={onUpdate}
        deliveryDays={subscription.delivery_days}
        currentStatus={subscription.status}
      />
    );
  }

  if (pauseLimitsLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if user can pause
  const canPause = pauseLimits?.canPause ?? true;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pause className="h-5 w-5 text-orange-600" />
          Pause Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pause Limit Information */}
        {pauseLimits && (
          <div className={cn(
            "p-3 border rounded-lg",
            canPause ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={cn("h-4 w-4", canPause ? "text-blue-600" : "text-red-600")} />
              <span className={cn("font-medium", canPause ? "text-blue-800" : "text-red-800")}>
                Pause Usage
              </span>
            </div>
            <p className={cn("text-sm", canPause ? "text-blue-700" : "text-red-700")}>
              Used: {pauseLimits.total_paused_days} of {pauseLimits.pause_limit_days} days
            </p>
            <p className={cn("text-sm", canPause ? "text-blue-700" : "text-red-700")}>
              Remaining: {pauseLimits.remainingPauseDays} days
            </p>
            {!canPause && (
              <p className="text-sm text-red-700 mt-2 font-medium">
                You've reached your maximum pause limit. Resume your subscription to continue.
              </p>
            )}
          </div>
        )}

        {canPause ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pauseStartDate">Pause Start Date</Label>
                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pauseStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pauseStartDate ? format(pauseStartDate, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pauseStartDate}
                      onSelect={setPauseStartDate}
                      disabled={(date) => isBefore(date, new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="pauseEndDate">Pause End Date</Label>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pauseEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pauseEndDate ? format(pauseEndDate, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pauseEndDate}
                      onSelect={setPauseEndDate}
                      disabled={(date) => isBefore(date, pauseStartDate || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Show pause duration warning */}
            {pauseStartDate && pauseEndDate && pauseLimits && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Pause Duration:</strong> {differenceInDays(pauseEndDate, pauseStartDate) + 1} days
                </p>
                <p className="text-sm text-yellow-800">
                  <strong>After this pause:</strong> {pauseLimits.remainingPauseDays - (differenceInDays(pauseEndDate, pauseStartDate) + 1)} days remaining
                </p>
              </div>
            )}

            <Button 
              onClick={handlePause}
              disabled={!pauseStartDate || !pauseEndDate || loading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Pausing..." : "Pause Subscription"}
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">You cannot pause your subscription at this time.</p>
            <p className="text-sm text-gray-500 mt-1">You've reached your maximum pause limit for this period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PauseResumeSubscription;
