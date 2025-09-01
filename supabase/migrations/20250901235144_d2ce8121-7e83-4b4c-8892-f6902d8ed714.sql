-- Create a function to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_rider_id ON orders(rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create shared routes table for CargoPool
CREATE TABLE IF NOT EXISTS public.shared_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_date date NOT NULL,
  departure_time time NOT NULL,
  available_capacity_kg numeric NOT NULL DEFAULT 0,
  price_per_kg numeric NOT NULL,
  driver_id uuid REFERENCES public.riders(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'full', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on shared_routes
ALTER TABLE public.shared_routes ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_routes
CREATE POLICY "Anyone can view active shared routes" ON public.shared_routes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Riders can manage their routes" ON public.shared_routes
  FOR ALL USING (driver_id IN (
    SELECT id FROM public.riders WHERE user_id = auth.uid()
  ));

-- Create bookings table for CargoPool
CREATE TABLE IF NOT EXISTS public.route_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES public.shared_routes(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES auth.users(id),
  pickup_address text NOT NULL,
  dropoff_address text NOT NULL,
  item_description text NOT NULL,
  weight_kg numeric NOT NULL,
  price numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'delivered', 'cancelled')),
  booking_reference text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on route_bookings
ALTER TABLE public.route_bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for route_bookings
CREATE POLICY "Customers can view own bookings" ON public.route_bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create bookings" ON public.route_bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Riders can view route bookings" ON public.route_bookings
  FOR SELECT USING (route_id IN (
    SELECT id FROM public.shared_routes WHERE driver_id IN (
      SELECT id FROM public.riders WHERE user_id = auth.uid()
    )
  ));

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  ref text;
BEGIN
  ref := 'CB-' || EXTRACT(YEAR FROM now()) || '-' || LPAD((FLOOR(RANDOM() * 999999) + 1)::text, 6, '0');
  RETURN ref;
END;
$$;

-- Trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_booking_reference_trigger
  BEFORE INSERT ON public.route_bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_reference();

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_shared_routes_updated_at
  BEFORE UPDATE ON public.shared_routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_route_bookings_updated_at
  BEFORE UPDATE ON public.route_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();