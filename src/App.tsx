import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import Index from "./pages/Index";
import { SendPackage } from "./pages/SendPackage";
import { TrackOrder } from "./pages/TrackOrder";
import { WhatsAppDemo } from "./pages/WhatsAppDemo";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RiderApplication } from "./pages/RiderApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/send" element={<SendPackage />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/whatsapp" element={<WhatsAppDemo />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/rider" element={<RiderApplication />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
