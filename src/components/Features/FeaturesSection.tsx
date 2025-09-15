import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { 
  Package, 
  Smartphone, 
  MapPin, 
  Users, 
  Clock, 
  Shield,
  MessageCircle,
  TrendingUp,
  Truck,
  Zap,
  Bot,
  Award,
  Globe,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: Package,
      title: "CargoPool Revolution",
      description: "AI-powered route optimization connects shipments going to the same destination. Save up to 45% while maintaining express speeds through intelligent cargo consolidation.",
      badge: "Save 45%",
      gradient: "from-primary to-primary-light",
      stats: "₦2M+ saved for customers"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Commerce",
      description: "Send packages directly through WhatsApp without downloading any app. Perfect for traders, market sellers, and businesses without smartphones.",
      badge: "No App Required",
      gradient: "from-secondary to-primary",
      stats: "70% faster booking"
    },
    {
      icon: MapPin,
      title: "Predictive Tracking",
      description: "Real-time GPS tracking enhanced with machine learning for accurate ETAs. Get delivery predictions 95% more accurate than traditional methods.",
      badge: "95% Accurate",
      gradient: "from-accent to-secondary",
      stats: "Real-time updates"
    }
  ];

  const supportingFeatures = [
    {
      icon: Clock,
      title: "Guaranteed Windows",
      description: "Priority corridors with guaranteed delivery slots",
      badge: "Express"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for Nigerian mobile networks",
      badge: "Offline Ready"
    },
    {
      icon: Shield,
      title: "End-to-End Security",
      description: "Insurance, OTP verification, photo proofs",
      badge: "100% Protected"
    },
    {
      icon: Bot,
      title: "AI Route Optimization",
      description: "Smart algorithms for cost and time efficiency",
      badge: "Smart Tech"
    },
    {
      icon: Award,
      title: "LASRRA Licensed",
      description: "Fully licensed and regulated operations",
      badge: "Licensed"
    },
    {
      icon: Globe,
      title: "25+ Cities Connected",
      description: "Growing network across Nigeria",
      badge: "Expanding"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-primary-subtle/20 to-secondary-subtle/20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20 px-6 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Why Leading Businesses Choose Huzex
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Built for Nigerian <br />
            <span className="text-gradient-premium">Business Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            From market traders to scaling e-commerce stores, our platform combines cutting-edge 
            technology with deep understanding of Nigerian logistics challenges.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group floating-card border-0 bg-card/80 backdrop-blur-sm overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <Badge className="bg-gradient-to-r from-accent to-secondary text-white">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature.stats}
                      </Badge>
                      <EnhancedButton
                        size="sm"
                        variant="ghost"
                        className="group/btn text-primary hover:text-primary hover:bg-primary/10"
                      >
                        Learn More
                        <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supporting Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {supportingFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group floating-card border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-3 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                    {feature.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative">
          <div className="gradient-border">
            <div className="gradient-border-content text-center">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl p-4">
                    <Truck className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-premium">
                  Ready to Transform Your Logistics?
                </h3>
                <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                  Join over 1,500 businesses already shipping smarter with Huzex Express. 
                  Experience the future of Nigerian logistics today.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {[
                    { icon: Users, value: "1,500+", label: "Active Businesses" },
                    { icon: Package, value: "25K+", label: "Monthly Shipments" },
                    { icon: Award, value: "4.9★", label: "Customer Rating" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <EnhancedButton size="lg" variant="gradient" asChild>
                    <Link to="/send">
                      <Package className="mr-2 h-5 w-5" />
                      Start Shipping Today
                    </Link>
                  </EnhancedButton>
                  <EnhancedButton size="lg" variant="outline" asChild>
                    <Link to="/cargopool">
                      <Zap className="mr-2 h-5 w-5" />
                      Try CargoPool
                    </Link>
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};