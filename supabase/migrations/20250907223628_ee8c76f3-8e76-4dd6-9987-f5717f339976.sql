-- Add RLS policies for ratings
CREATE POLICY "Users can view ratings for their orders" 
ON public.ratings 
FOR SELECT 
USING (auth.uid() = customer_id OR EXISTS (
  SELECT 1 FROM riders WHERE id = rider_id AND user_id = auth.uid()
));

CREATE POLICY "Customers can create ratings for their orders" 
ON public.ratings 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own ratings" 
ON public.ratings 
FOR UPDATE 
USING (auth.uid() = customer_id);

-- Add RLS policies for messages
CREATE POLICY "Users can view messages for their orders" 
ON public.messages 
FOR SELECT 
USING (
  auth.uid() = sender_id OR 
  EXISTS (
    SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid()
    UNION
    SELECT 1 FROM orders o JOIN riders r ON o.rider_id = r.id 
    WHERE o.id = order_id AND r.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages for their orders" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid()
    UNION
    SELECT 1 FROM orders o JOIN riders r ON o.rider_id = r.id 
    WHERE o.id = order_id AND r.user_id = auth.uid()
  )
);

-- Add RLS policies for support tickets
CREATE POLICY "Users can view their own tickets" 
ON public.support_tickets 
FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can create support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
ON public.support_tickets 
FOR UPDATE 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
));

-- Add RLS policies for ticket messages
CREATE POLICY "Users can view messages for their tickets" 
ON public.ticket_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM support_tickets st 
    WHERE st.id = ticket_id AND 
    (st.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  )
);

CREATE POLICY "Users can send messages for their tickets" 
ON public.ticket_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM support_tickets st 
    WHERE st.id = ticket_id AND 
    (st.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  )
);

-- Add RLS policies for earnings
CREATE POLICY "Riders can view their own earnings" 
ON public.rider_earnings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM riders r 
    WHERE r.id = rider_id AND r.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add storage policies
CREATE POLICY "Delivery proofs are viewable by authenticated users" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'delivery-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Riders can upload delivery proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'delivery-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Pickup proofs are viewable by authenticated users" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pickup-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Riders can upload pickup proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pickup-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photo" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile photo" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add triggers for updated_at
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();