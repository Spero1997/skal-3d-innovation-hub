
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import ExpertisePage from "./pages/ExpertisePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfSale from "./pages/TermsOfSale";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalNotice />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfSale />} />
          
          {/* Redirection des routes malformées vers NotFound */}
          <Route path="/projets" element={<Navigate to="/projects" replace />} />
          
          {/* Attraper toutes les autres routes non-définies */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
