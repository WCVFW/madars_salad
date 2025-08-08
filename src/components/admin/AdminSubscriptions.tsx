import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  delivery_pincode: string;
  meal_preference: string;
  payment_status: string | null;
  meals_delivered: number | null;
  meals_cancelled: number | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    phone_number: string | null;
  } | null;
  subscription_plans: {
    name: string;
    price: number;
    meals_per_week: number;
  } | null;
}

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [cancelStartDate, setCancelStartDate] = useState<Date>();
  const [cancelEndDate, setCancelEndDate] = useState<Date>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      if (subscriptionsData && subscriptionsData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(subscriptionsData.map(sub => sub.user_id))];
        
        // Get unique plan IDs
        const planIds = [...new Set(subscriptionsData.map(sub => sub.plan_id))];

        // Fetch profiles
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, phone_number')
          .in('id', userIds);

        const { data: plansData } = await supabase
          .from('subscription_plans')
          .select('id, name, price, meals_per_week')
          .in('id', planIds);

        const combinedData = subscriptionsData.map(subscription => ({
          ...subscription,
          profiles: profilesData?.find(profile => profile.id === subscription.user_id) || null,
          subscription_plans: plansData?.find(plan => plan.id === subscription.plan_id) || null
        }));

        setSubscriptions(combinedData as unknown as Subscription[]);
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error loading subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async () => {
    if (!editingSubscription || !editFormData) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: editFormData.status,
          meals_delivered: editFormData.meals_delivered,
          meals_cancelled: editFormData.meals_cancelled
        })
        .eq('id', editingSubscription.id);

      if (error) throw error;

      toast({ title: "Subscription updated successfully!" });
      fetchSubscriptions();
      setIsSheetOpen(false);
      setEditingSubscription(null);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error updating subscription",
        variant: "destructive"
      });
    }
  };

  const cancelMeals = async () => {
    if (!editingSubscription || !cancelStartDate || !cancelEndDate) return;

    try {
      // Create meal delivery cancellations
      const startDate = new Date(cancelStartDate);
      const endDate = new Date(cancelEndDate);
      const deliveries = [];

      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        deliveries.push({
          subscription_id: editingSubscription.id,
          delivery_date: format(new Date(date), 'yyyy-MM-dd'),
          status: 'cancelled',
          cancellation_reason: 'Admin cancelled',
          cancelled_at: new Date().toISOString()
        });
      }

      const { error } = await supabase
        .from('meal_deliveries')
        .insert(deliveries);

      if (error) throw error;

      // Update meals cancelled count
      const newCancelledCount = (editingSubscription.meals_cancelled || 0) + deliveries.length;
      await supabase
        .from('user_subscriptions')
        .update({ meals_cancelled: newCancelledCount })
        .eq('id', editingSubscription.id);

      toast({ title: "Meals cancelled successfully!" });
      fetchSubscriptions();
      setCancelStartDate(undefined);
      setCancelEndDate(undefined);
    } catch (error) {
      console.error('Error cancelling meals:', error);
      toast({
        title: "Error cancelling meals",
        variant: "destructive"
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.profiles?.phone_number?.includes(searchTerm) ||
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openEditSheet = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setEditFormData({
      status: subscription.status,
      meals_delivered: subscription.meals_delivered || 0,
      meals_cancelled: subscription.meals_cancelled || 0
    });
    setIsSheetOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Subscription Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage all user subscriptions, status, and meal records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter Section */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, phone number or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Plan</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">End Date</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {subscription.profiles?.full_name || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {subscription.profiles?.phone_number || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {subscription.subscription_plans?.name || 'Unknown Plan'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(subscription.status)}
                        className="capitalize"
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(subscription.start_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {subscription.end_date 
                        ? format(new Date(subscription.end_date), 'MMM dd, yyyy')
                        : 'Ongoing'
                      }
                    </TableCell>
                    <TableCell>
                      <Sheet open={isSheetOpen && editingSubscription?.id === subscription.id} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditSheet(subscription)}
                            className="font-medium"
                          >
                            Edit
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[700px]">
                          <SheetHeader>
                            <SheetTitle className="text-xl">Manage Subscription</SheetTitle>
                            <SheetDescription>
                              View and edit subscription details for {editingSubscription?.profiles?.full_name}
                            </SheetDescription>
                          </SheetHeader>
                          
                          {editingSubscription && editFormData && (
                            <div className="mt-6 space-y-6">
                              {/* View Fields */}
                                <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-green-700">Meal Records</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="meals_taken" className="text-sm font-medium">
                                      Number of Meals Taken
                                    </Label>
                                    <Input
                                      id="meals_taken"
                                      value={editFormData.meals_delivered}
                                      readOnly
                                      className="bg-muted h-10"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="meals_cancelled" className="text-sm font-medium">
                                      Number of Meals Cancelled
                                    </Label>
                                    <Input
                                      id="meals_cancelled"
                                      value={editFormData.meals_cancelled}
                                      readOnly
                                      className="bg-muted h-10"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Edit Dropdown */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-green-700">Subscription Status</h3>
                                <div className="space-y-2">
                                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                                  <Select 
                                    value={editFormData.status}
                                    onValueChange={(value) => setEditFormData({
                                      ...editFormData,
                                      status: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="paused">Paused</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Cancel Meal Section */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-green-700">Cancel Meals</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Start Date</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !cancelStartDate && "text-muted-foreground"
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {cancelStartDate ? format(cancelStartDate, "PPP") : "Pick start date"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={cancelStartDate}
                                          onSelect={setCancelStartDate}
                                          initialFocus
                                          className="pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">End Date</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !cancelEndDate && "text-muted-foreground"
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {cancelEndDate ? format(cancelEndDate, "PPP") : "Pick end date"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={cancelEndDate}
                                          onSelect={setCancelEndDate}
                                          initialFocus
                                          className="pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                                
                                <Button 
                                  onClick={cancelMeals}
                                  disabled={!cancelStartDate || !cancelEndDate}
                                  className="w-full bg-red-600 hover:bg-red-700"
                                >
                                  Confirm Cancellation
                                </Button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 pt-6 border-t">
                                <Button onClick={updateSubscription} className="flex-1 bg-green-600 hover:bg-green-700">
                                  Save Changes
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsSheetOpen(false)}
                                  className="flex-1"
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSubscriptions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No subscriptions found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;