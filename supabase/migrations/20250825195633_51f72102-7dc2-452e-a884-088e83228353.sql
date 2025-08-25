-- Create enum types
CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'rider');
CREATE TYPE public.order_status AS ENUM ('pending', 'assigned', 'picked_up', 'en_route', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE public.speed_type AS ENUM ('same_day', 'next_day', 'economy');
CREATE TYPE public.payment_method AS ENUM ('cash_on_delivery', 'paystack', 'wallet');
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.rider_status AS ENUM ('active', 'inactive', 'busy');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role app_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create riders table
CREATE TABLE public.riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  vehicle_type TEXT,
  city TEXT,
  status rider_status DEFAULT 'active',
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  customer_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  item_description TEXT NOT NULL,
  weight_kg DECIMAL(5,2),
  speed speed_type DEFAULT 'same_day',
  payment_method payment_method DEFAULT 'cash_on_delivery',
  amount INTEGER, -- in kobo for Paystack
  status order_status DEFAULT 'pending',
  rider_id UUID REFERENCES public.riders(id),
  tracking_url TEXT,
  eta TIMESTAMPTZ,
  pickup_proof_url TEXT,
  delivery_proof_url TEXT,
  delivery_otp TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table for rider/agent applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('rider', 'agent')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  experience_years INTEGER,
  vehicle_type TEXT,
  license_number TEXT,
  status application_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create WhatsApp bot sessions table
CREATE TABLE public.bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_phone TEXT NOT NULL,
  state TEXT DEFAULT 'menu',
  payload JSONB DEFAULT '{}',
  last_prompt_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order counters for generating sequential order IDs
CREATE TABLE public.order_counters (
  year INTEGER PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_counters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for orders
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Riders can view assigned orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.riders r 
      WHERE r.user_id = auth.uid() AND r.id = orders.rider_id
    )
  );

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for riders
CREATE POLICY "Anyone can view active riders" ON public.riders
  FOR SELECT USING (status = 'active');

CREATE POLICY "Riders can update own profile" ON public.riders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage riders" ON public.riders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS Policies for applications
CREATE POLICY "Anyone can create applications" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all applications" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_riders_updated_at BEFORE UPDATE ON public.riders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order IDs
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  counter_val INTEGER;
  order_id TEXT;
BEGIN
  -- Get or create counter for current year
  INSERT INTO public.order_counters (year, count) 
  VALUES (current_year, 1)
  ON CONFLICT (year) 
  DO UPDATE SET count = order_counters.count + 1
  RETURNING count INTO counter_val;
  
  -- Format as HX-YYYY-NNNNNN
  order_id := 'HX-' || current_year || '-' || LPAD(counter_val::TEXT, 6, '0');
  
  RETURN order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;