import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DollarSign
} from "lucide-react";

export const AdminDashboard = () => {
  const stats = [
    { title: "Total Orders", value: "1,547", change: "+12%", icon: Package, color: "text-primary" },
    { title: "Active Riders", value: "148", change: "+5%", icon: Truck, color: "text-secondary" },
    { title: "Monthly Revenue", value: "₦2.4M", change: "+18%", icon: DollarSign, color: "text-accent" },
    { title: "On-Time Rate", value: "95.2%", change: "+2.1%", icon: Clock, color: "text-green-600" }
  ];

  const recentOrders = [
    { id: "HX-2025-001234", from: "Lagos VI", to: "Abuja Central", status: "en_route", rider: "Ibrahim M.", time: "2h ago" },
    { id: "HX-2025-001235", from: "Abuja Central", to: "Port Harcourt", status: "delivered", rider: "Amaka O.", time: "4h ago" },
    { id: "HX-2025-001236", from: "Lagos Ikeja", to: "Kano", status: "pending", rider: "Unassigned", time: "1h ago" },
    { id: "HX-2025-001237", from: "Port Harcourt", to: "Lagos VI", status: "picked_up", rider: "Musa A.", time: "30m ago" }
  ];

  const riders = [
    { name: "Ibrahim Mohammed", rating: 4.9, deliveries: 245, status: "active", location: "Lagos", phone: "+234 901 234 5678" },
    { name: "Amaka Okafor", rating: 4.8, deliveries: 189, status: "active", location: "Abuja", phone: "+234 802 345 6789" },
    { name: "Musa Abdullah", rating: 4.7, deliveries: 156, status: "offline", location: "Kano", phone: "+234 703 456 7890" },
    { name: "Chika Okonkwo", rating: 4.6, deliveries: 134, status: "active", location: "Port Harcourt", phone: "+234 804 567 8901" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "assigned": return "bg-blue-500";
      case "en_route": return "bg-primary";
      case "picked_up": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getRiderStatusColor = (status: string) => {
    return status === "active" ? "text-green-600" : "text-gray-400";
  };

  return (
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
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <div className={`bg-muted/50 rounded-full p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                        <div>
                          <p className="font-medium font-mono text-sm">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.from} → {order.to}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {order.rider !== "Unassigned" ? order.rider : (
                              <span className="text-orange-600">Unassigned</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.time}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(order.status)} text-white border-0`}
                        >
                          {order.status.replace('_', ' ')}
                        </Badge>
                        {order.rider === "Unassigned" && (
                          <Button size="sm" variant="outline">
                            Assign Rider
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
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
                  {riders.map((rider, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${rider.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <p className="font-medium">{rider.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{rider.location}</span>
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
                          <p className="text-sm font-medium">{rider.deliveries}</p>
                          <p className="text-xs text-muted-foreground">Deliveries</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getRiderStatusColor(rider.status)}
                        >
                          {rider.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Pending Applications</h3>
                    <p className="text-muted-foreground">
                      All rider applications have been reviewed. New applications will appear here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};