import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  reference: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body: VerifyRequest = await req.json();

    // Validate required fields
    if (!body.reference) {
      return new Response(
        JSON.stringify({ error: "Missing required field: reference" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${body.reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Payment verification failed");
    }

    const transaction = paystackData.data;
    
    // Update order status based on payment status
    if (transaction.status === "success") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          payment_method: 'paystack',
          status: 'assigned' // Move to next stage after payment
        })
        .eq("payment_reference", body.reference);

      if (updateError) {
        console.error("Error updating order:", updateError);
      }

      // Send notification about successful payment
      const { error: notifError } = await supabase.functions.invoke('send-notification', {
        body: {
          title: 'Payment Successful',
          message: `Your payment of ₦${transaction.amount / 100} has been confirmed. Your order is now being processed.`,
          type: 'order_update'
        }
      });

      if (notifError) {
        console.error("Error sending notification:", notifError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status,
          paid_at: transaction.paid_at,
          channel: transaction.channel,
          currency: transaction.currency,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in verify-paystack-payment:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});