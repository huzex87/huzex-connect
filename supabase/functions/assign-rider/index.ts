import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssignRiderRequest {
  order_id: string;
  rider_id: string;
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

    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: AssignRiderRequest = await req.json();

    // Validate required fields
    if (!body.order_id || !body.rider_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_id, rider_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if order exists and is assignable
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, order_id")
      .eq("order_id", body.order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "Order is not available for assignment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if rider exists and is available
    const { data: rider, error: riderError } = await supabase
      .from("riders")
      .select("id, name, status")
      .eq("id", body.rider_id)
      .single();

    if (riderError || !rider) {
      return new Response(
        JSON.stringify({ error: "Rider not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (rider.status !== "active") {
      return new Response(
        JSON.stringify({ error: "Rider is not available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Assign rider to order
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        rider_id: body.rider_id,
        status: "assigned"
      })
      .eq("id", order.id)
      .select(`
        *,
        rider:riders(
          id,
          name,
          phone,
          vehicle_type
        )
      `)
      .single();

    if (updateError) {
      console.error("Error assigning rider:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to assign rider" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update rider status to busy
    await supabase
      .from("riders")
      .update({ status: "busy" })
      .eq("id", body.rider_id);

    // Create notification for rider
    if (rider.user_id) {
      await supabase
        .from("notifications")
        .insert({
          user_id: rider.user_id,
          title: "New Order Assigned",
          message: `You have been assigned order ${body.order_id}`,
          type: "order_assigned"
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Rider assigned successfully",
        order: updatedOrder
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in assign-rider:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});