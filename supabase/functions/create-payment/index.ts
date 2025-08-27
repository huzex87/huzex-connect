import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  order_id: string;
  amount: number;
  payment_method: 'paystack' | 'bank_transfer' | 'cash_on_delivery';
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

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    let user_id = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      user_id = user?.id;
    }

    const body: PaymentRequest = await req.json();

    // Validate request
    if (!body.order_id || !body.amount || !body.payment_method) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", body.order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process payment based on method
    let payment_status = 'pending';
    let payment_reference = '';
    let payment_url = '';

    if (body.payment_method === 'paystack') {
      // Integrate with Paystack API (placeholder)
      payment_reference = `PAY_${Date.now()}`;
      payment_url = `https://paystack.com/pay/${payment_reference}`;
    } else if (body.payment_method === 'bank_transfer') {
      payment_reference = `BANK_${Date.now()}`;
      payment_status = 'pending_verification';
    } else if (body.payment_method === 'cash_on_delivery') {
      payment_reference = `COD_${Date.now()}`;
      payment_status = 'pending_delivery';
    }

    // Update order with payment information
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        amount: body.amount,
        payment_method: body.payment_method,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", body.order_id);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to process payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_reference,
        payment_status,
        payment_url: payment_url || null,
        message: `Payment processed via ${body.payment_method}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-payment:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});