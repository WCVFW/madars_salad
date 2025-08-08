
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  orderId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  description: string;
  subscriptionId?: string;
  billingAddress?: any;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, subscriptionId?: string) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // In a real implementation, you'd call your backend to create a Razorpay order
    // For now, we'll create a mock order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store order in our database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_amount: amount,
        payment_method: 'razorpay',
        payment_status: 'pending',
        subscription_id: subscriptionId,
        razorpay_order_id: orderId
      })
      .select()
      .single();

    if (error) throw error;

    return { orderId, dbOrderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const processPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  const isRazorpayLoaded = await initializeRazorpay();
  
  if (!isRazorpayLoaded) {
    return { success: false, error: 'Failed to load Razorpay SDK' };
  }

  return new Promise((resolve) => {
    const razorpayOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Replace with your actual key
      amount: options.amount * 100, // Amount in paise
      currency: options.currency || 'INR',
      name: 'Meal Subscription',
      description: options.description,
      order_id: options.orderId,
      handler: async function (response: any) {
        try {
          // Update payment status in database
          await updatePaymentStatus(
            options.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature,
            'completed',
            options.subscriptionId,
            options.billingAddress,
            options.amount
          );

          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        } catch (error) {
          console.error('Error updating payment status:', error);
          resolve({ success: false, error: 'Payment verification failed' });
        }
      },
      prefill: {
        name: options.userName,
        email: options.userEmail,
        contact: options.userPhone
      },
      theme: {
        color: '#f97316'
      },
      modal: {
        ondismiss: function() {
          resolve({ success: false, error: 'Payment cancelled by user' });
        }
      }
    };

    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();
  });
};

const updatePaymentStatus = async (
  orderId: string,
  paymentId: string,
  signature: string,
  status: string,
  subscriptionId?: string,
  billingAddress?: any,
  amount?: number
) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        payment_status: status,
        billing_address: billingAddress
      })
      .eq('razorpay_order_id', orderId);

    if (orderError) throw orderError;

    // Create payment history record
    const { error: historyError } = await supabase
      .from('payment_history')
      .insert({
        user_id: user.id,
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        amount: amount,
        payment_method: 'razorpay',
        payment_status: status,
        subscription_id: subscriptionId,
        billing_address: billingAddress,
        invoice_number: `INV-${Date.now()}`
      });

    if (historyError) throw historyError;

    // If subscription payment, activate subscription
    if (subscriptionId && status === 'completed') {
      const { error: subError } = await supabase
        .from('user_subscriptions')
        .update({
          payment_status: 'completed',
          status: 'active',
          admin_approved: true,
          admin_approved_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (subError) throw subError;
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
