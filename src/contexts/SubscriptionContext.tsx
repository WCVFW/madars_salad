
import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface SubscriptionFormData {
  selectedPlan: SubscriptionPlan | null;
  startDate: string;
  pincode: string;
  deliveryDays: string[];
  mealPreference: 'veg' | 'non-veg' | 'both';
  paymentMethod: 'upi' | 'card' | 'cod';
}

interface SubscriptionContextType {
  formData: SubscriptionFormData;
  updateFormData: (data: Partial<SubscriptionFormData>) => void;
  clearFormData: () => void;
  isFormValid: boolean;
  completedSteps: number;
}

const defaultFormData: SubscriptionFormData = {
  selectedPlan: null,
  startDate: '',
  pincode: '',
  deliveryDays: [],
  mealPreference: 'veg',
  paymentMethod: 'upi'
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<SubscriptionFormData>(defaultFormData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('subscriptionFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData({ ...defaultFormData, ...parsedData });
      } catch (error) {
        console.error('Error parsing saved subscription data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('subscriptionFormData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (data: Partial<SubscriptionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData(defaultFormData);
    localStorage.removeItem('subscriptionFormData');
  };

  const isFormValid = !!(
    formData.selectedPlan &&
    formData.startDate &&
    formData.deliveryDays.length === formData.selectedPlan.meals_per_week &&
    formData.pincode.length === 6
  );

  const completedSteps = [
    !!formData.selectedPlan,
    !!formData.startDate,
    formData.deliveryDays.length > 0,
    !!formData.pincode
  ].filter(Boolean).length;

  return (
    <SubscriptionContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        clearFormData, 
        isFormValid, 
        completedSteps 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
