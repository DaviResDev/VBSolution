
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  MessageCircle, 
  MessageSquare, 
  Folder, 
  Activity, 
  TrendingUp, 
  Building2, 
  Plus, 
  Calendar, 
  FileText, 
  GitBranch, 
  Package, 
  Users, 
  Phone, 
  Mail, 
  Settings,
  Star,
  HelpCircle,
  UserPlus,
  Inbox,
  MoreHorizontal,
  TrendingDown,
  Truck,
  ShoppingCart,
  BarChart3
} from 'lucide-react';

// Menus principais (sempre visíveis)
const mainMenuItems = [
  {
    title: 'Início',
    icon: LayoutDashboard,
    url: '/',
    description: 'Visão geral do sistema'
  },
  {
    title: 'Atividades',
    icon: Activity,
    url: '/activities',
    description: 'Minhas atividades e tarefas'
  },
  {
    title: 'Calendário',
    icon: Calendar,
    url: '/calendar',
    description: 'Agenda e eventos'
  },
  {
    title: 'Projetos',
    icon: Folder,
    url: '/projects',
    description: 'Gestão de projetos'
  },
  {
    title: 'Leads e Vendas',
    icon: TrendingUp,
    url: '/leads-sales',
    description: 'Gestão de leads e vendas'
  },
  {
    title: 'Empresas',
    icon: Building2,
    url: '/companies',
    description: 'Gestão de empresas'
  },
  {
    title: 'Funcionários',
    icon: Users,
    url: '/employees',
    description: 'Organograma e RH'
  }
];

// Itens adicionais (expansíveis) - Menos importantes
const additionalMenuItems = [
  {
    title: 'Feed',
    icon: MessageSquare,
    url: '/feed',
    description: 'Timeline e publicações'
  },
  {
    title: 'Chat',
    icon: MessageCircle,
    url: '/chat',
    description: 'Chat interno e mensagens'
  },

  {
    title: 'Colaborações',
    icon: Users,
    url: '/collaborations',
    description: 'Trabalho colaborativo'
  },
  {
    title: 'Grupo de Trabalho',
    icon: GitBranch,
    url: '/work-groups',
    description: 'Grupos e equipes'
  },
  {
    title: 'Produtos',
    icon: Package,
    url: '/products',
    description: 'Catálogo de produtos'
  },
  {
    title: 'Fornecedores',
    icon: Truck,
    url: '/suppliers',
    description: 'Gestão de fornecedores'
  },
  {
    title: 'Inventário',
    icon: Package,
    url: '/inventory',
    description: 'Controle de estoque'
  },
  {
    title: 'Baixas',
    icon: TrendingDown,
    url: '/writeoffs',
    description: 'Gestão de baixas'
  },
  {
    title: 'Pedidos de Venda',
    icon: ShoppingCart,
    url: '/sales-orders',
    description: 'Pedidos e vendas'
  },
  {
    title: 'Funil de Vendas',
    icon: TrendingUp,
    url: '/sales-funnel',
    description: 'Pipeline de vendas'
  },

  {
    title: 'Arquivos',
    icon: Folder,
    url: '/files',
    description: 'Sistema de arquivos'
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    url: '/reports',
    description: 'Relatórios do sistema'
  },
  {
    title: 'Dashboard de Relatórios',
    icon: BarChart3,
    url: '/reports-dashboard',
    description: 'Dashboard de relatórios'
  }
];

// Itens complementares
const complementaryMenuItems = [
  {
    title: 'WhatsApp',
    icon: Phone,
    url: '/whatsapp',
    description: 'Integração WhatsApp'
  },
  {
    title: 'Configurações',
    icon: Settings,
    url: '/settings',
    description: 'Configurações do sistema'
  }
];

interface BitrixSidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export function BitrixSidebar({ isExpanded, setIsExpanded }: BitrixSidebarProps) {
  const location = useLocation();
  const { sidebarColor, isDarkMode } = useTheme();
  const { userName } = useUser();
  const currentPath = location.pathname;
  const [showAdditional, setShowAdditional] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const getLogoUrl = () => {
    return "https://i.imgur.com/LPwd1n0.png";
  };

  return (
    <div
      className={`fixed left-0 top-[46px] h-[calc(100vh-46px)] z-40 transition-all duration-200 ease-out ${
        isExpanded ? 'w-60' : 'w-16'
      } border-r shadow-lg flex flex-col flex-shrink-0 bg-white`}
      style={{ 
        borderColor: isDarkMode ? '#1f2937' : '#e5e7eb'
      }}
    >
      {/* Header do usuário */}
      <div className={`px-3 py-4 border-b border-gray-100 ${isExpanded ? 'px-4' : 'px-2'}`}>
        {isExpanded ? (
          <Link 
            to="/settings"
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">D {userName} Resende...</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        ) : (
          <Link 
            to="/settings"
            className="flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
          </Link>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1 py-4">
          {/* Menus principais */}
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                  isActive(item.url) 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={!isExpanded ? item.description : ''}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive(item.url) ? 'text-gray-700' : 'text-gray-500'
                }`} />
                {isExpanded && (
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}

          {/* Botão Mais (+) */}
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group w-full ${
              showAdditional ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
            title={!isExpanded ? 'Mostrar mais opções' : ''}
          >
            <Plus className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
              showAdditional ? 'rotate-45' : ''
            }`} />
            {isExpanded && (
              <>
                <span className="flex-1 text-sm font-medium text-gray-700">Mais</span>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  showAdditional ? 'rotate-90' : ''}`} />
              </>
            )}
          </button>

          {/* Itens adicionais (expansíveis) */}
          {showAdditional && (
            <div className="ml-3 space-y-1">
              {additionalMenuItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group ${
                      isActive(item.url) 
                        ? 'bg-gray-200 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    title={!isExpanded ? item.description : ''}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${
                      isActive(item.url) ? 'text-gray-700' : 'text-gray-500'
                    }`} />
                    {isExpanded && (
                      <span className="flex-1 text-sm">{item.title}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Separador */}
      <div className="px-3 py-2">
        <div className="h-px bg-gray-200"></div>
      </div>

      {/* Itens complementares */}
      <nav className="px-3 pb-3">
        <div className="space-y-1">
          {complementaryMenuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                  isActive(item.url) 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={!isExpanded ? item.description : ''}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive(item.url) ? 'text-gray-700' : 'text-gray-500'
                }`} />
                {isExpanded && (
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Botão de Minimizar/Maximizar */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group text-gray-600 hover:bg-gray-50"
          title={isExpanded ? 'Minimizar' : 'Maximizar'}
        >
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronLeft className="h-4 w-4" />
          </div>
          {isExpanded && (
            <span className="text-sm font-medium">Minimizar</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default BitrixSidebar;
