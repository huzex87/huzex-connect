import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  phone: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SMSRequest = await req.json();

    // Validate required fields
    if (!body.phone || !body.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format phone number (ensure it starts with +234)
    let phone = body.phone.replace(/\s+/g, "");
    if (phone.startsWith("0")) {
      phone = "+234" + phone.substring(1);
    } else if (!phone.startsWith("+")) {
      phone = "+234" + phone;
    }

    // For now, we'll use Termii as SMS provider (popular in Nigeria)
    // You can replace this with any SMS provider
    const smsResponse = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phone,
        from: "Huzex",
        sms: body.message,
        type: "plain",
        api_key: Deno.env.get("TERMII_API_KEY"),
        channel: "generic",
      }),
    });

    const smsData = await smsResponse.json();

    if (smsData.code !== "ok") {
      throw new Error(smsData.message || "SMS sending failed");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message_id: smsData.message_id,
        status: "sent",
        phone: phone,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-sms:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});