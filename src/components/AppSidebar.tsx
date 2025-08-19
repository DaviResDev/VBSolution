
import { Home, Building2, Users, Calendar, Target, Settings, Phone, ShoppingCart, Users2, Package, Briefcase, MessageCircle, BarChart3, CreditCard, Truck, LineChart, ShoppingBag, DollarSign } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900">CRM Sistema</h1>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/leads-sales" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Target className="h-4 w-4" />
                    Leads e Vendas
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/empresas" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Building2 className="h-4 w-4" />
                    Empresas
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/atividades" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Calendar className="h-4 w-4" />
                    Atividades
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            CRM
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/conversations" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <MessageCircle className="h-4 w-4" />
                    Conversas
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/call-center" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Phone className="h-4 w-4" />
                    Call Center
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/deals" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Briefcase className="h-4 w-4" />
                    Negócios
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/relatorios" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <BarChart3 className="h-4 w-4" />
                    Relatórios
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/team" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Users2 className="h-4 w-4" />
                    Equipe
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/products" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Package className="h-4 w-4" />
                    Produtos
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/suppliers" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Truck className="h-4 w-4" />
                    Fornecedores
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/invoices" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <CreditCard className="h-4 w-4" />
                    Faturas
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
                    Configurações
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
