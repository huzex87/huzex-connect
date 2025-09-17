import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  Plus,
  RotateCcw,
  User,
  TrendingUp,
  Star,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useRealTimeOrders } from '@/hooks/useRealTimeOrders';
import { formatDistanceToNow } from 'date-fns';

export const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { orders, loading, getActiveOrders, getOrderStats, refetch } = useRealTimeOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'picked_up': return 'bg-purple-500';
      case 'in_transit': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const recentOrders = orders.slice(0, 5);
  const activeOrders = getActiveOrders();
  const stats = getOrderStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Manage your packages and track deliveries</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/send')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Send Package
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <div className="relative">
                <Package className="h-10 w-10 text-primary opacity-80" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                <p className="text-3xl font-bold text-secondary">{stats.active}</p>
                <Progress value={(stats.active / Math.max(stats.total, 1)) * 100} className="mt-2 h-1" />
              </div>
              <Truck className="h-10 w-10 text-secondary opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <Star className="h-3 w-3 mr-1" />
                  {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% success rate
                </div>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-accent">{stats.thisMonth}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Current month
                </div>
              </div>
              <Clock className="h-10 w-10 text-accent opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Quick Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-1">{stats.inTransit}</div>
                  <div className="text-sm text-muted-foreground">In Transit</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center space-x-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.order_id}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
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
                <p className="text-muted-foreground mb-4">
                  You don't have any active packages in transit.
                </p>
                <Button onClick={() => navigate('/send')}>
                  Send Your First Package
                </Button>
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
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Pickup:</span>
                          <span className="text-muted-foreground">{order.pickup_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Delivery:</span>
                          <span className="text-muted-foreground">{order.dropoff_address}</span>
                        </div>
                      </div>
                      
                      {order.riders && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {order.riders.name?.charAt(0) || 'R'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{order.riders.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ⭐ {order.riders.rating || 5.0} • {order.riders.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {order.item_description} • {order.weight_kg}kg
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/track?order_id=${order.order_id}`)}
                      >
                        Track Package
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">All Orders</h3>
                <Button variant="outline" size="sm" onClick={refetch}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{order.order_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span className="font-medium">From:</span>
                          <span className="text-muted-foreground">{order.pickup_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="font-medium">To:</span>
                          <span className="text-muted-foreground">{order.dropoff_address}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p><span className="font-medium">Item:</span> {order.item_description}</p>
                        <p><span className="font-medium">Weight:</span> {order.weight_kg}kg</p>
                        <p><span className="font-medium">Speed:</span> {order.speed?.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/track?order_id=${order.order_id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Name</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.name || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phone || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Badge variant="secondary">
                      {profile?.role || 'customer'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};