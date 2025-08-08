
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

interface OrderSummaryProps {
  selectedPlan: SubscriptionPlan;
  selectedAddress: any;
}

const OrderSummary = ({ selectedPlan, selectedAddress }: OrderSummaryProps) => {
  return (
    <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-lg w-full">
      <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">Order Summary</h3>
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base">
        <div className="flex justify-between items-start gap-2">
          <span className="font-medium">Plan:</span>
          <span className="text-right font-semibold">{selectedPlan.name}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span>Meals per day:</span>
          <span className="font-medium">{selectedPlan.meals_per_day}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span>Delivery days per week:</span>
          <span className="font-medium">{selectedPlan.meals_per_week}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="flex-shrink-0">Delivery Address:</span>
          <span className="text-right font-medium break-words min-w-0">
            {selectedAddress ? `${selectedAddress.label} (${selectedAddress.pincode})` : 'Not selected'}
          </span>
        </div>
        <div className="flex justify-between items-center font-semibold pt-2 sm:pt-3 border-t border-gray-200 text-sm sm:text-base lg:text-lg gap-2">
          <span>Total Amount:</span>
          <span className="text-orange-600">₹{selectedPlan.price}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
