import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PaymentData {
  amount: number; // Amount in kobo
  email: string;
  order_id: string;
  callback_url?: string;
}

interface PaymentResponse {
  success: boolean;
  authorization_url?: string;
  access_code?: string;
  reference?: string;
  error?: string;
}

export const usePaystackPayment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initializePayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a payment",
        variant: "destructive",
      });
      return { success: false, error: "Authentication required" };
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-paystack-payment', {
        body: {
          ...paymentData,
          email: paymentData.email || user.email,
        },
      });

      if (error) {
        console.error('Payment initialization error:', error);
        toast({
          title: "Payment failed",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      return { success: true, ...data };

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "An error occurred while processing payment",
        variant: "destructive",
      });
      return { success: false, error: "Payment processing failed" };
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
        body: { reference },
      });

      if (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Verification failed",
          description: error.message || "Failed to verify payment",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data.transaction.status === 'success') {
        toast({
          title: "Payment successful",
          description: "Your payment has been confirmed",
        });
      }

      return { success: true, ...data };

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: "An error occurred while verifying payment",
        variant: "destructive",
      });
      return { success: false, error: "Verification failed" };
    } finally {
      setLoading(false);
    }
  };

  const redirectToPayment = (authorization_url: string) => {
    // Open payment page in new tab
    window.open(authorization_url, '_blank');
  };

  return {
    initializePayment,
    verifyPayment,
    redirectToPayment,
    loading,
  };
};