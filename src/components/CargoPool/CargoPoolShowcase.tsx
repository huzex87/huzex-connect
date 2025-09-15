import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign, 
  Users, 
  Clock,
  ArrowRight,
  Zap,
  TrendingDown
} from "lucide-react"
import { Link } from "react-router-dom"

export const CargoPoolShowcase = () => {
  const mockRoutes = [
    {
      id: "1",
      route: "Lagos → Abuja",
      departure: "Tomorrow 9:00 AM",
      capacity: "250kg available",
      price: "₦1,200/kg",
      savings: "Save 40%",
      bookings: "3 bookings",
      driver: "Adebayo M.",
      rating: 4.9,
      eta: "6-8 hours",
      trending: true
    },
    {
      id: "2", 
      route: "Abuja → Port Harcourt",
      departure: "Today 2:00 PM",
      capacity: "180kg available", 
      price: "₦1,400/kg",
      savings: "Save 35%",
      bookings: "5 bookings",
      driver: "Chioma O.",
      rating: 4.8,
      eta: "8-10 hours",
      trending: false
    },
    {
      id: "3",
      route: "Lagos → Kano", 
      departure: "Dec 18, 7:00 AM",
      capacity: "320kg available",
      price: "₦1,800/kg", 
      savings: "Save 45%",
      bookings: "2 bookings",
      driver: "Ibrahim S.",
      rating: 5.0,
      eta: "12-14 hours",
      trending: true
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-subtle via-secondary-subtle to-accent-subtle">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingDown className="h-4 w-4 mr-2" />
            Save up to 45% with CargoPool
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Share Routes, <span className="text-gradient-premium">Split Costs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join other businesses shipping on the same route. Our AI matches your packages 
            with available cargo space, reducing costs while maintaining speed and security.
          </p>
        </div>

        {/* Live Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockRoutes.map((route) => (
            <Card 
              key={route.id}
              className="group floating-card border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 relative overflow-hidden"
            >
              {route.trending && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-accent to-secondary text-white animate-pulse-glow">
                    <Zap className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-bold text-gradient-primary">
                    {route.route}
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {route.savings}
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {route.departure}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Capacity & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Weight className="h-4 w-4 text-primary" />
                    <span className="font-medium">{route.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="font-bold text-accent">{route.price}</span>
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{route.bookings}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{route.eta}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⭐ {route.rating}</span>
                  </div>
                </div>
                
                {/* Driver Info */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs text-white font-bold">
                      {route.driver.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{route.driver}</span>
                  </div>
                  <EnhancedButton 
                    size="sm" 
                    variant="gradient"
                    className="group-hover:scale-105 transition-transform"
                    asChild
                  >
                    <Link to="/cargopool">
                      Book <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </EnhancedButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="gradient-border mb-12">
          <div className="gradient-border-content">
            <h3 className="text-2xl font-bold text-center mb-8">How CargoPool Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Select Route",
                  description: "Choose from available routes or create your own shipment request",
                  icon: MapPin
                },
                {
                  step: "2", 
                  title: "AI Matching",
                  description: "Our algorithm matches your package with optimal routes and trusted drivers",
                  icon: Zap
                },
                {
                  step: "3",
                  title: "Save & Ship",
                  description: "Enjoy reduced costs while maintaining premium speed and security",
                  icon: TrendingDown
                }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <EnhancedButton size="lg" variant="gradient" asChild>
              <Link to="/cargopool">
                Explore Routes <Truck className="ml-2 h-5 w-5" />
              </Link>
            </EnhancedButton>
            <EnhancedButton size="lg" variant="outline" asChild>
              <Link to="/send">
                Create Shipment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </EnhancedButton>
          </div>
        </div>
      </div>
    </section>
  )
}