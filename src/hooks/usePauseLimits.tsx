
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PausePeriod {
  start_date: string;
  end_date: string | null;
}

interface PauseLimitsData {
  pause_limit_days: number;
  total_paused_days: number;
  pause_periods: PausePeriod[];
  canPause: boolean;
  remainingPauseDays: number;
}

export const usePauseLimits = (subscriptionId: string) => {
  const { toast } = useToast();
  const [pauseLimits, setPauseLimits] = useState<PauseLimitsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subscriptionId) {
      fetchPauseLimits();
    }
  }, [subscriptionId]);

  const fetchPauseLimits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('pause_limit_days, total_paused_days, pause_periods')
        .eq('id', subscriptionId)
        .single();

      if (error) throw error;

      // Parse pause_periods from Json to PausePeriod[]
      let pausePeriods: PausePeriod[] = [];
      if (data.pause_periods && Array.isArray(data.pause_periods)) {
        pausePeriods = (data.pause_periods as unknown) as PausePeriod[];
      }

      const pauseLimitsData: PauseLimitsData = {
        pause_limit_days: data.pause_limit_days || 30,
        total_paused_days: data.total_paused_days || 0,
        pause_periods: pausePeriods,
        canPause: (data.total_paused_days || 0) < (data.pause_limit_days || 30),
        remainingPauseDays: (data.pause_limit_days || 30) - (data.total_paused_days || 0)
      };

      setPauseLimits(pauseLimitsData);
    } catch (error) {
      console.error('Error fetching pause limits:', error);
      toast({
        title: "Failed to load pause information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPausePeriod = async (startDate: Date, endDate: Date) => {
    if (!pauseLimits) return false;

    const newPeriod: PausePeriod = {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };

    const updatedPeriods = [...pauseLimits.pause_periods, newPeriod];

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ pause_periods: updatedPeriods as any })
        .eq('id', subscriptionId);

      if (error) throw error;

      await fetchPauseLimits();
      return true;
    } catch (error) {
      console.error('Error adding pause period:', error);
      toast({
        title: "Failed to update pause period",
        variant: "destructive"
      });
      return false;
    }
  };

  const resumeSubscription = async () => {
    if (!pauseLimits) return false;

    // End the current pause period
    const updatedPeriods = pauseLimits.pause_periods.map(period => 
      period.end_date === null ? { ...period, end_date: new Date().toISOString().split('T')[0] } : period
    );

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'active',
          pause_periods: updatedPeriods as any,
          pause_start_date: null,
          pause_end_date: null
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      await fetchPauseLimits();
      return true;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast({
        title: "Failed to resume subscription",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    pauseLimits,
    loading,
    addPausePeriod,
    resumeSubscription,
    refetch: fetchPauseLimits
  };
};
