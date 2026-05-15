
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import DisciplinePage from "./pages/DisciplinePage";
import DomainPage from "./pages/DomainPage";
import ExpertisePage from "./pages/ExpertisePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfSale from "./pages/TermsOfSale";
import DevisPage from "./pages/DevisPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectDetail from "./pages/admin/AdminProjectDetail";
import AdminClients from "./pages/admin/AdminClients";
import AdminDomains from "./pages/admin/AdminDomains";
import AdminFinances from "./pages/admin/AdminFinances";
import AdminCaisse from "./pages/admin/AdminCaisse";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminInvoiceDetail from "./pages/admin/AdminInvoiceDetail";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminDividendes from "./pages/admin/AdminDividendes";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminJournal from "./pages/admin/AdminJournal";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<DisciplinePage />} />
          <Route path="/domaines" element={<Navigate to="/services" replace />} />
          <Route path="/domaines/:slug" element={<DomainPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalNotice />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfSale />} />
          <Route path="/devis" element={<DevisPage />} />

          {/* Espace interne sécurisé */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projets" element={<AdminProjects />} />
            <Route path="projets/:id" element={<AdminProjectDetail />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="domaines" element={<AdminDomains />} />
            <Route path="finances" element={<AdminFinances />} />
            <Route path="caisse" element={<AdminCaisse />} />
            <Route path="factures" element={<AdminInvoices />} />
            <Route path="factures/:id" element={<AdminInvoiceDetail />} />
            <Route path="users" element={<AdminTeam />} />
            <Route path="dividendes" element={<AdminDividendes />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="journal" element={<AdminJournal />} />
            <Route path="parametres" element={<AdminSettings />} />
          </Route>

          
          {/* Attraper toutes les autres routes non-définies */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
