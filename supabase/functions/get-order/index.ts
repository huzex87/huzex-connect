import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const url = new URL(req.url);
    const order_id = url.pathname.split('/').pop();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order details with rider information
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        rider:riders(
          id,
          name,
          phone,
          vehicle_type,
          rating
        )
      `)
      .eq("order_id", order_id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create timeline based on status
    const timeline = [];
    const statuses = ['pending', 'assigned', 'picked_up', 'en_route', 'out_for_delivery', 'delivered'];
    
    for (const status of statuses) {
      const isCompleted = statuses.indexOf(order.status) >= statuses.indexOf(status);
      const isCurrent = order.status === status;
      
      timeline.push({
        status,
        timestamp: isCompleted && !isCurrent ? new Date(order.created_at).toISOString() : null,
        description: getStatusDescription(status),
        current: isCurrent
      });
    }

    const response = {
      order_id: order.order_id,
      status: order.status,
      pickup_address: order.pickup_address,
      dropoff_address: order.dropoff_address,
      item_description: order.item_description,
      weight_kg: order.weight_kg,
      speed: order.speed,
      customer_phone: order.customer_phone,
      rider: order.rider ? {
        id: order.rider.id,
        name: order.rider.name,
        phone: order.rider.phone,
        vehicle_type: order.rider.vehicle_type,
        rating: order.rider.rating
      } : null,
      eta: order.eta,
      tracking_url: order.tracking_url,
      timeline,
      created_at: order.created_at,
      updated_at: order.updated_at
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in get-order:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getStatusDescription(status: string): string {
  const descriptions = {
    pending: "Order created and awaiting assignment",
    assigned: "Order assigned to rider",
    picked_up: "Package picked up from sender",
    en_route: "Package is on the way",
    out_for_delivery: "Out for delivery at destination",
    delivered: "Package delivered successfully"
  };
  return descriptions[status as keyof typeof descriptions] || status;
}