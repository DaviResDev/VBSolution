
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { VBProvider } from "@/contexts/VBContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import { WorkGroupProvider } from "@/contexts/WorkGroupContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import Calendar from "./pages/Calendar";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Employees from "./pages/Employees";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Inventory from "./pages/Inventory";
import Writeoffs from "./pages/Writeoffs";
import SalesOrders from "./pages/SalesOrders";
import SalesFunnel from "./pages/SalesFunnel";
import Projects from "./pages/Projects";
import WorkGroups from "./pages/WorkGroups";
import Files from "./pages/Files";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import WhatsApp from "./pages/WhatsApp";
import Chat from "./pages/Chat";
import Collaborations from "./pages/Collaborations";
import Settings from "./pages/Settings";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import LeadsAndSales from "./pages/LeadsAndSales";
import LeadsAndSalesPage from "./pages/LeadsAndSalesPage";
import PipedriveLeadsPage from "./pages/PipedriveLeadsPage";
import LeadsSales from "./pages/LeadsSales";
import ReportsDashboard from "./pages/ReportsDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <VBProvider>
          <ProjectProvider>
            <UserProvider>
              <WorkGroupProvider>
                <TooltipProvider>
                  <Toaster />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="feed" element={<Feed />} />
                        <Route path="activities" element={<Activities />} />
                        <Route path="activities/:id" element={<ActivityDetail />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="companies" element={<Companies />} />
                        <Route path="companies/:id" element={<CompanyDetail />} />
                        <Route path="employees" element={<Employees />} />
                        <Route path="employees/:id" element={<Employees />} />
                        <Route path="products" element={<Products />} />
                        <Route path="suppliers" element={<Suppliers />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="writeoffs" element={<Writeoffs />} />
                        <Route path="sales-orders" element={<SalesOrders />} />
                        <Route path="sales-funnel" element={<SalesFunnel />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="work-groups" element={<WorkGroups />} />
                        <Route path="files" element={<Files />} />
                        <Route path="documents" element={<Documents />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="whatsapp" element={<WhatsApp />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="collaborations" element={<Collaborations />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="leads-and-sales" element={<LeadsAndSales />} />
                        <Route path="leads-and-sales-page" element={<LeadsAndSalesPage />} />
                        <Route path="pipedrive-leads" element={<PipedriveLeadsPage />} />
                        <Route path="leads-sales" element={<LeadsSales />} />
                        <Route path="reports-dashboard" element={<ReportsDashboard />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </WorkGroupProvider>
            </UserProvider>
          </ProjectProvider>
        </VBProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
