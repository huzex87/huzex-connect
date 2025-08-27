import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  user_id?: string;
  title: string;
  message: string;
  type: 'order_update' | 'new_order' | 'alert' | 'info';
  send_sms?: boolean;
  send_email?: boolean;
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

    const body: NotificationRequest = await req.json();

    // Validate required fields
    if (!body.title || !body.message || !body.type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert notification
    const { data: notification, error: insertError } = await supabase
      .from("notifications")
      .insert({
        user_id: body.user_id,
        title: body.title,
        message: body.message,
        type: body.type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating notification:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create notification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optional: Send SMS/Email notifications
    let smsResult = null;
    let emailResult = null;

    if (body.send_sms && body.user_id) {
      // Get user profile for phone number
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", body.user_id)
        .single();

      if (profile?.phone) {
        // SMS integration would go here
        smsResult = { status: "pending", phone: profile.phone };
      }
    }

    if (body.send_email && body.user_id) {
      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(body.user_id);
      
      if (user?.email) {
        // Email integration would go here
        emailResult = { status: "pending", email: user.email };
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification_id: notification.id,
        sms_result: smsResult,
        email_result: emailResult,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-notification:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});