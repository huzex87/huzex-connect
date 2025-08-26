-- Fix security issue: Remove overly permissive rider access and restrict to legitimate use cases

-- Drop the problematic policy that exposes all rider information to anyone
DROP POLICY IF EXISTS "Anyone can view active riders" ON public.riders;

-- Drop existing policy if it exists and recreate with correct name
DROP POLICY IF EXISTS "Customers can view assigned rider info" ON public.riders;

-- Add policy for customers to view their assigned rider information only
-- This allows customers to see rider details when tracking their orders
CREATE POLICY "Customers can view assigned riders" 
ON public.riders 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.orders o 
    WHERE o.rider_id = riders.id 
    AND o.customer_id = auth.uid()
  )
);

-- Drop and recreate the riders own profile policy to ensure it's correct
DROP POLICY IF EXISTS "Riders can view own profile" ON public.riders;
CREATE POLICY "Riders can view own profile" 
ON public.riders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);