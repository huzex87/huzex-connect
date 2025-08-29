import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  Package, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle,
  HelpCircle,
  BookOpen,
  Video,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

export const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      icon: Package,
      title: "Sending Packages",
      color: "text-primary",
      faqs: [
        {
          question: "How do I send a package with Huzex Express?",
          answer: "You can send a package through our website, mobile app, or WhatsApp bot. Simply provide pickup and delivery addresses, package details, choose your delivery speed, and make payment. We'll handle the rest!"
        },
        {
          question: "What can I send through Huzex Express?",
          answer: "You can send most legal items including documents, clothing, electronics, food items, and business goods. We don't accept hazardous materials, illegal items, or perishables that require special handling."
        },
        {
          question: "What are the size and weight limits?",
          answer: "Standard packages can be up to 30kg and 100cm x 80cm x 60cm. For larger items, contact our team for custom shipping solutions."
        },
        {
          question: "How much does shipping cost?",
          answer: "Pricing starts from ₦3,500 for economy delivery (2-3 days), ₦5,500 for next-day delivery, and ₦8,500 for same-day delivery. Prices vary based on route, weight, and dimensions."
        }
      ]
    },
    {
      icon: MapPin,
      title: "Tracking & Delivery",
      color: "text-secondary",
      faqs: [
        {
          question: "How do I track my package?",
          answer: "Use your order ID (starts with HX-) on our tracking page, WhatsApp bot, or click the tracking link sent via SMS. You'll see real-time updates and GPS location of your package."
        },
        {
          question: "What if I miss my delivery?",
          answer: "We'll attempt delivery 3 times. You'll be notified before each attempt via SMS/WhatsApp. You can also reschedule delivery or arrange pickup from our nearest hub."
        },
        {
          question: "Can I change my delivery address?",
          answer: "Yes, you can change the delivery address before pickup or while the package is in transit. Contact our support team or use the self-service options in your tracking link."
        },
        {
          question: "Do you deliver on weekends?",
          answer: "Yes, we deliver Monday to Saturday. Sunday deliveries are available for same-day packages in Lagos and Abuja at an additional cost."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      color: "text-accent",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept bank transfers, debit/credit cards (via Paystack), mobile money, and pay-on-delivery (cash). Payment is required before pickup for prepaid options."
        },
        {
          question: "Can I pay when my package is delivered?",
          answer: "Yes, pay-on-delivery is available for most routes. The recipient pays the delivery fee plus a small COD charge when the package arrives."
        },
        {
          question: "Do you offer discounts for bulk shipping?",
          answer: "Yes! We offer 5% discount for 10-50 packages/month, 10% for 51-200 packages, and 15% for 200+ packages. Contact our sales team for enterprise pricing."
        },
        {
          question: "Can I get a refund if my package is delayed?",
          answer: "If we fail to deliver within our promised timeframe due to our fault, you're eligible for a full refund or free re-delivery. Claims must be made within 24 hours of the promised delivery time."
        }
      ]
    },
    {
      icon: Truck,
      title: "For Riders & Partners",
      color: "text-primary",
      faqs: [
        {
          question: "How do I become a Huzex Express rider?",
          answer: "Apply through our rider application form, provide required documents (ID, driver's license, vehicle registration), pass our background check, and complete our onboarding training."
        },
        {
          question: "What are the requirements to be a rider?",
          answer: "You need a valid driver's license, own vehicle (motorcycle, car, van, or truck), smartphone, good driving record, and pass our verification process."
        },
        {
          question: "How much can I earn as a rider?",
          answer: "Earnings vary based on location, delivery volume, and hours worked. On average, active riders earn ₦150,000 - ₦400,000 per month. We also offer performance bonuses and incentives."
        },
        {
          question: "Do you provide insurance for riders?",
          answer: "Yes, all active riders are covered under our comprehensive insurance policy while on duty. This includes vehicle damage, third-party liability, and medical coverage."
        }
      ]
    }
  ];

  const quickLinks = [
    {
      icon: Package,
      title: "Send a Package",
      description: "Start shipping in minutes",
      link: "/send",
      color: "from-primary/10 to-primary/5"
    },
    {
      icon: MapPin,
      title: "Track Package", 
      description: "Get real-time updates",
      link: "/track",
      color: "from-secondary/10 to-secondary/5"
    },
    {
      icon: Phone,
      title: "Contact Support",
      description: "Speak to our team",
      link: "/contact",
      color: "from-accent/10 to-accent/5"
    },
    {
      icon: Truck,
      title: "Become a Rider",
      description: "Join our network",
      link: "/rider",
      color: "from-primary/10 to-secondary/5"
    }
  ];

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step guides",
      items: ["How to send a package", "Using our tracking system", "Mobile app walkthrough"]
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Detailed guides",
      items: ["API Documentation", "Integration guides", "Terms of service"]
    },
    {
      icon: BookOpen,
      title: "Best Practices",
      description: "Tips for success",
      items: ["Package preparation", "Addressing guidelines", "Cost optimization"]
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How can we <span className="text-primary">help</span> you?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="pl-12 pr-4 py-6 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link, idx) => {
            const IconComponent = link.icon;
            return (
              <Link key={idx} to={link.link}>
                <Card className="transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`bg-gradient-to-br ${link.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12 mb-16">
          {faqCategories.map((category, categoryIdx) => {
            const IconComponent = category.icon;
            return (
              <Card key={categoryIdx}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-2">
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.faqs.map((faq, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`${categoryIdx}-${faqIdx}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Resources */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-muted-foreground">
              Explore our guides, tutorials, and documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, idx) => {
              const IconComponent = resource.icon;
              return (
                <Card key={idx} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span>{resource.title}</span>
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Still Need Help */}
        <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link to="/contact">
                  Contact Support
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://wa.me/2349014893927" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                  <MessageCircle className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};