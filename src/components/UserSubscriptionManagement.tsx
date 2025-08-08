
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Utensils, X } from "lucide-react";
import { format } from "date-fns";
import MealCancellation from "./MealCancellation";

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
  payment_method: string;
  payment_status: string;
  admin_approved: boolean;
  subscription_plans: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    meals_per_day: number;
    meals_per_week: number;
    plan_type: string;
    is_active: boolean;
  };
}

const UserSubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const dayOptions = [
    { value: 'M', label: 'Mon' },
    { value: 'T', label: 'Tue' },
    { value: 'W', label: 'Wed' },
    { value: 'R', label: 'Thu' },
    { value: 'F', label: 'Fri' },
    { value: 'S', label: 'Sat' },
    { value: 'U', label: 'Sun' }
  ];

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user?.id)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscription.id);

      if (error) throw error;

      toast({ title: "Subscription cancelled successfully!" });
      fetchUserSubscription();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({ title: "Failed to cancel subscription", variant: "destructive" });
    }
  };

  const handleSubscriptionUpdate = () => {
    fetchUserSubscription();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription. Browse our plans to get started!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/subscriptions">Browse Plans</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show pending approval message for COD orders
  if (subscription.payment_method === 'cod' && !subscription.admin_approved) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Pending Approval</CardTitle>
          <CardDescription>
            Your Cash on Delivery subscription is awaiting admin approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800">Payment Method: Cash on Delivery</h3>
              <p className="text-yellow-700 mt-1">
                Your subscription will be activated once our team approves your COD request. 
                This usually takes 1-2 business days.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-medium">{subscription.subscription_plans.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">₹{subscription.subscription_plans.price}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            {subscription.subscription_plans.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
              Status: {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{format(new Date(subscription.start_date), 'PPP')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Delivery PIN</p>
                <p className="font-medium">{subscription.delivery_pincode}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{subscription.meals_delivered}</p>
                <p className="text-sm text-gray-600">Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{subscription.meals_cancelled}</p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{subscription.carry_forward_meals}</p>
                <p className="text-sm text-gray-600">Carry Forward</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{subscription.cancellation_count}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Delivery Days:</p>
            <div className="flex gap-2">
              {subscription.delivery_days.map(day => (
                <span key={day} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                  {dayOptions.find(d => d.value === day)?.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meal Cancellation component - only show when active */}
      {subscription.status === 'active' && (
        <MealCancellation 
          subscriptionId={subscription.id}
          onCancellationUpdate={handleSubscriptionUpdate}
        />
      )}
    </div>
  );
};

export default UserSubscriptionManagement;
