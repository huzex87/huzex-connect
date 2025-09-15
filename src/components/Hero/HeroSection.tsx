import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { TrustSignals } from "@/components/ui/trust-badge";
import { ArrowRight, Package, Truck, Clock, Shield, MapPin, Zap, Sparkles, Globe, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-logistics.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-secondary/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white py-20">
        {/* Premium Badge with Animation */}
        <div className="animate-fade-in-up mb-8">
          <Badge className="glass-card text-white border-white/30 hover:bg-white/20 px-6 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            Nigeria's #1 Logistics Innovation Platform
          </Badge>
        </div>

        {/* Main Heading with Enhanced Typography */}
        <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
            Ship Your 
            <br />
            <span className="text-gradient-premium inline-block animate-bounce-subtle">Business</span>
            <br />
            <span className="text-accent">Forward</span>
          </h1>
        </div>

        {/* Enhanced Subheading */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.4s' }}>
          <p className="text-xl md:text-2xl lg:text-3xl mb-6 text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
            Revolutionary <span className="font-semibold text-accent">CargoPool</span> technology meets 
            <span className="font-semibold text-secondary"> same-day delivery</span>. 
            <br />Smart logistics for Nigerian businesses of tomorrow.
          </p>
        </div>

        {/* Enhanced Stats with Glass Effect */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.6s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Clock, value: "6hrs", label: "Average Delivery", gradient: "from-accent to-secondary" },
              { icon: Shield, value: "99.2%", label: "Success Rate", gradient: "from-secondary to-primary" },
              { icon: Globe, value: "25+", label: "Cities Connected", gradient: "from-primary to-accent" },
              { icon: Award, value: "#1", label: "Customer Choice", gradient: "from-accent to-primary" }
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 group hover-lift">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-black mb-2 text-white group-hover:text-accent transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <EnhancedButton 
              size="xl" 
              variant="glow"
              className="group bg-gradient-to-r from-accent via-secondary to-primary hover:shadow-elegant"
              asChild
            >
              <Link to="/send">
                <Package className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Send Package Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </EnhancedButton>
            
            <EnhancedButton 
              size="xl" 
              variant="glass"
              className="border-2 border-white/30 hover:border-white/50"
              asChild
            >
              <Link to="/cargopool">
                <Truck className="mr-3 h-6 w-6" />
                Explore CargoPool
              </Link>
            </EnhancedButton>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '1s' }}>
          <TrustSignals />
        </div>

        {/* Enhanced Features with Better Visual Hierarchy */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Same/Next Day",
                description: "Express delivery on priority corridors with guaranteed time slots",
                gradient: "from-accent to-secondary"
              },
              {
                icon: MapPin,
                title: "Real-Time Tracking", 
                description: "AI-powered live tracking with predictive delivery windows",
                gradient: "from-secondary to-primary"
              },
              {
                icon: Shield,
                title: "100% Secure",
                description: "End-to-end insurance with photo proofs and OTP verification",
                gradient: "from-primary to-accent"
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="glass-card rounded-2xl p-6 mb-4 group-hover:bg-white/15 transition-all duration-500">
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce-subtle">
        <div className="glass-card rounded-full p-3">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center relative overflow-hidden">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};