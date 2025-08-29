import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Package, 
  Shield, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  Zap,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

export const Pricing = () => {
  const pricingTiers = [
    {
      name: "Economy",
      icon: Package,
      price: "₦3,500",
      duration: "2-3 days",
      description: "Perfect for non-urgent deliveries",
      features: [
        "Intercity delivery",
        "SMS tracking updates", 
        "Package insurance up to ₦50,000",
        "Standard support",
        "Multiple pickup attempts"
      ],
      popular: false,
      color: "text-muted-foreground"
    },
    {
      name: "Next Day",
      icon: Truck,
      price: "₦5,500", 
      duration: "12-24 hours",
      description: "Reliable next-day delivery",
      features: [
        "Guaranteed next day delivery",
        "Real-time GPS tracking",
        "Package insurance up to ₦100,000", 
        "Priority support",
        "Photo delivery confirmation",
        "WhatsApp updates"
      ],
      popular: true,
      color: "text-primary"
    },
    {
      name: "Same Day",
      icon: Zap,
      price: "₦8,500",
      duration: "4-8 hours", 
      description: "Ultra-fast same-day delivery",
      features: [
        "Same day delivery guaranteed",
        "Live rider tracking",
        "Package insurance up to ₦200,000",
        "24/7 premium support", 
        "Direct rider communication",
        "Instant notifications",
        "Priority pickup"
      ],
      popular: false,
      color: "text-accent"
    }
  ];

  const cities = [
    { from: "Lagos", to: "Abuja", economy: "₦3,500", next: "₦5,500", same: "₦8,500" },
    { from: "Lagos", to: "Port Harcourt", economy: "₦4,200", next: "₦6,200", same: "₦9,200" },
    { from: "Abuja", to: "Kano", economy: "₦3,200", next: "₦5,200", same: "₦8,200" },
    { from: "Lagos", to: "Ibadan", economy: "₦2,800", next: "₦4,800", same: "₦7,800" },
    { from: "Abuja", to: "Lagos", economy: "₦3,500", next: "₦5,500", same: "₦8,500" }
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="text-primary">Affordable</span> Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            No hidden fees, no surprises. Choose the delivery speed that works for your business.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={tier.name}
                className={`relative transition-all hover:shadow-lg ${
                  tier.popular ? "ring-2 ring-primary bg-primary/5 scale-105" : "hover:bg-muted/50"
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${tier.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{tier.price}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center mt-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {tier.duration}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular 
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                      : "variant-outline"
                    }`}
                    asChild
                  >
                    <Link to="/send">
                      Choose {tier.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Route-based Pricing */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Popular Routes</CardTitle>
            <CardDescription>
              Sample pricing for common intercity routes (prices may vary based on package size and weight)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Route</th>
                    <th className="text-center py-3 px-4">Economy</th>
                    <th className="text-center py-3 px-4">Next Day</th>
                    <th className="text-center py-3 px-4">Same Day</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((route, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{route.from} → {route.to}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">{route.economy}</td>
                      <td className="text-center py-4 px-4 font-semibold text-primary">{route.next}</td>
                      <td className="text-center py-4 px-4">{route.same}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span>Insurance Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Standard Coverage</span>
                <span className="font-semibold">Up to ₦50,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Premium Coverage</span>
                <span className="font-semibold">Up to ₦200,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Custom Coverage</span>
                <span className="font-semibold">Contact us</span>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                All packages are automatically covered. Additional coverage available on request.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-accent" />
                <span>Volume Discounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>10-50 packages/month</span>
                <span className="font-semibold text-secondary">5% discount</span>
              </div>
              <div className="flex justify-between items-center">
                <span>51-200 packages/month</span>
                <span className="font-semibold text-secondary">10% discount</span>
              </div>
              <div className="flex justify-between items-center">
                <span>200+ packages/month</span>
                <span className="font-semibold text-secondary">15% discount</span>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Contact our sales team for enterprise pricing and custom solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of businesses that trust Huzex Express for their logistics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link to="/send">
                  Send Your First Package
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};