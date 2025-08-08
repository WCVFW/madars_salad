import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Calendar, FileSpreadsheet, History } from "lucide-react";
import { format } from "date-fns";

interface OrderData {
  user_name: string;
  phone_number: string;
  delivery_address: string;
  plan_name: string;
  meal_preference: string;
  dish_assigned: string;
  payment_method: string;
  subscription_status: string;
  delivery_date: string;
  cancellation_status: string;
}

interface ExportHistory {
  id: string;
  date: string;
  filename: string;
  record_count: number;
  created_at: string;
}

const CSVExportOrders = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrdersForDate();
    fetchExportHistory();
  }, [selectedDate]);

  const fetchOrdersForDate = async () => {
    setLoading(true);
    try {
      // Fetch subscriptions for the selected date
      const { data: subscriptions, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (name),
          delivery_addresses (street_address, city, pincode)
        `)
        .eq('status', 'active');

      // Fetch profiles separately to avoid relation issues
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number');

      if (subError) throw subError;
      if (profileError) throw profileError;

      // Check for meal deliveries and cancellations for this date
      const { data: deliveries, error: delError } = await supabase
        .from('meal_deliveries')
        .select('*')
        .eq('delivery_date', selectedDate);

      if (delError) throw delError;

      // Transform data for export
      const orderData: OrderData[] = (subscriptions || []).map(sub => {
        const delivery = deliveries?.find(d => d.subscription_id === sub.id);
        const address = sub.delivery_addresses;
        const userProfile = profiles?.find(p => p.id === sub.user_id);
        
        return {
          user_name: userProfile?.full_name || 'N/A',
          phone_number: userProfile?.phone_number || 'N/A',
          delivery_address: address ? 
            `${address.street_address}, ${address.city}, ${address.pincode}` : 
            'Address not set',
          plan_name: sub.subscription_plans?.name || 'N/A',
          meal_preference: sub.meal_preference,
          dish_assigned: 'To be assigned', // This would come from meal planning system
          payment_method: sub.payment_method || 'UPI',
          subscription_status: sub.status,
          delivery_date: selectedDate,
          cancellation_status: delivery?.status === 'cancelled' ? 'Cancelled' : 'Active'
        };
      });

      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error loading orders",
        description: "Failed to fetch orders for the selected date",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExportHistory = async () => {
    try {
      // Note: This would require a new table for export history
      // For now, we'll simulate it
      setExportHistory([]);
    } catch (error) {
      console.error('Error fetching export history:', error);
    }
  };

  const exportToCSV = async () => {
    if (orders.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no orders for the selected date",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      // Prepare CSV content
      const headers = [
        'User Name',
        'Phone Number',
        'Delivery Address',
        'Plan Name',
        'Meal Preference',
        'Dish Assigned',
        'Payment Method',
        'Subscription Status',
        'Delivery Date',
        'Cancellation Status'
      ];

      const csvContent = [
        headers.join(','),
        ...orders.map(order => [
          order.user_name,
          order.phone_number,
          `"${order.delivery_address}"`,
          order.plan_name,
          order.meal_preference,
          order.dish_assigned,
          order.payment_method,
          order.subscription_status,
          order.delivery_date,
          order.cancellation_status
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const filename = `madras-salad-orders-${selectedDate}.csv`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log export (in a real app, you'd save this to a database)
      const newExport: ExportHistory = {
        id: Date.now().toString(),
        date: selectedDate,
        filename,
        record_count: orders.length,
        created_at: new Date().toISOString()
      };
      
      setExportHistory(prev => [newExport, ...prev]);

      toast({
        title: "Export successful!",
        description: `Downloaded ${orders.length} orders for ${format(new Date(selectedDate), 'MMM dd, yyyy')}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Daily Orders Export
          </CardTitle>
          <CardDescription>
            Export subscription orders and delivery data for specific dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="export-date">Select Date</Label>
              <Input
                id="export-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={exportToCSV}
              disabled={loading || exporting || orders.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(selectedDate), 'EEEE, MMM dd, yyyy')}</span>
            </div>
            <Badge variant="outline">
              {orders.length} orders
            </Badge>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading orders...</p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="border rounded-md">
              <div className="max-h-60 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Preference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.user_name}</div>
                            <div className="text-sm text-muted-foreground">{order.phone_number}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.plan_name}</TableCell>
                        <TableCell>{order.meal_preference}</TableCell>
                        <TableCell>
                          <Badge variant={order.cancellation_status === 'Active' ? 'default' : 'secondary'}>
                            {order.cancellation_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {orders.length > 10 && (
                <div className="p-3 text-sm text-muted-foreground text-center border-t">
                  Showing 10 of {orders.length} orders. Export CSV to see all.
                </div>
              )}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No orders found for this date</p>
            </div>
          )}
        </CardContent>
      </Card>

      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Export History
            </CardTitle>
            <CardDescription>
              Recent CSV exports for your records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportHistory.map((export_item) => (
                <div key={export_item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{export_item.filename}</div>
                    <div className="text-sm text-muted-foreground">
                      {export_item.record_count} records • {format(new Date(export_item.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <Badge variant="outline">Exported</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CSVExportOrders;