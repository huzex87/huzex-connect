import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load all route components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth").then(module => ({ default: module.Auth })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const RiderDashboard = lazy(() => import("./pages/RiderDashboard").then(module => ({ default: module.RiderDashboard })));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess").then(module => ({ default: module.PaymentSuccess })));
const SendPackage = lazy(() => import("./pages/SendPackage").then(module => ({ default: module.SendPackage })));
const TrackOrder = lazy(() => import("./pages/TrackOrder").then(module => ({ default: module.TrackOrder })));
const WhatsAppDemo = lazy(() => import("./pages/WhatsAppDemo").then(module => ({ default: module.WhatsAppDemo })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const RiderApplication = lazy(() => import("./pages/RiderApplication").then(module => ({ default: module.RiderApplication })));
const Pricing = lazy(() => import("./pages/Pricing").then(module => ({ default: module.Pricing })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.Contact })));
const Help = lazy(() => import("./pages/Help").then(module => ({ default: module.Help })));
const UserProfile = lazy(() => import("./pages/UserProfile").then(module => ({ default: module.UserProfile })));
const CargoPool = lazy(() => import("./pages/CargoPool").then(module => ({ default: module.CargoPool })));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter").then(module => ({ default: module.NotificationCenter })));
const NotFound = lazy(() => import("./pages/NotFound"));

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
              <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>}>
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
                  <Route path="/cargopool" element={<CargoPool />} />
                  <Route path="/notifications" element={<NotificationCenter />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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
