import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    })

    const { data: userData } = await supabaseClient.auth.getUser()
    if (!userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const {
      route_id,
      pickup_address,
      dropoff_address,
      item_description,
      weight_kg
    } = await req.json()

    // Get the shared route details
    const { data: route, error: routeError } = await supabaseClient
      .from('shared_routes')
      .select('*')
      .eq('id', route_id)
      .eq('status', 'active')
      .single()

    if (routeError || !route) {
      return new Response(JSON.stringify({ error: 'Route not found or not available' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if there's enough capacity
    if (weight_kg > route.available_capacity_kg) {
      return new Response(JSON.stringify({ error: 'Not enough capacity available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Calculate price
    const price = weight_kg * route.price_per_kg

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('route_bookings')
      .insert({
        route_id,
        customer_id: userData.user.id,
        pickup_address,
        dropoff_address,
        item_description,
        weight_kg,
        price,
        status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return new Response(JSON.stringify({ error: 'Failed to create booking' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Update route capacity
    const { error: updateError } = await supabaseClient
      .from('shared_routes')
      .update({
        available_capacity_kg: route.available_capacity_kg - weight_kg,
        status: route.available_capacity_kg - weight_kg <= 0 ? 'full' : 'active'
      })
      .eq('id', route_id)

    if (updateError) {
      console.error('Error updating route capacity:', updateError)
    }

    return new Response(JSON.stringify({ 
      booking,
      booking_reference: booking.booking_reference 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})