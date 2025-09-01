import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Users,
  Package,
  Calendar,
  ArrowRight,
  Star,
  Shield,
  Search
} from "lucide-react";

export const CargoPool = () => {
  const { toast } = useToast();
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shared_routes')
        .select(`
          *,
          riders (
            name,
            rating,
            vehicle_type
          )
        `)
        .eq('status', 'active')
        .gte('departure_date', new Date().toISOString().split('T')[0]);

      if (error) throw error;
      
      const formattedRoutes = data?.map(route => ({
        id: route.id,
        routeName: route.route_name,
        origin: route.origin,
        destination: route.destination,
        departureDate: route.departure_date,
        departureTime: route.departure_time,
        availableCapacity: route.available_capacity_kg,
        pricePerKg: route.price_per_kg,
        driverName: route.riders?.name || 'Unknown Driver',
        driverRating: route.riders?.rating || 5.0,
        vehicle: route.riders?.vehicle_type || 'Vehicle'
      })) || [];

      setAvailableRoutes(formattedRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error",
        description: "Failed to load routes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    "Lagos (Victoria Island)",
    "Lagos (Ikeja)",
    "Abuja (Central)",
    "Port Harcourt (GRA)",
    "Kano (Sabon Gari)",
    "Ibadan (Bodija)"
  ];

  const handleBookRoute = async (routeId: string) => {
    if (!packageWeight) {
      toast({
        title: "Missing Information",
        description: "Please enter your package weight to proceed.",
        variant: "destructive"
      });
      return;
    }

    const route = availableRoutes.find(r => r.id === routeId);
    const weight = parseFloat(packageWeight);
    
    if (!route || weight > route.availableCapacity) {
      toast({
        title: "Booking Error",
        description: "Not enough capacity available for this weight.",
        variant: "destructive"
      });
      return;
    }

    const totalCost = weight * route.pricePerKg;

    try {
      const { data, error } = await supabase.functions.invoke('book-shared-route', {
        body: {
          route_id: routeId,
          pickup_address: searchOrigin || 'TBD',
          dropoff_address: searchDestination || 'TBD',
          item_description: 'Package via CargoPool',
          weight_kg: weight
        }
      });

      if (error) throw error;

      if (data?.booking_reference) {
        setSelectedRoute(routeId);
        toast({
          title: "Route Booked Successfully!",
          description: `Booking reference: ${data.booking_reference}. Total cost: ₦${totalCost.toLocaleString()}`
        });
        // Refresh routes to update capacity
        fetchRoutes();
      }
    } catch (error) {
      console.error('Error booking route:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book the route. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredRoutes = availableRoutes.filter(route => {
    return (!searchOrigin || route.origin.toLowerCase().includes(searchOrigin.toLowerCase())) &&
           (!searchDestination || route.destination.toLowerCase().includes(searchDestination.toLowerCase())) &&
           (!searchDate || route.departureDate === searchDate);
  });

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">Cargo</span>Pool
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Share cargo space and save up to 60% on shipping costs
          </p>
          <p className="text-sm text-muted-foreground">
            Join other businesses using shared logistics for efficient intercity delivery
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Find Available Cargo Space</span>
            </CardTitle>
            <CardDescription>
              Search for shared cargo routes and book available space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="origin">From</Label>
                <Select onValueChange={setSearchOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">To</Label>
                <Select onValueChange={setSearchDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Departure Date</Label>
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Package Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 25.5"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Routes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Routes</h2>
            <Badge variant="secondary">{filteredRoutes.length} routes found</Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No routes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later for new routes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRoutes.map((route) => (
                <Card key={route.id} className={`transition-all hover:shadow-md ${
                  selectedRoute === route.id ? "ring-2 ring-primary bg-primary/5" : ""
                }`}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      {/* Route Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">{route.origin}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">{route.destination}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Departs: {new Date(route.departureDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Time: {route.departureTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Truck className="h-4 w-4" />
                            <span>{route.vehicle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Driver & Space Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{route.driverName}</span>
                          <Shield className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{route.driverRating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span>{route.availableCapacity}kg available</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Booking */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-2">
                          ₦{route.pricePerKg}/kg
                        </div>
                        {packageWeight && (
                          <div className="text-sm text-muted-foreground mb-3">
                            Total: ₦{(parseFloat(packageWeight) * route.pricePerKg).toLocaleString()}
                          </div>
                        )}
                        <Button 
                          onClick={() => handleBookRoute(route.id)}
                          disabled={route.availableCapacity === 0 || selectedRoute === route.id}
                          className="w-full"
                        >
                          {selectedRoute === route.id ? "Booked" : 
                           route.availableCapacity === 0 ? "Full" : "Book Space"}
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Capacity Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Available Space</span>
                        <span>{route.availableCapacity}kg</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.max(10, (route.availableCapacity / 500) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <Card className="mt-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Why Choose CargoPool?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Cost Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Save up to 60% by sharing cargo space with other businesses
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Verified Drivers</h3>
                <p className="text-sm text-muted-foreground">
                  All drivers are background-checked and vehicle-verified
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track your cargo in real-time from pickup to delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};