import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, Clock, User, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface PendingOrder {
  id: string;
  user_id: string;
  subscription_id: string;
  order_amount: number;
  payment_method: string;
  payment_status: string;
  admin_approved: boolean;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
  created_at: string;
  updated_at: string;
  user_subscriptions: {
    delivery_pincode: string;
    meal_preference: string;
    subscription_plans: {
      name: string;
      description: string;
    };
  } | null;
  profiles: {
    full_name: string;
    phone_number: string;
  } | null;
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingOrders();
    }
  }, [isAdmin]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin role:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_subscriptions (
            delivery_pincode,
            meal_preference,
            subscription_plans (name, description)
          ),
          profiles!inner (full_name, phone_number)
        `)
        .eq('payment_method', 'cod')
        .eq('admin_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const validOrders: PendingOrder[] = (data || []).map(order => ({
        id: order.id,
        user_id: order.user_id,
        subscription_id: order.subscription_id,
        order_amount: order.order_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        admin_approved: order.admin_approved,
        admin_approved_at: order.admin_approved_at,
        admin_approved_by: order.admin_approved_by,
        created_at: order.created_at,
        updated_at: order.updated_at,
        user_subscriptions: order.user_subscriptions,
        profiles: Array.isArray(order.profiles) ? order.profiles[0] : order.profiles
      }));
      
      setPendingOrders(validOrders);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      toast({
        title: "Error loading pending orders",
        variant: "destructive"
      });
    }
  };

  const handleApproveOrder = async (orderId: string, subscriptionId: string) => {
    try {
      // Update order approval
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          admin_approved: true,
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: user?.id,
          payment_status: 'approved'
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Update subscription status
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .update({
          admin_approved: true,
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: user?.id,
          status: 'active',
          payment_status: 'approved'
        })
        .eq('id', subscriptionId);

      if (subscriptionError) throw subscriptionError;

      toast({ title: "Order approved successfully!" });
      fetchPendingOrders();
    } catch (error) {
      console.error('Error approving order:', error);
      toast({
        title: "Error approving order",
        variant: "destructive"
      });
    }
  };

  const handleRejectOrder = async (orderId: string, subscriptionId: string) => {
    try {
      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: 'rejected',
          admin_approved_by: user?.id
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Update subscription status
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          admin_approved_by: user?.id
        })
        .eq('id', subscriptionId);

      if (subscriptionError) throw subscriptionError;

      toast({ title: "Order rejected successfully!" });
      fetchPendingOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast({
        title: "Error rejecting order",
        variant: "destructive"
      });
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have admin privileges to access this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Admin Panel - COD Approvals</h1>
          
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No pending COD orders to review!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {order.profiles?.full_name || 'Unknown User'}
                        </CardTitle>
                        <CardDescription>
                          {order.user_subscriptions?.subscription_plans?.name || 'Unknown Plan'}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(order.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold">₹{order.order_amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          Cash on Delivery
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivery PIN</p>
                        <p className="font-semibold">{order.user_subscriptions?.delivery_pincode || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{order.profiles?.phone_number || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveOrder(order.id, order.subscription_id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectOrder(order.id, order.subscription_id)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
