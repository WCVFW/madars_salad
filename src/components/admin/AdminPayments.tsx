import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, CreditCard, IndianRupee } from "lucide-react";
import { format } from "date-fns";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  razorpay_payment_id: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    phone_number: string | null;
  } | null;
}

interface PaymentSummary {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  totalTransactions: number;
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          *,
          profiles (full_name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const paymentsData = (data as unknown as Payment[]) || [];
      setPayments(paymentsData);

      // Calculate summary
      const totalRevenue = paymentsData
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      const pendingPayments = paymentsData
        .filter(p => p.payment_status === 'pending')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      const completedPayments = paymentsData
        .filter(p => p.payment_status === 'completed').length;

      setSummary({
        totalRevenue,
        pendingPayments,
        completedPayments,
        totalTransactions: paymentsData.length
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error loading payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportPayments = async () => {
    try {
      const csvData = filteredPayments.map(payment => ({
        'Payment ID': payment.id,
        'User Name': payment.profiles?.full_name || 'N/A',
        'Phone': payment.profiles?.phone_number || 'N/A',
        'Amount': payment.amount,
        'Payment Method': payment.payment_method,
        'Status': payment.payment_status,
        'Razorpay ID': payment.razorpay_payment_id || 'N/A',
        'Date': format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm:ss')
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({ title: "Payment history exported successfully!" });
    } catch (error) {
      console.error('Error exporting payments:', error);
      toast({
        title: "Error exporting payments",
        variant: "destructive"
      });
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.profiles?.phone_number?.includes(searchTerm) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
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
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completedPayments}</div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </div>
            <Button onClick={exportPayments}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, payment ID, or Razorpay ID..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Razorpay ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payment.profiles?.full_name || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.profiles?.phone_number || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{Number(payment.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {payment.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.payment_status)}>
                        {payment.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">
                        {payment.razorpay_payment_id || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{format(new Date(payment.created_at), 'MMM dd, yyyy')}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(payment.created_at), 'HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;