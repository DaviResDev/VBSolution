import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { useVB } from '@/contexts/VBContext';
import { Plus, Search, ChevronDown, Settings, Filter, List, Calendar, Clock, BarChart3, Kanban } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ResponsibleFilter from '@/components/ResponsibleFilter';
import CompactAdvancedFilters from '@/components/CompactAdvancedFilters';
import PageLayout from '@/components/PageLayout';
import ProjectCreateModal from '@/components/ProjectCreateModal';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import ProjectKanbanBoard from '@/components/ProjectKanbanBoard';
import ProjectDashboardView from '@/components/ProjectDashboardView';
import ProjectCalendarTimeline from '@/components/ProjectCalendarTimeline';
import ProjectPlannerView from '@/components/ProjectPlannerView';
import ProjectListView from '@/components/ProjectListView';
import ProjectDeadlineView from '@/components/ProjectDeadlineView';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';

const Projects = () => {
  const { state, dispatch } = useProject();
  const { dispatch: vbDispatch } = useVB();
  const { user } = useAuth();
  const { projects, loading, error, refetch } = useProjects();
  
  const [viewMode, setViewMode] = useState<'lista' | 'prazo' | 'planejador' | 'calendario' | 'dashboard'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    // Converting all status colors to grayscale
    switch (status) {
      case 'active': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'completed': return 'bg-gray-800 text-white border-gray-900';
      case 'on_hold': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'planning': return 'bg-white text-gray-900 border-gray-400';
      case 'cancelled': return 'bg-gray-300 text-gray-600 border-gray-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      // O projeto já foi salvo no Supabase pelo modal
      // Agora vamos recarregar os dados
      await refetch();
      
      toast({
        title: "Projeto criado com sucesso!",
        description: "Projeto foi salvo na sua conta e no Supabase"
      });
      
      // Fechar modal
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto",
        variant: "destructive"
      });
    }
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCompleteProject = (projectId: string) => {
    // Implementar lógica para marcar projeto como concluído
    toast({
      title: "Projeto concluído",
      description: "Projeto foi marcado como concluído"
    });
  };

  const handleArchiveProject = (projectId: string) => {
    // Implementar lógica para arquivar projeto
    toast({
      title: "Projeto arquivado",
      description: "Projeto foi movido para arquivos"
    });
  };

  const handleViewModeChange = (mode: 'lista' | 'prazo' | 'planejador' | 'calendario' | 'dashboard') => {
    setViewMode(mode);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleClearAdvancedFilters = () => {
    setSelectedWorkGroup('');
    setSelectedDepartment('');
  };

  const renderCurrentView = () => {
    const baseProps = {
      projects: projects || [], // Usar projetos do Supabase
      onProjectClick: handleProjectClick,
      onCompleteProject: handleCompleteProject,
      onArchiveProject: handleArchiveProject,
      searchTerm,
      selectedResponsibles,
      selectedWorkGroup,
      selectedDepartment
    };

    switch (viewMode) {
      case 'lista':
        return <ProjectListView {...baseProps} />;
      case 'prazo':
        return <ProjectDeadlineView {...baseProps} />;
      case 'planejador':
        return <ProjectPlannerView {...baseProps} />;
      case 'calendario':
        return <ProjectCalendarTimeline {...baseProps} />;
      case 'dashboard':
        return <ProjectDashboardView {...baseProps} />;
      default:
        return null;
    }
  };

  const tabs = [
    {
      value: 'lista',
      label: 'Lista',
      icon: <List size={16} strokeWidth={2} />
    },
    {
      value: 'prazo',
      label: 'Prazo',
      icon: <Clock size={16} strokeWidth={2} />
    },
    {
      value: 'planejador',
      label: 'Planejador',
      icon: <Kanban size={16} strokeWidth={2} />
    },
    {
      value: 'calendario',
      label: 'Calendário',
      icon: <Calendar size={16} strokeWidth={2} />
    },
    {
      value: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 size={16} strokeWidth={2} />
    }
  ];

  const filters = (
    <>
      <CompactAdvancedFilters
        selectedWorkGroup={selectedWorkGroup}
        selectedDepartment={selectedDepartment}
        selectedProject={selectedProject}
        onWorkGroupChange={setSelectedWorkGroup}
        onDepartmentChange={setSelectedDepartment}
        onProjectChange={setSelectedProject}
        onClearAll={handleClearAdvancedFilters}
      />
      
      <ResponsibleFilter
        employees={projects?.map(p => ({ id: p.responsible_id || p.id, name: p.responsible_id || p.name })) || []}
        selectedResponsibles={selectedResponsibles}
        onResponsibleChange={setSelectedResponsibles}
      />
    </>
  );

  const handleUnarchiveProject = (projectId: string) => {
    // Implementar lógica para restaurar projeto
    toast({
      title: "Projeto restaurado",
      description: "Projeto foi restaurado dos arquivos"
    });
  };

  // Mostrar loading se estiver carregando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar projetos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageLayout
        title="Projetos"
        tabs={tabs}
        onTabChange={handleViewModeChange}
        activeTab={viewMode}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Criar Projeto"
        searchPlaceholder="Buscar projetos..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        filters={filters}
        showSearch={viewMode === 'lista' || viewMode === 'prazo' || viewMode === 'planejador'}
      >
        {/* Informações do usuário logado */}
        {user && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Sua conta logada</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Email: {user.email} | 
              Projetos encontrados: {projects?.length || 0}
            </p>
          </div>
        )}

        {/* Conteúdo principal */}
        {projects && projects.length > 0 ? (
          renderCurrentView()
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {user ? 'Você ainda não tem projetos cadastrados.' : 'Faça login para ver seus projetos.'}
            </p>
            {user && (
              <Button onClick={handleOpenCreateModal} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        )}
      </PageLayout>

      {/* Create Modal */}
      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};

export default Projects;
