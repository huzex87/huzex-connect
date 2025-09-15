import { HeroSection } from "@/components/Hero/HeroSection";
import { FeaturesSection } from "@/components/Features/FeaturesSection";
import { CargoPoolShowcase } from "@/components/CargoPool/CargoPoolShowcase";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Link } from "react-router-dom";
import { Package, Truck, BarChart3, Users, Zap, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Quick Actions for Authenticated Users */}
      {user && (
        <section className="py-16 bg-gradient-to-br from-primary-subtle/30 via-background to-secondary-subtle/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Zap className="h-4 w-4 mr-2" />
                Welcome back, {profile?.name || 'User'}!
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Quick <span className="text-gradient-primary">Actions</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access your most used features instantly. Ship smarter, track better, grow faster.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { 
                  icon: Package, 
                  title: "Send Package", 
                  description: "Quick shipment creation",
                  href: "/send", 
                  variant: "gradient" as const,
                  color: "text-primary" 
                },
                { 
                  icon: Truck, 
                  title: "CargoPool", 
                  description: "Share routes, save costs",
                  href: "/cargopool", 
                  variant: "success" as const,
                  color: "text-secondary" 
                },
                { 
                  icon: MapPin, 
                  title: "Track Orders", 
                  description: "Real-time package tracking",
                  href: "/track", 
                  variant: "outline" as const,
                  color: "text-accent" 
                },
                { 
                  icon: BarChart3, 
                  title: "Dashboard", 
                  description: "Analytics & insights",
                  href: profile?.role === 'rider' ? '/rider-dashboard' : '/dashboard', 
                  variant: "outline" as const,
                  color: "text-primary" 
                },
              ].map((action, index) => (
                <Card key={index} className="group floating-card border-0 bg-card/60 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className={`${action.color} mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-10 w-10 mx-auto" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {action.description}
                      </p>
                      <EnhancedButton 
                        asChild 
                        size="sm" 
                        variant={action.variant}
                        className="w-full group-hover:shadow-lg"
                      >
                        <Link to={action.href}>
                          Get Started
                        </Link>
                      </EnhancedButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {profile?.role === 'admin' && (
                <Card className="group floating-card border-0 bg-gradient-to-br from-accent/10 to-primary/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-accent mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 mx-auto" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Admin Panel</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage platform operations
                    </p>
                    <EnhancedButton 
                      asChild 
                      size="sm" 
                      variant="premium"
                      className="w-full"
                    >
                      <Link to="/admin">
                        Manage Platform
                      </Link>
                    </EnhancedButton>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}
      
      <CargoPoolShowcase />
      <FeaturesSection />
    </div>
  );
};

export default Index;
