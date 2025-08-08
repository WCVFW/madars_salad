
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserSubscriptionManagement from "@/components/UserSubscriptionManagement";
import AddressManager from "@/components/AddressManager";
import PaymentHistory from "@/components/PaymentHistory";
import { User, CreditCard, Utensils, MapPin, Receipt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: ''
  });
  const isMobile = useIsMobile();

  const defaultTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setProfile(data);
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          phone_number: data.phone_number || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({ title: "Profile updated successfully!" });
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 px-4">My Account</h1>
          
          <Tabs defaultValue={defaultTab} className="space-y-4 sm:space-y-6">
            <TabsList className={`w-full ${
              isMobile 
                ? 'grid grid-cols-2 gap-1 h-auto p-1' 
                : 'grid grid-cols-5'
            }`}>
              <TabsTrigger 
                value="profile" 
                className={`flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 ${
                  isMobile ? 'flex-col min-h-[60px]' : 'flex-row'
                }`}
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className={isMobile ? 'text-[10px] leading-tight' : ''}>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className={`flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 ${
                  isMobile ? 'flex-col min-h-[60px]' : 'flex-row'
                }`}
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className={isMobile ? 'text-[10px] leading-tight' : ''}>Addresses</span>
              </TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="subscription" className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Methods
                  </TabsTrigger>
                </>
              )}
              {isMobile && (
                <>
                  <TabsTrigger 
                    value="subscription" 
                    className="flex items-center justify-center gap-1 flex-col min-h-[60px] text-xs p-2"
                  >
                    <Utensils className="h-3 w-3 flex-shrink-0" />
                    <span className="text-[10px] leading-tight">Subscription</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payments" 
                    className="flex items-center justify-center gap-1 flex-col min-h-[60px] text-xs p-2"
                  >
                    <Receipt className="h-3 w-3 flex-shrink-0" />
                    <span className="text-[10px] leading-tight">Payments</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {isMobile && (
              <div className="w-full">
                <TabsList className="grid grid-cols-1 w-full gap-1 h-auto p-1">
                  <TabsTrigger 
                    value="payment" 
                    className="flex items-center justify-center gap-2 text-sm p-3 min-h-[48px]"
                  >
                    <CreditCard className="h-4 w-4 flex-shrink-0" />
                    Payment Methods
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
              <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <Card className="w-full">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                    <CardDescription className="text-sm">
                      Update your personal information and contact details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-gray-100 text-sm sm:text-base h-12 sm:h-10 px-4"
                        />
                        <p className="text-xs sm:text-sm text-gray-500">Email cannot be changed</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm sm:text-base font-medium">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Enter your full name"
                          className="w-full text-sm sm:text-base h-12 sm:h-10 px-4"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone_number" className="text-sm sm:text-base font-medium">Phone Number</Label>
                        <Input
                          id="phone_number"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          placeholder="Enter your phone number"
                          className="w-full text-sm sm:text-base h-12 sm:h-10 px-4"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={updating}
                        className="w-full h-12 sm:h-10 text-sm sm:text-base font-medium"
                      >
                        {updating ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="mt-4 sm:mt-6">
                <div className="w-full overflow-hidden">
                  <AddressManager />
                </div>
              </TabsContent>

              <TabsContent value="subscription" className="mt-4 sm:mt-6">
                <div className="w-full overflow-hidden">
                  <UserSubscriptionManagement />
                </div>
              </TabsContent>

              <TabsContent value="payments" className="mt-4 sm:mt-6">
                <div className="w-full overflow-hidden">
                  <PaymentHistory />
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-4 sm:mt-6">
                <Card className="w-full">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Payment Methods</CardTitle>
                    <CardDescription className="text-sm">
                      Manage your payment methods and billing information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-gray-600 text-sm sm:text-base">Payment method management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
