
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Foods from "./pages/Foods";
import FoodDetail from "./pages/FoodDetail";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import Customer from "./pages/Customer";
import CustomerDetail from "./pages/CustomerDetail";
import Analytics from "./pages/Analytics";
import Reviews from "./pages/Reviews";
import Wallet from "./pages/Wallet";
import Categories from "./pages/Categories";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
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
              path="/categories" 
              element={
                <ProtectedRoute>
                  <Categories />
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
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
