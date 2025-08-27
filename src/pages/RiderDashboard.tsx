import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Package, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Clock,
  Star,
  Navigation,
  Camera,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const RiderDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [riderProfile, setRiderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'rider') {
      fetchRiderData();
      
      // Set up real-time updates for assigned orders
      const channel = supabase
        .channel('rider-orders')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            fetchRiderData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else if (user && profile?.role !== 'rider') {
      navigate('/dashboard');
    }
  }, [user, profile]);

  const fetchRiderData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch rider profile
    const { data: riderData } = await supabase
      .from('riders')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (riderData) {
      setRiderProfile(riderData);
      
      // Fetch assigned orders
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (
            name,
            phone
          )
        `)
        .eq('rider_id', riderData.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setOrders(ordersData || []);
      }
    }
    
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.functions.invoke('update-order-status', {
      body: { order_id: orderId, status: newStatus }
    });

    if (error) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus.replace('_', ' ')}`,
      });
      fetchRiderData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500';
      case 'picked_up': return 'bg-purple-500';
      case 'in_transit': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned': return 'picked_up';
      case 'picked_up': return 'in_transit';
      case 'in_transit': return 'delivered';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned': return 'Mark as Picked Up';
      case 'picked_up': return 'Mark as In Transit';
      case 'in_transit': return 'Mark as Delivered';
      default: return null;
    }
  };

  if (!user || profile?.role !== 'rider') {
    return null;
  }

  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    order.status === 'delivered'
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Rider Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {riderProfile?.name || 'Rider'}!
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedOrders.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{riderProfile?.rating || 5.0}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
                <p className="text-2xl font-bold">{riderProfile?.total_deliveries || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activeOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                <p className="text-muted-foreground">
                  You don't have any active deliveries assigned.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.order_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-green-500 mt-1" />
                          <div>
                            <span className="font-medium">Pickup:</span>
                            <p className="text-muted-foreground">{order.pickup_address}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-red-500 mt-1" />
                          <div>
                            <span className="font-medium">Delivery:</span>
                            <p className="text-muted-foreground">{order.dropoff_address}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {order.profiles?.name?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{order.profiles?.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.profiles?.phone || order.customer_phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p><span className="font-medium">Item:</span> {order.item_description}</p>
                          <p><span className="font-medium">Weight:</span> {order.weight_kg}kg</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.pickup_address)}`, '_blank')}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`tel:${order.profiles?.phone || order.customer_phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                      </div>
                      
                      {getNextStatus(order.status) && (
                        <Button 
                          onClick={() => updateOrderStatus(order.order_id, getNextStatus(order.status)!)}
                          size="sm"
                        >
                          {getNextStatusLabel(order.status)}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{order.order_id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Delivered on {new Date(order.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      DELIVERED
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">From:</span> {order.pickup_address}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">To:</span> {order.dropoff_address}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p><span className="font-medium">Customer:</span> {order.profiles?.name}</p>
                      <p><span className="font-medium">Item:</span> {order.item_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Rider Profile</CardTitle>
              <CardDescription>Your rider information and statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riderProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <p className="p-3 bg-muted rounded-md">{riderProfile.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <p className="p-3 bg-muted rounded-md">{riderProfile.phone}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <p className="p-3 bg-muted rounded-md">{riderProfile.vehicle_type}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <p className="p-3 bg-muted rounded-md">{riderProfile.city}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Badge variant={riderProfile.status === 'active' ? 'default' : 'secondary'}>
                      {riderProfile.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{riderProfile.rating}/5.0</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};