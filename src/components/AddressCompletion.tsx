
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, AlertCircle, Edit } from "lucide-react";

interface AddressCompletionProps {
  onAddressComplete?: () => void;
  showEditButton?: boolean;
  title?: string;
  description?: string;
}

const AddressCompletion = ({ 
  onAddressComplete, 
  showEditButton = false,
  title = "Complete Your Delivery Address",
  description = "Please complete your delivery address before subscribing to any meal plans."
}: AddressCompletionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!showEditButton);
  const [hasExistingAddress, setHasExistingAddress] = useState(false);
  const [formData, setFormData] = useState({
    flat_house_number: '',
    street_address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (user) {
      fetchExistingAddress();
    }
  }, [user]);

  const fetchExistingAddress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching address:', error);
        return;
      }

      if (data) {
        setHasExistingAddress(true);
        setFormData({
          flat_house_number: data.flat_house_number || '',
          street_address: data.street_address || '',
          landmark: data.landmark || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || ''
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    const requiredFields = ['flat_house_number', 'street_address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]?.trim());

    if (missingFields.length > 0) {
      toast({
        title: "Please fill all required fields",
        description: "House/Flat Number, Street Address, City, State, and Pincode are required.",
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

    setLoading(true);
    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .upsert({
          user_id: user.id,
          ...formData,
          is_default: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({ title: "Address saved successfully!" });
      setHasExistingAddress(true);
      setIsEditing(false);
      
      if (onAddressComplete) {
        onAddressComplete();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Failed to save address",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchExistingAddress(); // Reset form data
  };

  // Show existing address in read-only mode if editing is disabled
  if (!isEditing && hasExistingAddress && showEditButton) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <CardTitle>Delivery Address</CardTitle>
            </div>
            <Button variant="outline" onClick={handleEditClick} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">House/Flat Number</p>
              <p className="text-gray-900">{formData.flat_house_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Street Address</p>
              <p className="text-gray-900">{formData.street_address}</p>
            </div>
            {formData.landmark && (
              <div>
                <p className="text-sm font-medium text-gray-600">Landmark</p>
                <p className="text-gray-900">{formData.landmark}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">City</p>
                <p className="text-gray-900">{formData.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">State</p>
                <p className="text-gray-900">{formData.state}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pincode</p>
              <p className="text-gray-900">{formData.pincode}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>{title}</CardTitle>
          </div>
          {isEditing && showEditButton && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Button type="submit" className="w-full" disabled={loading}>
            <MapPin className="h-4 w-4 mr-2" />
            {loading ? "Saving Address..." : hasExistingAddress ? "Update Address" : "Save Address & Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressCompletion;
