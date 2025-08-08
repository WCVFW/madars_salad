
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Calendar, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Plans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for plan customization
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [customizations, setCustomizations] = useState({
    mealPreference: 'veg' as 'veg' | 'non-veg' | 'both',
    deliveryDays: [] as string[],
    startDate: ''
  });

  const plans = [
    {
      name: "Essential",
      price: 1500,
      originalPrice: 1800,
      popular: false,
      description: "Perfect for individuals or couples",
      features: [
        "1 meal per day",
        "5 days per week",
        "Fresh seasonal ingredients",
        "Basic meal customization",
        "Weekly delivery",
        "Skip or pause anytime"
      ],
      servings: "1-2 people",
      planType: "weekly",
      meals_per_day: 1,
      meals_per_week: 5
    },
    {
      name: "Family",
      price: 3500,
      originalPrice: 4200,
      popular: true,
      description: "Great for families of 3-4",
      features: [
        "2 meals per day",
        "7 days per week",
        "Premium ingredients",
        "Advanced meal customization",
        "Daily delivery",
        "Skip or pause anytime",
        "Priority customer support",
        "Nutrition tracking"
      ],
      servings: "3-4 people",
      planType: "weekly",
      meals_per_day: 2,
      meals_per_week: 7
    },
    {
      name: "Premium",
      price: 12000,
      originalPrice: 15000,
      popular: false,
      description: "Premium selection for larger families",
      features: [
        "3 meals per day",
        "30 days per month",
        "Gourmet ingredients",
        "Full meal customization",
        "Daily delivery",
        "Skip or pause anytime",
        "Priority customer support",
        "Nutrition tracking",
        "Exclusive recipes",
        "Personal meal consultant"
      ],
      servings: "5-6 people",
      planType: "monthly",
      meals_per_day: 3,
      meals_per_week: 7
    }
  ];

  const dayOptions = [
    { value: 'M', label: 'Mon' },
    { value: 'T', label: 'Tue' },
    { value: 'W', label: 'Wed' },
    { value: 'R', label: 'Thu' },
    { value: 'F', label: 'Fri' },
    { value: 'S', label: 'Sat' },
    { value: 'U', label: 'Sun' }
  ];

  const handlePlanCustomize = (planIndex: number) => {
    setSelectedPlanIndex(planIndex);
    setCustomizations({
      mealPreference: 'veg',
      deliveryDays: [],
      startDate: ''
    });
  };

  const handleSubscribeClick = (planIndex: number) => {
    const plan = plans[planIndex];
    
    if (!user) {
      // Store plan and customization data in localStorage for after login
      const subscriptionData = {
        selectedPlan: {
          id: `plan-${plan.name.toLowerCase()}`,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          meals_per_day: plan.meals_per_day,
          meals_per_week: plan.meals_per_week,
          plan_type: plan.planType,
          is_active: true
        },
        customizations: selectedPlanIndex === planIndex ? customizations : null
      };
      
      localStorage.setItem('pendingSubscription', JSON.stringify(subscriptionData));
      navigate('/auth');
      return;
    }

    // Navigate to subscriptions with plan data
    navigate('/subscriptions', { 
      state: { 
        selectedPlan: {
          id: `plan-${plan.name.toLowerCase()}`,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          meals_per_day: plan.meals_per_day,
          meals_per_week: plan.meals_per_week,
          plan_type: plan.planType,
          is_active: true
        },
        customizations: selectedPlanIndex === planIndex ? customizations : null
      }
    });
  };

  return (
    <section id="plans" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Choose Your Perfect Plan
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            All plans include fresh ingredients, flexible scheduling, and the ability 
            to pause or cancel anytime. No long-term commitments required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-green-500 shadow-lg md:scale-105' 
                  : 'border-border hover:border-green-300'
              } ${selectedPlanIndex === index ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center space-y-3 sm:space-y-4 pb-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2">{plan.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">₹{plan.price}</span>
                    <div className="text-left">
                      <p className="text-muted-foreground line-through text-sm sm:text-base lg:text-lg">₹{plan.originalPrice}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">per {plan.planType}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    Save ₹{plan.originalPrice - plan.price}/{plan.planType}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Serves {plan.servings}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2 sm:space-x-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Plan Customization Section */}
                {selectedPlanIndex === index && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border">
                    <h4 className="font-medium text-sm sm:text-base text-green-800">Customize Your Plan</h4>
                    
                    {/* Meal Preference */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Meal Preference</Label>
                      <Select
                        value={customizations.mealPreference}
                        onValueChange={(value: 'veg' | 'non-veg' | 'both') => 
                          setCustomizations(prev => ({ ...prev, mealPreference: value }))
                        }
                      >
                        <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Delivery Days */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">
                        Delivery Days (Select {plan.meals_per_week})
                      </Label>
                      <ToggleGroup 
                        type="multiple" 
                        value={customizations.deliveryDays}
                        onValueChange={(value) => {
                          if (value.length <= plan.meals_per_week) {
                            setCustomizations(prev => ({ ...prev, deliveryDays: value }));
                          }
                        }}
                        className="grid grid-cols-7 gap-1"
                      >
                        {dayOptions.map(day => (
                          <ToggleGroupItem 
                            key={day.value} 
                            value={day.value}
                            className="data-[state=on]:bg-green-500 data-[state=on]:text-white text-xs p-1 sm:p-2 h-8 sm:h-10"
                            size="sm"
                          >
                            {day.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <p className="text-xs text-green-600">
                        Selected: {customizations.deliveryDays.length}/{plan.meals_per_week}
                      </p>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Preferred Start Date</Label>
                      <Input
                        type="date"
                        value={customizations.startDate}
                        onChange={(e) => setCustomizations(prev => ({ ...prev, startDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="h-8 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    onClick={() => handleSubscribeClick(index)}
                    className={`w-full py-2 sm:py-3 text-sm sm:text-base ${
                      plan.popular 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-white border border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                    size="lg"
                  >
                    {user ? (plan.popular ? 'Start Subscription' : 'Choose Plan') : 'Login to Subscribe'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12 px-4">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            All plans come with a 7-day trial period and money-back guarantee
          </p>
          <Button 
            onClick={() => user ? navigate('/subscriptions') : navigate('/auth')} 
            variant="link" 
            className="text-green-600 hover:text-green-700 text-sm sm:text-base"
          >
            {user ? 'View detailed comparison →' : 'Login to view subscriptions →'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Plans;
