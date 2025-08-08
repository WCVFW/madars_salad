
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AddressSelector from "@/components/AddressSelector";
import OrderSummary from "@/components/OrderSummary";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
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

interface SubscriptionFormProps {
  selectedPlan: SubscriptionPlan;
  selectedAddress: any;
  onAddressSelect: (address: any) => void;
  onSubmit: () => void;
  submitting: boolean;
  hasCustomizations?: boolean;
}

const SubscriptionForm = ({ 
  selectedPlan, 
  selectedAddress, 
  onAddressSelect, 
  onSubmit, 
  submitting,
  hasCustomizations = false
}: SubscriptionFormProps) => {
  const { formData, updateFormData } = useSubscriptionContext();
  const isMobile = useIsMobile();

  const dayOptions = [
    { value: 'M', label: 'Mon' },
    { value: 'T', label: 'Tue' },
    { value: 'W', label: 'Wed' },
    { value: 'R', label: 'Thu' },
    { value: 'F', label: 'Fri' },
    { value: 'S', label: 'Sat' },
    { value: 'U', label: 'Sun' }
  ];

  return (
    <div className="w-full overflow-y-auto max-h-screen pb-6">
      <div className="space-y-6 px-1">
        {hasCustomizations && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">
              Your plan customizations have been applied
            </p>
          </div>
        )}

        {/* Address Selection */}
        <div className="w-full space-y-3">
          <Label className="text-base font-medium block">Delivery Address *</Label>
          <AddressSelector 
            onAddressSelect={onAddressSelect}
            selectedAddressId={selectedAddress?.id}
            required={true}
          />
        </div>

        {/* Form Fields - Stack vertically on mobile */}
        <div className={`w-full space-y-6 ${!isMobile ? 'sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0' : ''}`}>
          <div className="space-y-3 w-full">
            <Label htmlFor="startDate" className="text-base font-medium block">Start Date *</Label>
            <Input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full text-base h-12 touch-manipulation"
            />
          </div>

          <div className="space-y-3 w-full">
            <Label htmlFor="mealPreference" className="text-base font-medium block">Meal Preference *</Label>
            <select
              id="mealPreference"
              value={formData.mealPreference}
              onChange={(e) => updateFormData({ mealPreference: e.target.value as 'veg' | 'non-veg' | 'both' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base h-12 bg-white touch-manipulation"
              required
            >
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        {/* Delivery Days - Mobile optimized */}
        <div className="space-y-4 w-full">
          <Label className="text-base font-medium block">
            Delivery Days * (Select {selectedPlan.meals_per_week} days)
          </Label>
          <ToggleGroup 
            type="multiple" 
            value={formData.deliveryDays}
            onValueChange={(value) => {
              if (value.length <= selectedPlan.meals_per_week) {
                updateFormData({ deliveryDays: value });
              }
            }}
            className={`grid gap-2 w-full ${
              isMobile ? 'grid-cols-4' : 'grid-cols-7'
            }`}
          >
            {dayOptions.map(day => (
              <ToggleGroupItem 
                key={day.value} 
                value={day.value}
                className={`data-[state=on]:bg-orange-500 data-[state=on]:text-white text-sm p-3 h-12 touch-manipulation flex items-center justify-center font-medium ${
                  isMobile ? 'min-h-[48px]' : 'min-h-[48px]'
                }`}
              >
                <span className={isMobile ? 'block' : 'hidden sm:block'}>{day.label}</span>
                <span className={isMobile ? 'hidden' : 'block sm:hidden'}>{day.label.slice(0, 1)}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-sm text-gray-500">
            Selected: {formData.deliveryDays.length}/{selectedPlan.meals_per_week} days
          </p>
        </div>

        {/* Payment Method - Mobile optimized */}
        <div className="space-y-4 w-full">
          <Label className="text-base font-medium block">Payment Method *</Label>
          <div className="space-y-3">
            {(['upi', 'card', 'cod'] as const).map(method => (
              <label key={method} className="flex items-start space-x-4 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 touch-manipulation">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={(e) => updateFormData({ paymentMethod: e.target.value as 'upi' | 'card' | 'cod' })}
                  className="text-orange-600 focus:ring-orange-500 mt-1 flex-shrink-0 w-4 h-4"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-base font-medium block">
                    {method === 'upi' ? 'UPI / Online Payment' : 
                     method === 'card' ? 'Credit/Debit Card' : 
                     'Cash on Delivery'}
                  </span>
                  {method === 'cod' && (
                    <span className="text-sm text-gray-500 block mt-1">
                      (Admin approval required)
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full">
          <OrderSummary selectedPlan={selectedPlan} selectedAddress={selectedAddress} />
        </div>

        {/* Submit Button - Mobile optimized */}
        <div className="w-full pt-4">
          <Button 
            onClick={onSubmit} 
            className="w-full text-base py-4 h-auto font-medium touch-manipulation"
            disabled={submitting || !selectedAddress || formData.deliveryDays.length !== selectedPlan.meals_per_week}
          >
            {submitting ? "Processing..." : formData.paymentMethod === 'cod' ? "Subscribe with COD" : "Proceed to Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
