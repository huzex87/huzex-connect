import { HeroSection } from "@/components/Hero/HeroSection";
import { FeaturesSection } from "@/components/Features/FeaturesSection";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Truck, BarChart3, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Quick Actions for Authenticated Users */}
      {user && (
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Send Package</h3>
                  <Button asChild size="sm">
                    <Link to="/send">Send Now</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Truck className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Track Orders</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/track">Track</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Dashboard</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to={profile?.role === 'rider' ? '/rider-dashboard' : '/dashboard'}>
                      View
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {profile?.role === 'admin' && (
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Admin Panel</h3>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin">Manage</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}
      
      <FeaturesSection />
    </div>
  );
};

export default Index;
