import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import MyPurchases from "./pages/MyPurchases";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Suporte from "./pages/Suporte";
import NotFound from "./pages/NotFound";

// Enterprise Admin Pages
import AdminLogin from "./pages/enterprise/AdminLogin";
import AdminDashboard from "./pages/enterprise/AdminDashboard";
import AdminUsers from "./pages/enterprise/AdminUsers";
import AdminProducts from "./pages/enterprise/AdminProducts";
import AdminCompras from "./pages/enterprise/AdminCompras";
import AdminTransactions from "./pages/enterprise/AdminTransactions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produto/:idOrSlug" element={<ProductDetail />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/pagar/:transactionId" element={<Payment />} />
          <Route path="/sucesso" element={<Success />} />
          <Route path="/meus-produtos" element={<MyPurchases />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/suporte" element={<Suporte />} />
          
          {/* Enterprise Admin Routes */}
          <Route path="/enterprise/owner/login" element={<AdminLogin />} />
           {/* canonical admin dashboard */}
           <Route path="/enterprise/owner/dashboard" element={<AdminDashboard />} />
           {/* legacy path -> keep working by rendering dashboard */}
           <Route path="/enterprise/owner" element={<AdminDashboard />} />
          <Route path="/enterprise/owner/users" element={<AdminUsers />} />
          <Route path="/enterprise/owner/users/:id" element={<AdminUsers />} />
          <Route path="/enterprise/owner/products" element={<AdminProducts />} />
          <Route path="/enterprise/owner/products/new" element={<AdminProducts />} />
          <Route path="/enterprise/owner/products/:id" element={<AdminProducts />} />
          <Route path="/enterprise/owner/products/:id/edit" element={<AdminProducts />} />
          <Route path="/enterprise/owner/compras" element={<AdminCompras />} />
          <Route path="/enterprise/owner/compras/:id" element={<AdminCompras />} />
          <Route path="/enterprise/owner/transactions" element={<AdminTransactions />} />
          <Route path="/enterprise/owner/transactions/:id" element={<AdminTransactions />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
