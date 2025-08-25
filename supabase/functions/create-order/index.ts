import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderRequest {
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  weight_kg: number;
  speed: 'same_day' | 'next_day' | 'economy';
  payment_method: 'cash_on_delivery' | 'paystack' | 'wallet';
  customer_phone: string;
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
    let customer_id = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      customer_id = user?.id;
    }

    const body: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!body.pickup_address || !body.dropoff_address || !body.item_description || !body.customer_phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate order ID
    const { data: orderIdData, error: orderIdError } = await supabase
      .rpc('generate_order_id');

    if (orderIdError) {
      console.error("Error generating order ID:", orderIdError);
      return new Response(
        JSON.stringify({ error: "Failed to generate order ID" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order_id = orderIdData;

    // Calculate ETA (simplified logic)
    const now = new Date();
    const eta = new Date(now);
    if (body.speed === 'same_day') {
      eta.setHours(eta.getHours() + 6);
    } else if (body.speed === 'next_day') {
      eta.setDate(eta.getDate() + 1);
    } else {
      eta.setDate(eta.getDate() + 2);
    }

    // Create tracking URL
    const tracking_url = `${req.headers.get("origin")}/track?order_id=${order_id}`;

    // Insert order
    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        order_id,
        customer_id,
        customer_phone: body.customer_phone,
        pickup_address: body.pickup_address,
        dropoff_address: body.dropoff_address,
        item_description: body.item_description,
        weight_kg: body.weight_kg,
        speed: body.speed,
        payment_method: body.payment_method,
        tracking_url,
        eta: eta.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating order:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send notification to admins (simplified)
    await supabase
      .from("notifications")
      .insert({
        title: "New Order Created",
        message: `Order ${order_id} has been created for ${body.pickup_address} to ${body.dropoff_address}`,
        type: "new_order"
      });

    return new Response(
      JSON.stringify({
        order_id,
        tracking_url,
        status: "created",
        eta: eta.toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-order:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});