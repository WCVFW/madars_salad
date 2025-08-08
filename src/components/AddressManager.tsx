
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Edit, Trash2, Home, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

interface AddressManagerProps {
  onAddressSelect?: (address: Address) => void;
  selectedAddressId?: string;
  showSelector?: boolean;
  title?: string;
}

const AddressManager = ({ 
  onAddressSelect, 
  selectedAddressId, 
  showSelector = false,
  title = "Delivery Addresses"
}: AddressManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    flat_house_number: '',
    street_address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    const requiredFields = ['label', 'flat_house_number', 'street_address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]?.trim());

    if (missingFields.length > 0) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('delivery_addresses')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAddress.id);

        if (error) throw error;
        toast({ title: "Address updated successfully!" });
      } else {
        // Create new address
        const { error } = await supabase
          .from('delivery_addresses')
          .insert({
            user_id: user.id,
            ...formData,
            is_default: addresses.length === 0 // First address is default
          });

        if (error) throw error;
        toast({ title: "Address added successfully!" });
      }

      setIsDialogOpen(false);
      setEditingAddress(null);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      flat_house_number: address.flat_house_number,
      street_address: address.street_address,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      toast({ title: "Address deleted successfully!" });
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      flat_house_number: '',
      street_address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    });
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {title}
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm();
                setEditingAddress(null);
              }} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Address Label *</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="e.g., Home, Work, Office"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      pattern="\d{6}"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flat_house_number">House/Flat Number *</Label>
                  <Input
                    id="flat_house_number"
                    value={formData.flat_house_number}
                    onChange={(e) => setFormData({ ...formData, flat_house_number: e.target.value })}
                    placeholder="Enter house/flat number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street_address">Street Address *</Label>
                  <Textarea
                    id="street_address"
                    value={formData.street_address}
                    onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                    placeholder="Enter street address"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="Enter nearby landmark"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No addresses found. Add your first delivery address to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg ${
                  showSelector && selectedAddressId === address.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showSelector ? 'cursor-pointer' : ''}`}
                onClick={() => showSelector && onAddressSelect && onAddressSelect(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getIconForLabel(address.label)}
                      <h3 className="font-medium text-lg">{address.label}</h3>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600 space-y-1">
                      <p>{address.flat_house_number}, {address.street_address}</p>
                      {address.landmark && <p>Near: {address.landmark}</p>}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                    </div>
                  </div>
                  {!showSelector && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressManager;
