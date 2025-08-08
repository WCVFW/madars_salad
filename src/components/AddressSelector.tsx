
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Home, Building2 } from "lucide-react";
import AddressManager from "./AddressManager";

interface Address {
  id: string;
  label: string;
  flat_house_number: string;
  street_address: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
  required?: boolean;
}

const AddressSelector = ({ onAddressSelect, selectedAddressId, required = true }: AddressSelectorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressManager, setShowAddressManager] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
      
      // Auto-select default address if none selected
      if (data && data.length > 0 && !selectedAddressId) {
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        onAddressSelect(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error loading addresses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconForLabel = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
      case 'office':
        return <Building2 className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (showAddressManager) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowAddressManager(false)}
          className="mb-4"
        >
          ← Back to Address Selection
        </Button>
        <AddressManager onAddressSelect={(address) => {
          setShowAddressManager(false);
          fetchAddresses(); // Refresh addresses
          onAddressSelect(address);
        }} />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-4">No delivery addresses found.</p>
            <p className="text-sm text-gray-500 mb-4">
              You need to add at least one delivery address before subscribing.
            </p>
            <Button onClick={() => setShowAddressManager(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Delivery Address
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Delivery Address {required && <span className="text-red-500">*</span>}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddressManager(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAddressId === address.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getIconForLabel(address.label)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{address.label}</h3>
                    {address.is_default && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{address.flat_house_number}, {address.street_address}</p>
                    {address.landmark && <p>Near: {address.landmark}</p>}
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                </div>
                <div className="mt-1">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAddressId === address.id
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-gray-300'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSelector;
