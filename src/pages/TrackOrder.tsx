import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  Phone,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TrackOrder = () => {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockData = {
        orderId: orderId || "HX-2025-123456",
        status: "en_route",
        pickup: "Lagos (Victoria Island)",
        dropoff: "Abuja (Central)",
        item: "Electronics - Laptop",
        weightKg: "2.5",
        speed: "same_day",
        customerPhone: "+234 800 123 4567",
        riderId: "RDR-001",
        riderName: "Ibrahim Mohammed",
        riderPhone: "+234 901 234 5678",
        eta: "2025-01-25T16:00:00Z",
        trackingUrl: `https://track.huzexexpress.com/${orderId}`,
        timeline: [
          { status: "created", timestamp: "2025-01-25T08:00:00Z", description: "Order created and confirmed" },
          { status: "assigned", timestamp: "2025-01-25T08:30:00Z", description: "Assigned to rider Ibrahim M." },
          { status: "picked_up", timestamp: "2025-01-25T09:15:00Z", description: "Package picked up from Lagos" },
          { status: "en_route", timestamp: "2025-01-25T10:00:00Z", description: "On the way to Abuja", current: true },
          { status: "out_for_delivery", timestamp: null, description: "Out for delivery in Abuja" },
          { status: "delivered", timestamp: null, description: "Package delivered" }
        ]
      };
      setTrackingData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  const copyTrackingLink = () => {
    if (trackingData?.trackingUrl) {
      navigator.clipboard.writeText(trackingData.trackingUrl);
      toast({
        title: "Copied!",
        description: "Tracking link copied to clipboard",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created": return "bg-blue-500";
      case "assigned": return "bg-yellow-500";
      case "picked_up": return "bg-orange-500";
      case "en_route": return "bg-primary";
      case "out_for_delivery": return "bg-secondary";
      case "delivered": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "created": return Package;
      case "assigned": return Truck;
      case "picked_up": return CheckCircle;
      case "en_route": return Truck;
      case "out_for_delivery": return MapPin;
      case "delivered": return CheckCircle;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Track Your <span className="text-primary">Package</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your order ID to get real-time delivery updates
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Track Package</span>
            </CardTitle>
            <CardDescription>
              Your order ID starts with "HX-" (e.g., HX-2025-123456)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderId" className="sr-only">Order ID</Label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., HX-2025-123456)"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isLoading ? "Tracking..." : "Track Package"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Order {trackingData.orderId}</span>
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(trackingData.status)} text-white`}
                  >
                    {trackingData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{trackingData.pickup}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{trackingData.dropoff}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="font-medium">{trackingData.item}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{trackingData.weightKg} kg</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Rider</p>
                      <p className="font-medium">{trackingData.riderName}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Call Rider</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={trackingData.trackingUrl} 
                      readOnly 
                      className="text-xs font-mono"
                    />
                    <Button variant="outline" size="sm" onClick={copyTrackingLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={trackingData.trackingUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Delivery Timeline</span>
                </CardTitle>
                <CardDescription>
                  Real-time updates on your package journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.timeline.map((event: any, index: number) => {
                    const Icon = getStatusIcon(event.status);
                    const isCompleted = event.timestamp;
                    const isCurrent = event.current;
                    
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`rounded-full p-2 ${
                          isCompleted 
                            ? getStatusColor(event.status)
                            : isCurrent 
                              ? "bg-primary animate-pulse"
                              : "bg-muted"
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isCompleted || isCurrent ? "text-white" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {event.description}
                            </h4>
                            {isCurrent && (
                              <Badge variant="outline" className="text-primary border-primary">
                                Current
                              </Badge>
                            )}
                          </div>
                          {event.timestamp && (
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ETA */}
            <Card className="bg-gradient-to-r from-secondary via-primary to-accent text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Estimated Delivery</h3>
                    <p className="text-white/90">
                      {new Date(trackingData.eta).toLocaleDateString()} at{" "}
                      {new Date(trackingData.eta).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo Note */}
        {!trackingData && (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Try the Demo</h3>
              <p className="text-muted-foreground mb-4">
                Use any order ID (e.g., "HX-2025-123456") to see the tracking interface in action
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOrderId("HX-2025-123456");
                  handleTrack(new Event('submit') as any);
                }}
              >
                View Demo Tracking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};