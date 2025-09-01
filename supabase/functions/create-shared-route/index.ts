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
      route_name,
      origin,
      destination,
      departure_date,
      departure_time,
      available_capacity_kg,
      price_per_kg
    } = await req.json()

    // Get rider profile
    const { data: rider, error: riderError } = await supabaseClient
      .from('riders')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (riderError || !rider) {
      return new Response(JSON.stringify({ error: 'Only riders can create shared routes' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create shared route
    const { data, error } = await supabaseClient
      .from('shared_routes')
      .insert({
        route_name,
        origin,
        destination,
        departure_date,
        departure_time,
        available_capacity_kg,
        price_per_kg,
        driver_id: rider.id,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating shared route:', error)
      return new Response(JSON.stringify({ error: 'Failed to create shared route' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ route: data }), {
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