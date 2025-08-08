
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  meals_per_day: number;
  meals_per_week: number;
  plan_type: string;
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  delivery_pincode: string;
  meals_per_day: number;
  meals_per_week: number;
  delivery_days: string[];
  meal_preference: string;
  meals_delivered: number;
  meals_cancelled: number;
  carry_forward_meals: number;
  cancellation_count: number;
  subscription_plans: SubscriptionPlan;
}

interface MealDelivery {
  id: string;
  subscription_id: string;
  delivery_date: string;
  status: string;
  meals_count: number;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

interface Holiday {
  id: string;
  date: string;
  name: string;
  description: string | null;
  location: string | null;
}

interface SubscriptionSettings {
  id: string;
  cancellation_cutoff_hours: number;
  max_cancellations_per_month: number;
  carry_forward_limit: number;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [mealDeliveries, setMealDeliveries] = useState<MealDelivery[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      await Promise.all([
        fetchUserSubscription(),
        fetchMealDeliveries(),
        fetchHolidays(),
        fetchSettings()
      ]);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    setSubscription(data);
  };

  const fetchMealDeliveries = async () => {
    if (!user || !subscription) return;

    const { data, error } = await supabase
      .from('meal_deliveries')
      .select('*')
      .eq('subscription_id', subscription.id)
      .order('delivery_date', { ascending: true });

    if (error) throw error;
    setMealDeliveries(data || []);
  };

  const fetchHolidays = async () => {
    const { data, error } = await supabase
      .from('holidays')
      .select('*')
      .eq('is_active', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    setHolidays(data || []);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('subscription_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    setSettings(data);
  };

  const cancelMeal = async (deliveryId: string, reason?: string) => {
    if (!settings) return false;

    const delivery = mealDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return false;

    // Check cutoff time
    const deliveryDate = new Date(delivery.delivery_date);
    const cutoffTime = new Date(deliveryDate.getTime() - (settings.cancellation_cutoff_hours * 60 * 60 * 1000));
    
    if (new Date() > cutoffTime) {
      toast({ 
        title: `Cannot cancel meal within ${settings.cancellation_cutoff_hours} hours of delivery`, 
        variant: "destructive" 
      });
      return false;
    }

    // Check monthly cancellation limit
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlycancellations = mealDeliveries.filter(d => {
      const date = new Date(d.cancelled_at || '');
      return d.status === 'cancelled' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    }).length;

    if (monthlycancellations >= settings.max_cancellations_per_month) {
      toast({ 
        title: `Monthly cancellation limit of ${settings.max_cancellations_per_month} reached`, 
        variant: "destructive" 
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('meal_deliveries')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason
        })
        .eq('id', deliveryId);

      if (error) throw error;

      // Update subscription carry forward meals
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .update({
          carry_forward_meals: (subscription?.carry_forward_meals || 0) + delivery.meals_count,
          meals_cancelled: (subscription?.meals_cancelled || 0) + delivery.meals_count,
          cancellation_count: (subscription?.cancellation_count || 0) + 1
        })
        .eq('id', subscription?.id);

      if (subscriptionError) throw subscriptionError;

      toast({ title: "Meal cancelled successfully" });
      fetchSubscriptionData();
      return true;
    } catch (error) {
      console.error('Error cancelling meal:', error);
      toast({ title: "Failed to cancel meal", variant: "destructive" });
      return false;
    }
  };

  const updateSubscriptionStatus = async (status: 'active' | 'paused' | 'cancelled') => {
    if (!subscription) return false;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status })
        .eq('id', subscription.id);

      if (error) throw error;

      toast({ title: `Subscription ${status} successfully` });
      fetchSubscriptionData();
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({ title: "Failed to update subscription", variant: "destructive" });
      return false;
    }
  };

  return {
    subscription,
    mealDeliveries,
    holidays,
    settings,
    loading,
    cancelMeal,
    updateSubscriptionStatus,
    refreshData: fetchSubscriptionData
  };
};
