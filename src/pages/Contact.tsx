import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Send,
  Building,
  Users,
  Truck,
  HeadphonesIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our support team",
      contact: "+234 800 HUZEX (48939)",
      action: "tel:+2348004893927",
      available: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM",
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Get instant support via WhatsApp",
      contact: "+234 901 HUZEX (48939)",
      action: "https://wa.me/2349014893927",
      available: "24/7 Automated + Business Hours Live",
      color: "text-secondary"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@huzexexpress.com.ng",
      action: "mailto:support@huzexexpress.com.ng",
      available: "Response within 6 hours",
      color: "text-accent"
    }
  ];

  const offices = [
    {
      city: "Lagos",
      address: "Victoria Island Business District",
      details: "Plot 15, Karimu Kotun Street\nVictoria Island, Lagos",
      phone: "+234 901 000 0001",
      hours: "Mon-Fri: 8AM-6PM"
    },
    {
      city: "Abuja",
      address: "Central Business District",
      details: "Suite 205, Utako Plaza\nJabi, FCT Abuja",
      phone: "+234 901 000 0002", 
      hours: "Mon-Fri: 8AM-6PM"
    },
    {
      city: "Port Harcourt",
      address: "Government Reserved Area",
      details: "12 Aba Road, GRA Phase 2\nPort Harcourt, Rivers",
      phone: "+234 901 000 0003",
      hours: "Mon-Fri: 8AM-6PM"
    }
  ];

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "shipping", label: "Shipping Support" },
    { value: "tracking", label: "Package Tracking" },
    { value: "billing", label: "Billing & Payments" },
    { value: "partnership", label: "Business Partnership" },
    { value: "rider", label: "Rider Application" },
    { value: "complaint", label: "Complaint" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We're Here to <span className="text-primary">Help</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have questions about our services? Need support with an existing delivery? 
            Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => setFormData({...formData, category: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            {contactMethods.map((method, idx) => {
              const IconComponent = method.icon;
              return (
                <Card key={idx} className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-3`}>
                        <IconComponent className={`h-6 w-6 ${method.color}`} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{method.title}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <div>
                          <a 
                            href={method.action}
                            className="font-medium text-primary hover:underline"
                          >
                            {method.contact}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{method.available}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* FAQ Link */}
            <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
              <CardContent className="p-6 text-center">
                <HeadphonesIcon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Quick Answers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check our FAQ section for instant answers to common questions.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/help">View FAQ</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Offices</h2>
            <p className="text-muted-foreground">
              Visit us at any of our locations across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <Card key={idx} className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{office.city}</span>
                  </CardTitle>
                  <CardDescription>{office.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm whitespace-pre-line">{office.details}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{office.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Partnerships */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Enterprise Solutions</h3>
              <p className="text-muted-foreground mb-6">
                Custom logistics solutions for large businesses, e-commerce platforms, and enterprises.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:enterprise@huzexexpress.com.ng">
                  Contact Enterprise Team
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Join Our Network</h3>
              <p className="text-muted-foreground mb-6">
                Become a rider, agent, or partner. Grow your business with Huzex Express.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="/rider">
                  Explore Opportunities
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};