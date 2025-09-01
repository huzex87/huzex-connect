import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { lazy, Suspense } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const SendPackage = lazy(() => import("@/pages/SendPackage").then(module => ({ default: module.SendPackage })));
const TrackOrder = lazy(() => import("@/pages/TrackOrder").then(module => ({ default: module.TrackOrder })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then(module => ({ default: module.Dashboard })));
const Auth = lazy(() => import("@/pages/Auth").then(module => ({ default: module.Auth })));
const CargoPool = lazy(() => import("@/pages/CargoPool").then(module => ({ default: module.CargoPool })));
const RiderApplication = lazy(() => import("@/pages/RiderApplication").then(module => ({ default: module.RiderApplication })));
const RiderDashboard = lazy(() => import("@/pages/RiderDashboard").then(module => ({ default: module.RiderDashboard })));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const UserProfile = lazy(() => import("@/pages/UserProfile").then(module => ({ default: module.UserProfile })));
const NotificationCenter = lazy(() => import("@/pages/NotificationCenter").then(module => ({ default: module.NotificationCenter })));
const Contact = lazy(() => import("@/pages/Contact").then(module => ({ default: module.Contact })));
const Help = lazy(() => import("@/pages/Help").then(module => ({ default: module.Help })));
const Pricing = lazy(() => import("@/pages/Pricing").then(module => ({ default: module.Pricing })));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess").then(module => ({ default: module.PaymentSuccess })));
const WhatsAppDemo = lazy(() => import("@/pages/WhatsAppDemo").then(module => ({ default: module.WhatsAppDemo })));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/send" element={<SendPackage />} />
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/auth" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>} />
                  <Route path="/cargopool" element={<CargoPool />} />
                  <Route path="/rider" element={<RiderApplication />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/whatsapp" element={<WhatsAppDemo />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/rider-dashboard" element={<ProtectedRoute><RiderDashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
                  <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
