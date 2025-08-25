import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Smartphone, 
  MapPin, 
  Users, 
  Clock, 
  Shield,
  MessageCircle,
  TrendingUp,
  Truck
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Package,
      title: "CargoPool Savings",
      description: "Share delivery costs with other shipments on the same route. Save up to 40% on intercity logistics.",
      badge: "Smart Routing",
      gradient: "from-primary to-primary-light"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Commerce",
      description: "Send packages directly through WhatsApp. Perfect for traders without smartphones or apps.",
      badge: "Inclusive",
      gradient: "from-secondary to-primary"
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "Real-time GPS tracking, delivery proofs, and transparent status updates throughout the journey.",
      badge: "Real-Time",
      gradient: "from-accent to-secondary"
    },
    {
      icon: Clock,
      title: "Same/Next Day",
      description: "Priority corridors between Lagos, Abuja, and Port Harcourt with guaranteed delivery windows.",
      badge: "Express",
      gradient: "from-primary to-accent"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Intuitive apps for customers and riders. Phone OTP login, offline capability, and push notifications.",
      badge: "Mobile",
      gradient: "from-secondary to-accent"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "End-to-end insurance, OTP verification, photo proofs, and dispute resolution system.",
      badge: "Protected",
      gradient: "from-primary to-secondary"
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Why Choose Huzex Express
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for Nigerian <span className="text-primary">Businesses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From informal traders to growing e-commerce stores, our platform is designed 
            to scale with your business needs across Nigeria's major corridors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-xl p-3 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <Truck className="h-12 w-12" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Logistics?
              </h3>
              <p className="text-lg mb-6 text-white/90">
                Join over 150 active merchants already shipping smarter with Huzex Express.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  150+ Active Merchants
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Package className="h-4 w-4 mr-2" />
                  1,500+ Orders/Month
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  95% On-Time Rate
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};