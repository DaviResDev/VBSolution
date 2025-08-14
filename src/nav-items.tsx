
import { type LucideIcon } from "lucide-react";
import {
  Users,
  Calendar,
  Building2,
  Package,
  UserPlus,
  BarChart3,
  FileText,
  Settings,
  MessageCircle,
  Home,
  FolderOpen,
  ClipboardList,
  UserCheck,
  Briefcase,
  TrendingUp,
  ShoppingCart,
  Truck,
  Archive,
  DollarSign,
  PieChart
} from "lucide-react";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  variant?: "default" | "ghost";
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    to: "/",
    icon: Home,
  },
  {
    title: "Feed",
    to: "/feed",
    icon: MessageCircle,
  },
  {
    title: "Atividades",
    to: "/activities",
    icon: ClipboardList,
  },
  {
    title: "Calendário",
    to: "/calendar",
    icon: Calendar,
  },
  {
    title: "Leads e Vendas",
    to: "/leads-sales",
    icon: TrendingUp,
  },
  {
    title: "Relatório e Dashboard",
    to: "/reports-dashboard",
    icon: PieChart,
  },
  {
    title: "Empresas",
    to: "/companies",
    icon: Building2,
  },
  {
    title: "Colaboradores",
    to: "/employees",
    icon: Users,
  },
  {
    title: "Produtos",
    to: "/products",
    icon: Package,
  },
  {
    title: "Fornecedores",
    to: "/suppliers",
    icon: UserPlus,
  },
  {
    title: "Estoque",
    to: "/inventory",
    icon: Archive,
  },
  {
    title: "Transferências",
    to: "/transfers",
    icon: Truck,
  },
  {
    title: "Baixas",
    to: "/writeoffs",
    icon: Archive,
  },
  {
    title: "Pedidos de Venda",
    to: "/sales-orders",
    icon: ShoppingCart,
  },
  {
    title: "Funil de Vendas",
    to: "/sales-funnel",
    icon: DollarSign,
  },
  {
    title: "Projetos",
    to: "/projects",
    icon: Briefcase,
  },
  {
    title: "Grupos de Trabalho",
    to: "/work-groups",
    icon: UserCheck,
  },
  {
    title: "Arquivos",
    to: "/files",
    icon: FolderOpen,
  },
  {
    title: "Documentos",
    to: "/documents",
    icon: FileText,
  },
  {
    title: "Relatórios",
    to: "/reports",
    icon: BarChart3,
  },
  {
    title: "WhatsApp",
    to: "/whatsapp",
    icon: MessageCircle,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Colaborações",
    to: "/collaborations",
    icon: Users,
  },
  {
    title: "Configurações",
    to: "/settings",
    icon: Settings,
  }
];
