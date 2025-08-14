
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
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
  Settings 
} from 'lucide-react';

// Menus principais (sempre visíveis)
const mainMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/',
    description: 'Visão geral do sistema'
  },
  {
    title: 'Mensagem',
    icon: MessageCircle,
    url: '/chat',
    description: 'Chat interno e mensagens'
  },
  {
    title: 'Feed',
    icon: MessageSquare,
    url: '/feed',
    description: 'Timeline e publicações'
  },
  {
    title: 'Projeto',
    icon: Folder,
    url: '/projects',
    description: 'Gestão de projetos'
  },
  {
    title: 'Atividades',
    icon: Activity,
    url: '/activities',
    description: 'Minhas atividades e tarefas'
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
  }
];

// Itens adicionais (expansíveis)
const additionalMenuItems = [
  {
    title: 'Calendário',
    icon: Calendar,
    url: '/calendar',
    description: 'Agenda e eventos'
  },
  {
    title: 'Documentos',
    icon: FileText,
    url: '/files',
    description: 'Documentos e arquivos'
  },
  {
    title: 'Grupo de Trabalho',
    icon: GitBranch,
    url: '/work-groups',
    description: 'Grupos e equipes'
  },
  {
    title: 'Inventário',
    icon: Package,
    url: '/inventory',
    description: 'Controle de estoque'
  },
  {
    title: 'Funcionários',
    icon: Users,
    url: '/employees',
    description: 'Organograma e RH'
  },
  {
    title: 'Produtos',
    icon: Package,
    url: '/products',
    description: 'Catálogo de produtos'
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
    title: 'E-mail',
    icon: Mail,
    url: '/email',
    description: 'Gestão de e-mails'
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
      } border-r shadow-lg flex flex-col flex-shrink-0`}
      style={{ 
        backgroundColor: sidebarColor,
        borderColor: isDarkMode ? '#1f2937' : '#e5e7eb'
      }}
    >
      {/* Logo */}
      <div className={`px-3 py-4 ${isExpanded ? 'px-4 py-3' : 'px-2 py-3'}`}>
        {isExpanded ? (
          <div className="flex items-center justify-center">
            <img 
              src={getLogoUrl()}
              alt="VBSolution Logo" 
              className="h-8 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <img 
              src={getLogoUrl()}
              alt="VBSolution Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {/* Menus principais */}
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                  isActive(item.url) 
                    ? 'shadow-sm' 
                    : ''
                }`}
                style={{
                  color: isActive(item.url) ? '#ffffff' : '#021529',
                  backgroundColor: isActive(item.url) 
                    ? '#021529'
                    : 'transparent'
                }}
                title={!isExpanded ? item.description : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                                            {isActive(item.url) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Botão Mais (+) */}
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group w-full ${
              showAdditional ? 'shadow-sm' : ''
            }`}
            style={{
              color: isDarkMode ? '#f3f4f6' : '#1f2937',
              backgroundColor: showAdditional 
                ? (isDarkMode ? '#374151' : '#f1f3f4')
                : 'transparent'
            }}
            title={!isExpanded ? 'Mostrar mais opções' : ''}
          >
            <Plus className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              showAdditional ? 'rotate-45' : ''
            }`} />
            {isExpanded && (
              <>
                <span className="flex-1 text-sm font-medium">Mais</span>
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
                  showAdditional ? 'rotate-90' : ''
                }`} />
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
                        ? 'shadow-sm' 
                        : ''
                    }`}
                    style={{
                      color: isActive(item.url) ? '#ffffff' : '#021529',
                      backgroundColor: isActive(item.url) 
                        ? '#021529'
                        : 'transparent'
                    }}
                    title={!isExpanded ? item.description : ''}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {isExpanded && (
                      <>
                        <span className="flex-1 text-sm">{item.title}</span>
                        {isActive(item.url) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </>
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
        <div 
          className="h-px transition-colors duration-200"
          style={{ backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }}
        ></div>
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
                    ? 'shadow-sm' 
                    : ''
                }`}
                style={{
                  color: '#021529',
                  backgroundColor: isActive(item.url) 
                    ? '#021529'
                    : 'transparent'
                }}
                title={!isExpanded ? item.description : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    {isActive(item.url) && (
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Botão de Minimizar/Maximizar */}
      <div 
        className="p-3 border-t transition-colors duration-200"
        style={{ borderColor: isDarkMode ? '#374151' : '#f3f4f6' }}
      >
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group"
          style={{
            color: isDarkMode ? '#d1d5db' : '#4b5563'
          }}
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
