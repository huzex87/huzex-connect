import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateApplicationRequest {
  role: 'rider' | 'agent';
  full_name: string;
  phone: string;
  email?: string;
  city?: string;
  experience_years?: number;
  vehicle_type?: string;
  license_number?: string;
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

    const body: CreateApplicationRequest = await req.json();

    // Validate required fields
    if (!body.role || !body.full_name || !body.phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: role, full_name, phone" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate role
    if (!['rider', 'agent'].includes(body.role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be 'rider' or 'agent'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if application already exists for this phone
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("phone", body.phone)
      .eq("role", body.role)
      .single();

    if (existingApp) {
      return new Response(
        JSON.stringify({ error: "Application already exists for this phone number and role" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert application
    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        role: body.role,
        full_name: body.full_name,
        phone: body.phone,
        email: body.email,
        city: body.city,
        experience_years: body.experience_years,
        vehicle_type: body.vehicle_type,
        license_number: body.license_number,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating application:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create application" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send notification to admins
    await supabase
      .from("notifications")
      .insert({
        title: "New Application Received",
        message: `${body.full_name} has applied to be a ${body.role} in ${body.city || 'unknown city'}`,
        type: "new_application"
      });

    return new Response(
      JSON.stringify({
        id: application.id,
        status: "received",
        message: "Your application has been submitted successfully. We will review and contact you soon."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-application:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});