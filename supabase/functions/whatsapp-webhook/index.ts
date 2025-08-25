import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hub-signature-256",
};

interface WhatsAppMessage {
  from: string;
  text?: { body: string };
  type: string;
}

interface BotSession {
  wa_phone: string;
  state: string;
  payload: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "GET") {
    // Webhook verification
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === Deno.env.get("WHATSAPP_VERIFY_TOKEN")) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Verify webhook signature
    const signature = req.headers.get("x-hub-signature-256");
    const body = await req.text();
    
    if (!verifyWebhookSignature(body, signature)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const data = JSON.parse(body);
    
    // Handle status updates
    if (data.entry?.[0]?.changes?.[0]?.field === "messages") {
      const change = data.entry[0].changes[0];
      
      if (change.value.statuses) {
        // Handle message status updates
        return new Response("OK", { status: 200 });
      }
      
      if (change.value.messages) {
        const message: WhatsAppMessage = change.value.messages[0];
        const from = message.from;
        
        if (message.type === "text" && message.text) {
          await handleTextMessage(supabase, from, message.text.body);
        }
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error in whatsapp-webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  
  const secret = Deno.env.get("WHATSAPP_WEBHOOK_SECRET") ?? "";
  const expectedSignature = "sha256=" + Array.from(
    new Uint8Array(crypto.subtle.sign("HMAC", secret, new TextEncoder().encode(body)))
  ).map(b => b.toString(16).padStart(2, "0")).join("");
  
  return signature === expectedSignature;
}

async function handleTextMessage(supabase: any, from: string, text: string) {
  // Get or create bot session
  let { data: session } = await supabase
    .from("bot_sessions")
    .select("*")
    .eq("wa_phone", from)
    .single();

  if (!session) {
    const { data: newSession } = await supabase
      .from("bot_sessions")
      .insert({
        wa_phone: from,
        state: "menu",
        payload: {}
      })
      .select()
      .single();
    session = newSession;
  }

  let response = "";
  const newState = session.state;
  const payload = session.payload || {};

  switch (session.state) {
    case "menu":
      if (text.toLowerCase().includes("send") || text === "1") {
        response = "📦 *Send Package*\n\nPlease provide pickup address:";
        await updateSession(supabase, from, "send_pickup", {});
      } else if (text.toLowerCase().includes("track") || text === "2") {
        response = "🔍 *Track Package*\n\nPlease enter your order ID (e.g., HX-2025-000123):";
        await updateSession(supabase, from, "track_order", {});
      } else if (text.toLowerCase().includes("apply") || text === "3") {
        response = "👷 *Apply as Rider/Agent*\n\nAre you applying as:\n1. Rider\n2. Agent";
        await updateSession(supabase, from, "apply_role", {});
      } else {
        response = getMenuText();
      }
      break;

    case "send_pickup":
      payload.pickup_address = text;
      response = "📍 Great! Now please provide the drop-off address:";
      await updateSession(supabase, from, "send_dropoff", payload);
      break;

    case "send_dropoff":
      payload.dropoff_address = text;
      response = "📋 What are you sending? Please describe the item:";
      await updateSession(supabase, from, "send_item", payload);
      break;

    case "send_item":
      payload.item_description = text;
      response = "⚖️ What's the approximate weight in kg? (e.g., 2.5)";
      await updateSession(supabase, from, "send_weight", payload);
      break;

    case "send_weight":
      payload.weight_kg = parseFloat(text) || 1;
      response = "🚀 Choose delivery speed:\n1. Same Day (6-8 hours)\n2. Next Day\n3. Economy (2-3 days)";
      await updateSession(supabase, from, "send_speed", payload);
      break;

    case "send_speed":
      const speedMap = { "1": "same_day", "2": "next_day", "3": "economy" };
      payload.speed = speedMap[text as keyof typeof speedMap] || "same_day";
      response = "💳 Payment method:\n1. Cash on Delivery\n2. Pay with Card";
      await updateSession(supabase, from, "send_payment", payload);
      break;

    case "send_payment":
      payload.payment_method = text === "2" ? "paystack" : "cash_on_delivery";
      
      // Create the order
      try {
        const orderData = {
          pickup_address: payload.pickup_address,
          dropoff_address: payload.dropoff_address,
          item_description: payload.item_description,
          weight_kg: payload.weight_kg,
          speed: payload.speed,
          payment_method: payload.payment_method,
          customer_phone: from
        };

        const { data: order } = await supabase.functions.invoke('create-order', {
          body: orderData
        });

        if (order?.order_id) {
          response = `✅ *Order Created Successfully!*\n\n📋 Order ID: ${order.order_id}\n🔗 Track: ${order.tracking_url}\n⏰ ETA: ${new Date(order.eta).toLocaleString()}\n\nYou can track your package anytime by sending the order ID.`;
        } else {
          response = "❌ Sorry, there was an error creating your order. Please try again or contact support.";
        }
      } catch (error) {
        console.error("Error creating order:", error);
        response = "❌ Sorry, there was an error creating your order. Please try again or contact support.";
      }
      
      await updateSession(supabase, from, "menu", {});
      break;

    case "track_order":
      try {
        const { data: order } = await supabase.functions.invoke('get-order', {
          body: { order_id: text }
        });

        if (order) {
          response = `📦 *Order Status: ${order.order_id}*\n\n🔄 Status: ${order.status.toUpperCase()}\n📍 From: ${order.pickup_address}\n📍 To: ${order.dropoff_address}\n📋 Item: ${order.item_description}\n⏰ ETA: ${new Date(order.eta).toLocaleString()}`;
          
          if (order.rider) {
            response += `\n\n👷 Rider: ${order.rider.name}\n📞 Contact: ${order.rider.phone}`;
          }
        } else {
          response = "❌ Order not found. Please check your order ID and try again.";
        }
      } catch (error) {
        response = "❌ Error tracking order. Please try again.";
      }
      
      await updateSession(supabase, from, "menu", {});
      break;

    default:
      response = getMenuText();
      await updateSession(supabase, from, "menu", {});
  }

  await sendWhatsAppMessage(from, response);
}

async function updateSession(supabase: any, phone: string, state: string, payload: any) {
  await supabase
    .from("bot_sessions")
    .upsert({
      wa_phone: phone,
      state,
      payload,
      last_prompt_at: new Date().toISOString()
    });
}

async function sendWhatsAppMessage(to: string, text: string) {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  
  if (!token || !phoneNumberId) {
    console.error("WhatsApp credentials not configured");
    return;
  }

  try {
    await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      }),
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}

function getMenuText(): string {
  return `🚚 *Welcome to Huzex Express!*\n\nHow can I help you today?\n\n1️⃣ Send a Package\n2️⃣ Track Delivery\n3️⃣ Apply as Rider/Agent\n4️⃣ Contact Support\n\nReply with a number or keyword.`;
}