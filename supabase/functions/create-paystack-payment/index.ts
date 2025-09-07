import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number; // Amount in kobo (NGN)
  email: string;
  order_id: string;
  callback_url?: string;
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

    const body: PaymentRequest = await req.json();

    // Validate required fields
    if (!body.amount || !body.email || !body.order_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: amount, email, order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        amount: body.amount,
        reference: `huzex_${body.order_id}_${Date.now()}`,
        callback_url: body.callback_url || `${req.headers.get("origin")}/payment-success`,
        metadata: {
          order_id: body.order_id,
          platform: "huzex_express"
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Payment initialization failed");
    }

    // Update order with payment reference
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        payment_reference: paystackData.data.reference,
        amount: Math.round(body.amount / 100) // Convert kobo to naira
      })
      .eq("order_id", body.order_id);

    if (updateError) {
      console.error("Error updating order:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-paystack-payment:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});