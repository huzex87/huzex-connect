-- Fix security issue: Ensure applications table is properly secured

-- Ensure Row Level Security is enabled on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with proper security
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can create applications" ON public.applications;

-- Create policy allowing only admins to view applications
CREATE POLICY "Admins can view all applications" 
ON public.applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'::app_role
  )
);

-- Allow anyone to submit job applications (but only authenticated users)
CREATE POLICY "Authenticated users can create applications" 
ON public.applications 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Prevent any updates or deletes to maintain data integrity
-- (Applications should be immutable once submitted)