
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useResumeSubscription = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const resumeSubscription = async (subscriptionId: string, resumeDate?: string) => {
    setLoading(true);
    try {
      const updateData: any = {
        status: 'active',
        pause_start_date: null,
        pause_end_date: null,
        updated_at: new Date().toISOString()
      };

      if (resumeDate) {
        updateData.start_date = resumeDate;
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({ title: "Subscription resumed successfully!" });
      return true;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast({ title: "Failed to resume subscription", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    resumeSubscription,
    loading
  };
};
