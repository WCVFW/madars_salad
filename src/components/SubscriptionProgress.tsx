
import { Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubscriptionProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const SubscriptionProgress = ({ currentStep, totalSteps, steps }: SubscriptionProgressProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Subscription Setup</h3>
          <span className="text-sm text-gray-500">{currentStep}/{totalSteps}</span>
        </div>
        
        {/* Mobile: Current step display */}
        <div className="mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white">
              <span className="text-sm font-medium">{currentStep}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {steps[currentStep - 1] || 'Complete'}
            </span>
          </div>
        </div>

        {/* Mobile: Progress bar */}
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Mobile: Steps list (collapsible) */}
        <div className="mt-3 space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep - 1
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className={`${
                index < currentStep ? 'text-green-600 font-medium' : 
                index === currentStep - 1 ? 'text-orange-600 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout (existing)
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Setup</h3>
        <span className="text-sm text-gray-500">{currentStep}/{totalSteps} completed</span>
      </div>
      
      <div className="flex items-center space-x-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center min-w-0">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span className={`ml-2 text-sm whitespace-nowrap ${
              index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`flex-shrink-0 w-8 h-0.5 mx-4 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SubscriptionProgress;
