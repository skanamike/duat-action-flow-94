import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Company from "./pages/Company";
import CompanyV1 from "./pages/CompanyV1";
import Pantheon from "./pages/Pantheon";
import Technology from "./pages/Technology";
import Team from "./pages/Team";
import WhyDuat from "./pages/WhyDuat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("config", "G-LMDZPXWHR6", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/company" element={<Company />} />
          <Route path="/company/team" element={<Team />} />
          <Route path="/why-duat" element={<WhyDuat />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/pantheon" element={<Pantheon />} />
          <Route path="/companyv1" element={<CompanyV1 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
