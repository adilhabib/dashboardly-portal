
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
import Layout from "./components/Layout";
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
import CustomerCredit from "./pages/CustomerCredit";

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
            
            {/* Protected routes with Layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-list" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderList />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-detail" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Customer />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer-credit" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerCredit />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reviews />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/foods" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Foods />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/food-detail" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <FoodDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Categories />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer-detail" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Wallet />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
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
