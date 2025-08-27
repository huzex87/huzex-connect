-- Fix security issue: Restrict access to bot_sessions table to prevent exposure of WhatsApp conversations

-- Add RLS policy to prevent regular authenticated users from accessing bot sessions
-- Only service role (used by WhatsApp webhook) should have access to this table
CREATE POLICY "Restrict bot_sessions to service role only" 
ON public.bot_sessions 
FOR ALL 
TO authenticated
USING (false)
WITH CHECK (false);

-- Add policy for service role access (this allows the webhook to continue working)
-- Note: Service role bypasses RLS by default, but this documents the intended access pattern
CREATE POLICY "Service role can manage bot_sessions" 
ON public.bot_sessions 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);