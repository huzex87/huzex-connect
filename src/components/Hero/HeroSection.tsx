import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Truck, Clock, Shield, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-logistics.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white py-20">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
          <Zap className="h-4 w-4 mr-2" />
          Nigeria's Fastest Growing Logistics Platform
        </Badge>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Ship Your <span className="text-accent">Business</span>
          <br />
          Forward
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
          Lightning-fast intercity & interstate logistics for Nigerian SMEs, traders, and e-commerce sellers. 
          Same-day delivery, real-time tracking, and CargoPool savings.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-1">24hrs</div>
            <div className="text-sm text-white/80">Max Delivery Time</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-1">95%</div>
            <div className="text-sm text-white/80">On-Time Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-1">150+</div>
            <div className="text-sm text-white/80">Active Riders</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-1">3</div>
            <div className="text-sm text-white/80">Major Cities</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold group"
            asChild
          >
            <Link to="/send">
              Send a Package
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 text-lg font-semibold"
            asChild
          >
            <Link to="/track">
              Track Order
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">Same/Next Day</h3>
            <p className="text-white/80 text-sm">Express delivery on priority corridors</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">Real-Time Tracking</h3>
            <p className="text-white/80 text-sm">Live updates from pickup to delivery</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">100% Secure</h3>
            <p className="text-white/80 text-sm">Insurance coverage and delivery proof</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};