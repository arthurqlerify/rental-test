import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // This will redirect to Dashboard
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import LeasesPage from "./pages/LeasesPage";
import TurnoversPage from "./pages/TurnoversPage";
import InspectionsPage from "./pages/InspectionsPage";
import RenovationsPage from "./pages/RenovationsPage";
import WorkOrdersPage from "./pages/WorkOrdersPage";
import PropertiesPage from "./pages/PropertiesPage";
import { Layout } from "./components/shared/Layout";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} /> {/* Redirects to /dashboard */}
          <Route element={<Layout />}> {/* Layout for authenticated routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leases" element={<LeasesPage />} />
            <Route path="/turnovers" element={<TurnoversPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="/renovations" element={<RenovationsPage />} />
            <Route path="/work-orders" element={<WorkOrdersPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;