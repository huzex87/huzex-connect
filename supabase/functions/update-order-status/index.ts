import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateStatusRequest {
  order_id: string;
  status: 'picked_up' | 'en_route' | 'out_for_delivery' | 'delivered' | 'cancelled';
  proof_url?: string;
  notes?: string;
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

    const body: UpdateStatusRequest = await req.json();

    // Validate required fields
    if (!body.order_id || !body.status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_id, status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order and verify permissions
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        rider:riders!inner(id, user_id)
      `)
      .eq("order_id", body.order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is the assigned rider or admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isRider = order.rider && order.rider.user_id === user.id;
    const isAdmin = profile?.role === "admin";

    if (!isRider && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Permission denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order status
    const updateData: any = {
      status: body.status,
      notes: body.notes
    };

    // Handle proof uploads based on status
    if (body.status === 'picked_up' && body.proof_url) {
      updateData.pickup_proof_url = body.proof_url;
    } else if (body.status === 'delivered' && body.proof_url) {
      updateData.delivery_proof_url = body.proof_url;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
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
      console.error("Error updating order status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update order status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update rider status when order is completed
    if (body.status === 'delivered' || body.status === 'cancelled') {
      await supabase
        .from("riders")
        .update({ 
          status: "active",
          total_deliveries: body.status === 'delivered' ? 
            supabase.rpc('increment_deliveries', { rider_id: order.rider_id }) : 
            undefined
        })
        .eq("id", order.rider_id);
    }

    // Send notification to customer
    if (order.customer_id) {
      await supabase
        .from("notifications")
        .insert({
          user_id: order.customer_id,
          title: "Order Status Updated",
          message: `Your order ${body.order_id} is now ${body.status.replace('_', ' ')}`,
          type: "status_update"
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in update-order-status:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to increment delivery count
const incrementDeliveries = `
CREATE OR REPLACE FUNCTION increment_deliveries(rider_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.riders 
  SET total_deliveries = total_deliveries + 1 
  WHERE id = rider_id
  RETURNING total_deliveries INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;
`;