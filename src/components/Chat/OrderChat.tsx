import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MapPin, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'location';
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

interface OrderChatProps {
  orderId: string;
  className?: string;
}

export const OrderChat: React.FC<OrderChatProps> = ({ orderId, className }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orderId) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Get sender info for each message
      const messagesWithSenderInfo = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', msg.sender_id)
            .single();

          return {
            ...msg,
            message_type: msg.message_type as 'text' | 'image' | 'location',
            sender_name: senderData?.name || 'Unknown',
            sender_role: senderData?.role || 'user'
          };
        })
      );

      setMessages(messagesWithSenderInfo);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`order-chat-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: user.id,
          message: newMessage.trim(),
          message_type: 'text',
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Message failed",
          description: "Failed to send message",
          variant: "destructive",
        });
        return;
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Message failed",
        description: "An error occurred while sending the message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading chat...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Order Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-xs ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.sender_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`space-y-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {!isOwnMessage && (
                          <>
                            <span>{message.sender_name}</span>
                            <span className="px-1 py-0.5 bg-muted rounded text-xs">
                              {message.sender_role}
                            </span>
                          </>
                        )}
                        <span>{formatTime(message.created_at)}</span>
                      </div>
                      
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getMessageIcon(message.message_type)}
                          <span>{message.message}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={sending}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};