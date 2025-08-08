import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Package, Truck } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  user_id: string;
  order_amount: number;
  payment_method: string;
  payment_status: string;
  admin_approved: boolean | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    phone_number: string | null;
  } | null;
  user_subscriptions?: {
    delivery_pincode: string;
    delivery_addresses?: {
      street_address: string;
      city: string;
      pincode: string;
    } | null;
  } | null;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (full_name, phone_number),
          user_subscriptions (
            delivery_pincode,
            delivery_addresses (street_address, city, pincode)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as unknown as Order[]) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error loading orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ admin_approved: true })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, admin_approved: true } : order
        )
      );

      toast({ title: "Order approved successfully!" });
    } catch (error) {
      console.error('Error approving order:', error);
      toast({
        title: "Error approving order",
        variant: "destructive"
      });
    }
  };

  const exportDeliveryList = async () => {
    try {
      const deliveryData = filteredOrders
        .filter(order => order.admin_approved)
        .map(order => ({
          'Order ID': order.id,
          'Customer': order.profiles?.full_name || 'N/A',
          'Phone': order.profiles?.phone_number || 'N/A',
          'Address': order.user_subscriptions?.delivery_addresses?.street_address || 'N/A',
          'City': order.user_subscriptions?.delivery_addresses?.city || 'N/A',
          'PIN Code': order.user_subscriptions?.delivery_pincode || 'N/A',
          'Amount': order.order_amount,
          'Payment Method': order.payment_method,
          'Date': format(new Date(order.created_at), 'yyyy-MM-dd')
        }));

      const csvContent = [
        Object.keys(deliveryData[0] || {}).join(','),
        ...deliveryData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `delivery-list-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({ title: "Delivery list exported successfully!" });
    } catch (error) {
      console.error('Error exporting delivery list:', error);
      toast({
        title: "Error exporting delivery list",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.phone_number?.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "approved" && order.admin_approved) ||
      (statusFilter === "pending" && !order.admin_approved);
    
    return matchesSearch && matchesStatus;
  });

  const getOrderStatus = (order: Order) => {
    if (order.admin_approved) {
      return { status: "Approved", variant: "default" as const };
    }
    return { status: "Pending", variant: "secondary" as const };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage customer orders and deliveries</CardDescription>
            </div>
            <Button onClick={exportDeliveryList}>
              <Download className="h-4 w-4 mr-2" />
              Export Delivery List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, phone, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const orderStatus = getOrderStatus(order);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.profiles?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.profiles?.phone_number || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{Number(order.order_amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className="capitalize">
                            {order.payment_method}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.payment_status}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{order.user_subscriptions?.delivery_addresses?.street_address || 'N/A'}</div>
                          <div className="text-muted-foreground">
                            {order.user_subscriptions?.delivery_addresses?.city || 'N/A'}, {order.user_subscriptions?.delivery_pincode || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={orderStatus.variant}>
                          {orderStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{format(new Date(order.created_at), 'MMM dd, yyyy')}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {!order.admin_approved && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => approveOrder(order.id)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {order.admin_approved && (
                          <Badge variant="default">
                            <Truck className="h-3 w-3 mr-1" />
                            Ready for Delivery
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;