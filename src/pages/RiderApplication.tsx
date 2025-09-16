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
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  DollarSign,
  Clock,
  Star
} from "lucide-react";

export const RiderApplication = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    vehicleType: "",
    experience: "",
    availability: "",
    whyJoin: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-application', {
        body: {
          role: 'rider',
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          experience_years: parseInt(formData.experience.split('-')[0]) || 0,
          vehicle_type: formData.vehicleType
        }
      });

      if (error) {
        throw error;
      }

      if (data?.id) {
        setIsSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "We've received your application and will review it within 24-48 hours.",
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const benefits = [
    { icon: DollarSign, title: "Competitive Earnings", description: "Earn ₦150,000 - ₦300,000 monthly" },
    { icon: Clock, title: "Flexible Schedule", description: "Work when you want, where you want" },
    { icon: Star, title: "Performance Bonuses", description: "Extra rewards for excellent service" }
  ];

  const cities = [
    "Katsina",
    "Abuja", 
    "Kano",
    "Kaduna"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-muted/20 py-8 flex items-center">
        <div className="container max-w-2xl">
          <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
                  <p className="text-muted-foreground">
                    Thank you for your interest in joining Huzex Express as a rider.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 text-left">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    What's Next?
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                      <div>
                        <p className="font-medium">Application Review</p>
                        <p className="text-muted-foreground">We'll review your application within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                      <div>
                        <p className="font-medium">Phone Interview</p>
                        <p className="text-muted-foreground">Brief phone call to discuss the opportunity</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                      <div>
                        <p className="font-medium">Onboarding</p>
                        <p className="text-muted-foreground">Document verification and app setup</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                      <div>
                        <p className="font-medium">Start Earning</p>
                        <p className="text-muted-foreground">Begin accepting delivery requests</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Submit Another Application
                  </Button>
                  <Button asChild>
                    <a href="/">Return Home</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Become a <span className="text-primary">Rider</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Join Nigeria's fastest growing logistics network and start earning today
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Rider Application</span>
            </CardTitle>
            <CardDescription>
              Fill out this form to join our network of professional riders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234 800 123 4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Base City *</Label>
                    <Select onValueChange={(value) => handleInputChange('city', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vehicle & Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Vehicle & Experience</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('vehicleType', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
                        <SelectItem value="car">🚗 Car</SelectItem>
                        <SelectItem value="van">🚐 Van</SelectItem>
                        <SelectItem value="truck">🚛 Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Select onValueChange={(value) => handleInputChange('experience', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select onValueChange={(value) => handleInputChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
                        <SelectItem value="part-time">Part-time (20-40 hours/week)</SelectItem>
                        <SelectItem value="weekends">Weekends only</SelectItem>
                        <SelectItem value="flexible">Flexible schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Why Join Huzex Express?</h3>
                <div className="space-y-2">
                  <Label htmlFor="whyJoin">Tell us why you want to join our team (Optional)</Label>
                  <Textarea
                    id="whyJoin"
                    value={formData.whyJoin}
                    onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                    placeholder="Share your motivation and what makes you a great fit for Huzex Express..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Requirements Notice */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                    Requirements
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Valid driver's license</li>
                    <li>• Vehicle registration and insurance</li>
                    <li>• Smartphone with internet access</li>
                    <li>• Clean driving record</li>
                    <li>• Must be 18 years or older</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={!formData.fullName || !formData.phone || !formData.city || !formData.vehicleType || !formData.experience || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};