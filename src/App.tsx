import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import Index from "./pages/Index";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { RiderDashboard } from "./pages/RiderDashboard";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { SendPackage } from "./pages/SendPackage";
import { TrackOrder } from "./pages/TrackOrder";
import { WhatsAppDemo } from "./pages/WhatsAppDemo";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RiderApplication } from "./pages/RiderApplication";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { Help } from "./pages/Help";
import { UserProfile } from "./pages/UserProfile";
import { NotificationCenter } from "./pages/NotificationCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rider-dashboard" element={<RiderDashboard />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/send" element={<SendPackage />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/whatsapp" element={<WhatsAppDemo />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/rider" element={<RiderApplication />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/notifications" element={<NotificationCenter />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
