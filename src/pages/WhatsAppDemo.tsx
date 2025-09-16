import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Package, 
  MapPin, 
  Truck, 
  Phone,
  Bot,
  User
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
}

export const WhatsAppDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentFlow, setCurrentFlow] = useState("menu");
  const [orderData, setOrderData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    addBotMessage(
      "👋 Welcome to *Huzex Express*!\n\nI'm here to help you send packages across Nigeria. What would you like to do today?",
      ["📦 Send Package", "📍 Track Delivery", "🚛 Apply as Rider", "💬 Support"]
    );
  }, []);

  const addBotMessage = (text: string, options?: string[]) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: true,
      timestamp: new Date(),
      options
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    processUserInput(userInput);
    setUserInput("");
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    processUserInput(option);
  };

  const processUserInput = (input: string) => {
    setTimeout(() => {
      switch (currentFlow) {
        case "menu":
          handleMenuSelection(input);
          break;
        case "send_package":
          handleSendPackageFlow(input);
          break;
        case "track_delivery":
          handleTrackFlow(input);
          break;
        case "apply_rider":
          handleRiderApplication(input);
          break;
        default:
          addBotMessage("I'm not sure how to help with that. Let me show you the main menu again.", 
            ["📦 Send Package", "📍 Track Delivery", "🚛 Apply as Rider", "💬 Support"]);
          setCurrentFlow("menu");
      }
    }, 1000);
  };

  const handleMenuSelection = (input: string) => {
    if (input.includes("Send Package") || input.includes("send") || input.includes("package")) {
      setCurrentFlow("send_package");
      setOrderData({ step: "pickup" });
      addBotMessage(
        "📦 *Send Package*\n\nGreat! I'll help you send your package. Let's start with the pickup location.\n\nWhich city should we pick up from?",
        ["🏙️ Katsina", "🏛️ Abuja", "🏭 Kano", "🏪 Kaduna", "📍 Other"]
      );
    } else if (input.includes("Track") || input.includes("track")) {
      setCurrentFlow("track_delivery");
      addBotMessage(
        "📍 *Track Delivery*\n\nPlease share your Order ID (starts with HX-)\n\nExample: HX-2025-123456"
      );
    } else if (input.includes("Apply") || input.includes("rider") || input.includes("Rider")) {
      setCurrentFlow("apply_rider");
      setOrderData({ step: "name" });
      addBotMessage(
        "🚛 *Rider Application*\n\nExcellent! We're always looking for reliable riders.\n\nWhat's your full name?"
      );
    } else if (input.includes("Support") || input.includes("support")) {
      addBotMessage(
        "💬 *Customer Support*\n\nI'm connecting you to our support team.\n\n📞 Call: +234 800 HUZEX (48939)\n📧 Email: support@huzexexpress.com.ng\n\nOr continue chatting here for common questions.",
        ["📦 Send Package", "📍 Track Delivery", "🚛 Apply as Rider"]
      );
      setCurrentFlow("menu");
    } else {
      addBotMessage(
        "I can help you with:\n\n📦 Send packages across Nigeria\n📍 Track your deliveries\n🚛 Apply to become a rider\n💬 Get support\n\nWhat would you like to do?",
        ["📦 Send Package", "📍 Track Delivery", "🚛 Apply as Rider", "💬 Support"]
      );
    }
  };

  const handleSendPackageFlow = (input: string) => {
    const step = orderData.step;
    
    if (step === "pickup") {
      setOrderData({ ...orderData, pickup: input, step: "dropoff" });
      addBotMessage(
        `✅ Pickup: ${input}\n\nNow, where should we deliver your package?`,
        ["🏙️ Katsina", "🏛️ Abuja", "🏭 Kano", "🏪 Kaduna", "📍 Other"]
      );
    } else if (step === "dropoff") {
      setOrderData({ ...orderData, dropoff: input, step: "item" });
      addBotMessage(
        `✅ Delivery: ${input}\n\nWhat are you sending? Please describe your package.\n\nExample: "Clothing items" or "Electronics - Laptop"`
      );
    } else if (step === "item") {
      setOrderData({ ...orderData, item: input, step: "weight" });
      addBotMessage(
        `✅ Item: ${input}\n\nWhat's the approximate weight in kg?\n\nExample: "2.5" or "5.0"`
      );
    } else if (step === "weight") {
      setOrderData({ ...orderData, weight: input, step: "speed" });
      addBotMessage(
        `✅ Weight: ${input}kg\n\nHow fast do you need delivery?`,
        ["⚡ Same Day (₦8,500)", "🚚 Next Day (₦5,500)", "📦 Economy (₦3,500)"]
      );
    } else if (step === "speed") {
      const speed = input.includes("Same Day") ? "Same Day" : input.includes("Next Day") ? "Next Day" : "Economy";
      setOrderData({ ...orderData, speed, step: "payment" });
      addBotMessage(
        `✅ Speed: ${speed}\n\nHow would you like to pay?`,
        ["💳 Pay Now (Card)", "💵 Pay on Delivery"]
      );
    } else if (step === "payment") {
      const orderId = `HX-2025-${Math.floor(Math.random() * 900000) + 100000}`;
      addBotMessage(
        `🎉 *Order Created Successfully!*\n\n📋 Order ID: *${orderId}*\n📍 From: ${orderData.pickup}\n📍 To: ${orderData.dropoff}\n📦 Item: ${orderData.item}\n⚖️ Weight: ${orderData.weight}kg\n⚡ Speed: ${orderData.speed}\n💳 Payment: ${input}\n\n🚛 Your package will be picked up within 2-4 hours.\n📱 You'll receive SMS updates.\n\nAnything else I can help with?`,
        ["📍 Track This Order", "📦 Send Another Package", "💬 Main Menu"]
      );
      setCurrentFlow("menu");
      setOrderData({});
    }
  };

  const handleTrackFlow = (input: string) => {
    if (input.match(/HX-\d{4}-\d{6}/)) {
      addBotMessage(
        `📍 *Order Status: ${input}*\n\n✅ Status: En Route\n📍 From: Katsina (GRA)\n📍 To: Abuja (Central)\n📦 Item: Electronics\n🚛 Rider: Ibrahim M.\n📞 Rider Phone: +234 901 234 5678\n⏰ ETA: Today 4:00 PM\n\n🔗 Live Tracking: https://track.huzex/${input}\n\nYour package is on the way!`,
        ["📞 Call Rider", "📦 Send Another Package", "💬 Main Menu"]
      );
    } else {
      addBotMessage(
        "❌ Please enter a valid Order ID.\n\nFormat: HX-YYYY-XXXXXX\nExample: HX-2025-123456\n\nTry again:"
      );
    }
    setCurrentFlow("menu");
  };

  const handleRiderApplication = (input: string) => {
    const step = orderData.step;
    
    if (step === "name") {
      setOrderData({ ...orderData, name: input, step: "phone" });
      addBotMessage(
        `✅ Name: ${input}\n\nWhat's your phone number?`
      );
    } else if (step === "phone") {
      setOrderData({ ...orderData, phone: input, step: "city" });
      addBotMessage(
        `✅ Phone: ${input}\n\nWhich city are you based in?`,
        ["🏙️ Katsina", "🏛️ Abuja", "🏭 Kano", "📍 Other"]
      );
    } else if (step === "city") {
      setOrderData({ ...orderData, city: input, step: "vehicle" });
      addBotMessage(
        `✅ City: ${input}\n\nWhat type of vehicle do you have?`,
        ["🏍️ Motorcycle", "🚗 Car", "🚐 Van", "🚛 Truck"]
      );
    } else if (step === "vehicle") {
      const appId = `APP-${Math.floor(Math.random() * 900000) + 100000}`;
      addBotMessage(
        `🎉 *Application Submitted!*\n\n📋 Application ID: *${appId}*\n👤 Name: ${orderData.name}\n📞 Phone: ${orderData.phone}\n📍 City: ${orderData.city}\n🚗 Vehicle: ${input}\n\n✅ Our team will review your application within 24 hours.\n📞 We'll call you for the next steps.\n\nThank you for your interest in joining Huzex Express!`,
        ["📦 Send Package", "📍 Track Delivery", "💬 Main Menu"]
      );
      setCurrentFlow("menu");
      setOrderData({});
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            WhatsApp <span className="text-secondary">Commerce</span> Bot
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Experience our AI-powered WhatsApp bot - perfect for traders without smartphones
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="text-secondary border-secondary">
              <Bot className="h-4 w-4 mr-2" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="text-primary border-primary">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Native
            </Badge>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-secondary/10 border-b">
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-secondary rounded-full p-2">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Huzex Express Bot</h3>
                  <p className="text-sm text-muted-foreground">Online • Typically replies instantly</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/10 to-muted/5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isBot
                          ? "bg-white border shadow-sm"
                          : "bg-secondary text-white"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isBot && (
                          <Bot className="h-4 w-4 text-secondary mt-1 shrink-0" />
                        )}
                        <div className="space-y-2">
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          {message.options && (
                            <div className="grid gap-2">
                              {message.options.map((option, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="justify-start text-left h-auto p-2 text-xs"
                                  onClick={() => handleOptionClick(option)}
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        {!message.isBot && (
                          <User className="h-4 w-4 text-white mt-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4 bg-muted/5">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90"
                    disabled={!userInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="mt-6 bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <MessageCircle className="h-12 w-12 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Real WhatsApp Integration</h3>
                  <p className="text-muted-foreground mb-4">
                    This is a demo of our WhatsApp Commerce bot. In production, users interact 
                    via WhatsApp Business API with the same seamless experience.
                  </p>
                  <Badge variant="outline" className="text-secondary border-secondary">
                    <Phone className="h-4 w-4 mr-2" />
                    +234 800 HUZEX (48939)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};