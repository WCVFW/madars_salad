
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionProgress from "@/components/SubscriptionProgress";
import PlanSelector from "@/components/PlanSelector";
import SubscriptionForm from "@/components/SubscriptionForm";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { processPayment, createRazorpayOrder } from "@/services/razorpayService";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

const Subscriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { formData, updateFormData, clearFormData, completedSteps } = useSubscriptionContext();
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const subscriptionSteps = [
    'Select Plan', 
    'Choose Preferences', 
    'Set Delivery', 
    'Review & Pay'
  ];

  useEffect(() => {
    fetchSubscriptionPlans();
    
    // Handle plan data from navigation (including customizations from plan browsing)
    if (location.state?.selectedPlan) {
      const updates: any = { selectedPlan: location.state.selectedPlan };
      
      // Apply customizations from plan browsing if available
      if (location.state.customizations) {
        const customizations = location.state.customizations;
        if (customizations.mealPreference) {
          updates.mealPreference = customizations.mealPreference;
        }
        if (customizations.deliveryDays && customizations.deliveryDays.length > 0) {
          updates.deliveryDays = customizations.deliveryDays;
        }
        if (customizations.startDate) {
          updates.startDate = customizations.startDate;
        }
      }
      
      updateFormData(updates);
    }
  }, [location.state]);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast({
        title: "Error loading subscription plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    updateFormData({ selectedPlan: plan });
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    updateFormData({ pincode: address.pincode });
  };

  const handleSubscribe = async () => {
    if (!user || !formData.selectedPlan || !selectedAddress) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    const requiredDeliveryDays = formData.selectedPlan.meals_per_week;
    if (formData.deliveryDays.length !== requiredDeliveryDays) {
      toast({
        title: "Delivery days mismatch",
        description: `Please select exactly ${requiredDeliveryDays} delivery days`,
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const subscriptionData = {
        user_id: user.id,
        plan_id: formData.selectedPlan.id,
        address_id: selectedAddress.id,
        start_date: formData.startDate,
        delivery_pincode: formData.pincode,
        meals_per_day: formData.selectedPlan.meals_per_day,
        meals_per_week: formData.selectedPlan.meals_per_week,
        delivery_days: formData.deliveryDays,
        meal_preference: formData.mealPreference,
        payment_method: formData.paymentMethod,
        payment_status: formData.paymentMethod === 'cod' ? 'pending' : 'pending',
        admin_approved: formData.paymentMethod === 'cod' ? false : false
      };

      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (subscriptionError) throw subscriptionError;

      if (formData.paymentMethod === 'cod') {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            subscription_id: subscription.id,
            order_amount: formData.selectedPlan.price,
            payment_method: 'cod',
            payment_status: 'pending',
            billing_address: selectedAddress
          });

        if (orderError) throw orderError;

        toast({
          title: "Subscription created!",
          description: "Your COD subscription is awaiting admin approval."
        });
      } else {
        // Process online payment
        try {
          const { orderId } = await createRazorpayOrder(formData.selectedPlan.price, subscription.id);
          
          const paymentResult = await processPayment({
            amount: formData.selectedPlan.price,
            orderId,
            userEmail: user.email || '',
            userName: user.user_metadata?.full_name || user.email || '',
            userPhone: user.user_metadata?.phone || '',
            description: `Subscription: ${formData.selectedPlan.name}`,
            subscriptionId: subscription.id,
            billingAddress: selectedAddress
          });

          if (paymentResult.success) {
            toast({
              title: "Subscription activated!",
              description: "Your payment was successful and subscription is now active."
            });
          } else {
            throw new Error(paymentResult.error || 'Payment failed');
          }
        } catch (paymentError) {
          console.error('Payment error:', paymentError);
          toast({
            title: "Payment failed",
            description: "Your subscription was created but payment failed. Please try again from your profile.",
            variant: "destructive"
          });
        }
      }

      clearFormData();
      navigate('/profile?tab=subscriptions');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error creating your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const showPlanSelection = !formData.selectedPlan;
  const showSubscriptionForm = formData.selectedPlan;
  const hasCustomizations = !!location.state?.customizations;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className={`container mx-auto px-4 py-6 max-w-7xl ${
        isMobile ? 'pb-8' : 'py-8 lg:py-12'
      }`}>
        <div className={`text-center mb-6 ${!isMobile ? 'sm:mb-8 lg:mb-12' : ''}`}>
          <h1 className={`font-bold text-gray-900 mb-3 px-2 ${
            isMobile ? 'text-xl' : 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl'
          }`}>
            {showPlanSelection ? 'Choose Your Meal Plan' : 'Complete Your Subscription'}
          </h1>
          <p className={`text-gray-600 max-w-2xl mx-auto px-2 ${
            isMobile ? 'text-sm' : 'text-sm sm:text-base lg:text-lg xl:text-xl'
          }`}>
            {showPlanSelection 
              ? 'Select from our variety of healthy, delicious meal subscription plans'
              : 'Just a few more steps to start your meal journey'}
          </p>
        </div>

        {showSubscriptionForm && (
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <SubscriptionProgress 
              currentStep={completedSteps}
              totalSteps={4}
              steps={subscriptionSteps}
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-20 lg:py-32">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-32 lg:w-32 border-b-2 border-orange-500"></div>
          </div>
        ) : showSubscriptionForm ? (
          <div className={`w-full ${!isMobile ? 'max-w-4xl mx-auto' : ''}`}>
            <div className="mb-4 sm:mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  updateFormData({ selectedPlan: null });
                  setSelectedAddress(null);
                }}
                className="flex items-center gap-2 text-sm w-full sm:w-auto touch-manipulation h-12"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Plans
              </Button>
            </div>

            <div className="w-full">
              <Card className="w-full">
                <CardHeader className={`pb-4 px-4 ${!isMobile ? 'sm:pb-6 sm:px-6' : ''}`}>
                  <CardTitle className={`${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl'}`}>
                    Subscribe to {formData.selectedPlan.name}
                  </CardTitle>
                  <CardDescription className={`${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>
                    Complete your subscription by providing the details below
                  </CardDescription>
                </CardHeader>
                <CardContent className={`px-4 ${!isMobile ? 'sm:px-6' : ''}`}>
                  <SubscriptionForm
                    selectedPlan={formData.selectedPlan}
                    selectedAddress={selectedAddress}
                    onAddressSelect={handleAddressSelect}
                    onSubmit={handleSubscribe}
                    submitting={submitting}
                    hasCustomizations={hasCustomizations}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <PlanSelector plans={plans} onPlanSelect={handlePlanSelect} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;
