
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryAddress {
  flat_house_number: string;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
}

export const useAddressValidation = () => {
  const { user } = useAuth();
  const [isAddressComplete, setIsAddressComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAddressCompletion();
    } else {
      setLoading(false);
      setIsAddressComplete(null);
    }
  }, [user]);

  const checkAddressCompletion = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('flat_house_number, street_address, city, state, pincode')
        .eq('user_id', user.id);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching addresses:', error);
        setIsAddressComplete(false);
        return;
      }

      // If no addresses exist, mark as incomplete
      if (!data || data.length === 0) {
        setIsAddressComplete(false);
        return;
      }

      // Check if at least one address is complete
      const hasCompleteAddress = data.some(address => 
        Boolean(
          address.flat_house_number?.trim() &&
          address.street_address?.trim() &&
          address.city?.trim() &&
          address.state?.trim() &&
          address.pincode?.trim()
        )
      );

      setIsAddressComplete(hasCompleteAddress);
    } catch (error) {
      console.error('Error checking address completion:', error);
      setIsAddressComplete(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAddressComplete, loading, checkAddressCompletion };
};
