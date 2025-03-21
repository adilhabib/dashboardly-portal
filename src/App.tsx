
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Foods from "./pages/Foods";
import FoodDetail from "./pages/FoodDetail";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import Customer from "./pages/Customer";
import CustomerDetail from "./pages/CustomerDetail";
import Analytics from "./pages/Analytics";
import Reviews from "./pages/Reviews";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import Wallet from "./pages/Wallet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-list" 
              element={
                <ProtectedRoute>
                  <OrderList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-detail" 
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute>
                  <Customer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/foods" 
              element={
                <ProtectedRoute>
                  <Foods />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/food-detail" 
              element={
                <ProtectedRoute>
                  <FoodDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer-detail" 
              element={
                <ProtectedRoute>
                  <CustomerDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
