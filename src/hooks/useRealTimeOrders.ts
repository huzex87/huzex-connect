import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          riders (
            id,
            name,
            phone,
            rating,
            vehicle_type,
            status
          ),
          profiles!orders_customer_id_fkey (
            name,
            phone
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      toast({
        title: "Error loading orders",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke('update-order-status', {
        body: { order_id: orderId, status }
      });

      if (error) throw error;

      toast({
        title: "Order updated",
        description: `Order status changed to ${status.replace('_', ' ')}`,
      });
      
      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      console.error('Error updating order:', err);
      toast({
        title: "Error updating order",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [fetchOrders, toast]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      
      // Set up real-time updates for orders with more specific filtering
      const channel = supabase
        .channel(`user-orders-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `customer_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Order update received:', payload);
            fetchOrders();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'riders'
          },
          (payload) => {
            // Update rider info if it affects user's orders
            console.log('Rider update received:', payload);
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchOrders]);

  const getOrdersByStatus = useCallback((status: string[]) => {
    return orders.filter(order => status.includes(order.status));
  }, [orders]);

  const getActiveOrders = useCallback(() => {
    return orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  }, [orders]);

  const getOrderStats = useCallback(() => {
    const now = new Date();
    const thisMonth = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear();
    });

    return {
      total: orders.length,
      active: getActiveOrders().length,
      delivered: getOrdersByStatus(['delivered']).length,
      thisMonth: thisMonth.length,
      pending: getOrdersByStatus(['pending']).length,
      inTransit: getOrdersByStatus(['in_transit', 'picked_up']).length
    };
  }, [orders, getActiveOrders, getOrdersByStatus]);

  return { 
    orders, 
    loading, 
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    getOrdersByStatus,
    getActiveOrders,
    getOrderStats
  };
};