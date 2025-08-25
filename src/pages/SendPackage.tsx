import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  MapPin, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Truck,
  Phone,
  User
} from "lucide-react";

export const SendPackage = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState({
    pickup: "",
    dropoff: "",
    item: "",
    weightKg: "",
    speed: "",
    paymentMethod: "",
    customerPhone: "",
    customerName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          pickup_address: orderData.pickup,
          dropoff_address: orderData.dropoff,
          item_description: orderData.item,
          weight_kg: parseFloat(orderData.weightKg),
          speed: orderData.speed,
          payment_method: orderData.paymentMethod === 'paystack' ? 'paystack' : 'cash_on_delivery',
          customer_phone: orderData.customerPhone
        }
      });

      if (error) {
        throw error;
      }

      if (data?.order_id) {
        setCreatedOrderId(data.order_id);
        toast({
          title: "Order Created Successfully!",
          description: `Your order ${data.order_id} has been created. You'll receive tracking updates via SMS.`,
        });
        setCurrentStep(4);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speedOptions = [
    { value: "same_day", label: "Same Day", price: "₦8,500", time: "4-8 hours" },
    { value: "next_day", label: "Next Day", price: "₦5,500", time: "12-24 hours" },
    { value: "economy", label: "Economy", price: "₦3,500", time: "2-3 days" }
  ];

  const cities = [
    "Lagos (Victoria Island)",
    "Lagos (Ikeja)",
    "Abuja (Central)",
    "Port Harcourt (GRA)",
    "Kano (Sabon Gari)",
    "Ibadan (Bodija)"
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Send a <span className="text-primary">Package</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Fast, reliable intercity delivery across Nigeria
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep < 4 ? (
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Package Details</span>
              </CardTitle>
              <CardDescription>
                Tell us about your package and delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Your Name</span>
                    </Label>
                    <Input
                      id="customerName"
                      value={orderData.customerName}
                      onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={orderData.customerPhone}
                      onChange={(e) => setOrderData({...orderData, customerPhone: e.target.value})}
                      placeholder="+234 800 123 4567"
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Pickup & Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Pickup Location</span>
                    </Label>
                    <Select onValueChange={(value) => setOrderData({...orderData, pickup: value})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pickup city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoff" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Delivery Location</span>
                    </Label>
                    <Select onValueChange={(value) => setOrderData({...orderData, dropoff: value})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Package Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item">Package Description</Label>
                    <Textarea
                      id="item"
                      value={orderData.item}
                      onChange={(e) => setOrderData({...orderData, item: e.target.value})}
                      placeholder="What are you sending? (e.g., Clothing, Electronics, Documents)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightKg">Weight (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      step="0.1"
                      value={orderData.weightKg}
                      onChange={(e) => setOrderData({...orderData, weightKg: e.target.value})}
                      placeholder="5.0"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Speed */}
                <div className="space-y-4">
                  <Label className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Delivery Speed</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {speedOptions.map((option) => (
                      <Card 
                        key={option.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          orderData.speed === option.value
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setOrderData({...orderData, speed: option.value})}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{option.label}</h3>
                            <div className="text-2xl font-bold text-primary">{option.price}</div>
                            <p className="text-sm text-muted-foreground">{option.time}</p>
                            {option.value === "same_day" && (
                              <Badge variant="secondary" className="bg-accent/10 text-accent">
                                Most Popular
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method</span>
                  </Label>
                  <Select onValueChange={(value) => setOrderData({...orderData, paymentMethod: value})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pod">Pay on Delivery (Cash)</SelectItem>
                      <SelectItem value="paystack">Pay Now (Card/Bank Transfer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={!orderData.pickup || !orderData.dropoff || !orderData.speed || isLoading}
                  >
                    {isLoading ? "Creating Order..." : "Create Order"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Confirmation Step
          <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Order Created Successfully!</h2>
                  <p className="text-muted-foreground">
                    Your package will be picked up within 2-4 hours.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">{createdOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>From:</span>
                      <span>{orderData.pickup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span>{orderData.dropoff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="capitalize">{orderData.speed?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Send Another Package
                  </Button>
                  <Button asChild>
                    <a href="/track">Track This Order</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};