import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/Layout/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  Package, 
  Truck, 
  Users, 
  TrendingUp, 
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Eye,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeRiders: 0,
    todayRevenue: 0,
    pendingApplications: 0
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch riders
      const { data: ridersData } = await supabase
        .from("riders")
        .select("*");

      // Fetch applications
      const { data: applicationsData } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      setOrders(ordersData || []);
      setRiders(ridersData || []);
      setApplications(applicationsData || []);

      // Calculate stats
      setStats({
        totalOrders: ordersData?.length || 0,
        activeRiders: ridersData?.filter(r => r.status === 'active').length || 0,
        todayRevenue: ordersData?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0,
        pendingApplications: applicationsData?.filter(a => a.status === 'pending').length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveApplication = async (applicationId: string) => {
    try {
      // Update application status
      const { error } = await supabase
        .from("applications")
        .update({ status: 'approved' })
        .eq("id", applicationId);

      if (error) throw error;

      // Create rider record
      const application = applications.find(a => a.id === applicationId);
      if (application) {
        const { error: riderError } = await supabase
          .from("riders")
          .insert({
            name: application.full_name,
            phone: application.phone,
            vehicle_type: application.vehicle_type,
            status: 'active'
          });

        if (riderError) throw riderError;
      }

      toast({
        title: "Application Approved",
        description: "Rider has been added to the system",
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  const rejectApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: 'rejected' })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "Application has been rejected",
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "assigned": return "bg-blue-500";
      case "en_route": return "bg-primary";
      case "picked_up": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "active": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const getRiderStatusColor = (status: string) => {
    return status === "active" ? "text-green-600" : "text-gray-400";
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-muted/20 py-8">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Real-time operations management for Huzex Express
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Riders</p>
                    <p className="text-3xl font-bold">{stats.activeRiders}</p>
                  </div>
                  <Truck className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-3xl font-bold">₦{stats.todayRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Applications</p>
                    <p className="text-3xl font-bold">{stats.pendingApplications}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full lg:w-fit grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="riders" className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Riders</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Applications</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Orders</span>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Refresh
                  </Button>
                </CardTitle>
                <CardDescription>
                  Monitor and manage all package deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                        <div>
                          <p className="font-medium font-mono text-sm">{order.order_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.pickup_address} → {order.dropoff_address}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(order.status)} text-white border-0`}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground">Orders will appear here once customers start using the service.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riders Tab */}
          <TabsContent value="riders">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Active Riders</CardTitle>
                <CardDescription>
                  Monitor rider performance and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riders.map((rider) => (
                    <div key={rider.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${rider.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <p className="font-medium">{rider.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{rider.city}</span>
                            <Phone className="h-3 w-3 ml-2" />
                            <span>{rider.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">⭐ {rider.rating}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{rider.total_deliveries}</p>
                          <p className="text-xs text-muted-foreground">Deliveries</p>
                        </div>
                        <Badge 
                          className={`${getStatusColor(rider.status)} text-white`}
                        >
                          {rider.status.toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {riders.length === 0 && (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Riders Yet</h3>
                      <p className="text-muted-foreground">Approved rider applications will appear here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Orders This Week</span>
                      <span className="font-bold">342</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Delivery Time</span>
                      <span className="font-bold">18.5 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer Satisfaction</span>
                      <span className="font-bold">4.6/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Revenue Growth</span>
                      <span className="font-bold text-green-600">+18%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    <span>Alerts & Issues</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">3 Unassigned Orders</p>
                        <p className="text-xs text-muted-foreground">Lagos to Abuja route</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">All riders active</p>
                        <p className="text-xs text-muted-foreground">148 riders online</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Rider Applications</CardTitle>
                <CardDescription>
                  Review and approve new rider applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium">{application.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {application.phone} • {application.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {application.vehicle_type} • {application.experience_years} years experience
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied: {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(application.status)} text-white`}>
                          {application.status.toUpperCase()}
                        </Badge>
                        {application.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => approveApplication(application.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => rejectApplication(application.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Applications Yet</h3>
                      <p className="text-muted-foreground">
                        Rider applications will appear here when people apply to join your team.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
};