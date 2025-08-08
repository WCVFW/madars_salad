
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Utensils } from "lucide-react";

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

interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  onPlanSelect: (plan: SubscriptionPlan) => void;
}

const PlanSelector = ({ plans, onPlanSelect }: PlanSelectorProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer w-full"
              onClick={() => onPlanSelect(plan)}>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl line-clamp-2">{plan.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm lg:text-base line-clamp-3">{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
              ₹{plan.price}
              <span className="text-xs sm:text-sm font-normal text-gray-500 block sm:inline">
                <span className="hidden sm:inline">/</span>{plan.plan_type}
              </span>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-2">
                <Utensils className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{plan.meals_per_day} meal(s) per day</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{plan.meals_per_week} days per week</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm capitalize">{plan.plan_type}</span>
              </div>
            </div>
            
            <Button 
              className="w-full text-xs sm:text-sm lg:text-base py-2 sm:py-2.5 lg:py-3 mt-3 sm:mt-4" 
              onClick={(e) => {
                e.stopPropagation();
                onPlanSelect(plan);
              }}
            >
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlanSelector;
