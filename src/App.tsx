
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/order-list" element={<Dashboard />} />
          <Route path="/order-detail" element={<Dashboard />} />
          <Route path="/customer" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/reviews" element={<Dashboard />} />
          <Route path="/foods" element={<Dashboard />} />
          <Route path="/food-detail" element={<Dashboard />} />
          <Route path="/customer-detail" element={<Dashboard />} />
          <Route path="/calendar" element={<Dashboard />} />
          <Route path="/chat" element={<Dashboard />} />
          <Route path="/wallet" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
