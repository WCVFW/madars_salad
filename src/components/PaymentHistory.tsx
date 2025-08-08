
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, CreditCard, Receipt } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";

interface PaymentRecord {
  id: string;
  transaction_id: string | null;
  razorpay_payment_id: string | null;
  amount: number;
  payment_method: string;
  payment_status: string;
  invoice_number: string | null;
  billing_address: any;
  created_at: string;
  subscription_id: string | null;
  user_subscriptions?: {
    subscription_plans: {
      name: string;
    };
  };
}

const PaymentHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          *,
          user_subscriptions (
            subscription_plans (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Error loading payment history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPDF = async (payment: PaymentRecord) => {
    try {
      // Get user profile for invoice
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Payment Receipt', 20, 20);
      
      // Invoice details
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${payment.invoice_number || payment.id.slice(0, 8)}`, 20, 40);
      doc.text(`Date: ${format(new Date(payment.created_at), 'PPP')}`, 20, 50);
      
      // Customer details
      doc.text('Customer Details:', 20, 70);
      doc.text(`Name: ${profile?.full_name || 'N/A'}`, 20, 80);
      doc.text(`Email: ${user?.email || 'N/A'}`, 20, 90);
      doc.text(`Phone: ${profile?.phone_number || 'N/A'}`, 20, 100);
      
      // Payment details
      doc.text('Payment Details:', 20, 120);
      doc.text(`Amount: ₹${payment.amount}`, 20, 130);
      doc.text(`Payment Method: ${payment.payment_method.toUpperCase()}`, 20, 140);
      doc.text(`Transaction ID: ${payment.transaction_id || payment.razorpay_payment_id || 'N/A'}`, 20, 150);
      doc.text(`Status: ${payment.payment_status}`, 20, 160);
      
      // Subscription details
      if (payment.user_subscriptions?.subscription_plans) {
        doc.text('Subscription Details:', 20, 180);
        doc.text(`Plan: ${payment.user_subscriptions.subscription_plans.name}`, 20, 190);
      }
      
      // Billing address
      if (payment.billing_address) {
        doc.text('Billing Address:', 20, 210);
        const address = payment.billing_address;
        doc.text(`${address.flat_house_number || ''} ${address.street_address || ''}`, 20, 220);
        doc.text(`${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`, 20, 230);
      }
      
      doc.save(`receipt-${payment.id.slice(0, 8)}.pdf`);
      
      toast({
        title: "Receipt downloaded successfully!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error downloading receipt",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription>
          View and download receipts for all your payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No payment history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.transaction_id || payment.razorpay_payment_id || payment.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(payment.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{payment.amount}
                    </TableCell>
                    <TableCell className="uppercase">
                      {payment.payment_method}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.payment_status)}>
                        {payment.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadPDF(payment)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
