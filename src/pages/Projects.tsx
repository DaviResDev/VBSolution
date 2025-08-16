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

const Projects = () => {
  const { state, dispatch } = useProject();
  const { dispatch: vbDispatch } = useVB();
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
      case 'Em Andamento': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'Concluído': return 'bg-gray-800 text-white border-gray-900';
      case 'Pausado': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Planejado': return 'bg-white text-gray-900 border-gray-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      tasks: [],
      archived: false,
      ...projectData
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    toast({
      title: "Projeto criado",
      description: "Novo projeto foi criado com sucesso"
    });
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCompleteProject = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      const updatedProject = { ...project, status: 'Concluído' as const };
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });

      if (project.tasks && project.tasks.length > 0) {
        project.tasks.forEach(taskId => {
          vbDispatch({ 
            type: 'UPDATE_ACTIVITY', 
            payload: { 
              id: taskId, 
              status: 'completed',
              completedAt: new Date().toISOString()
            }
          });
        });
      }

      toast({
        title: "Projeto finalizado",
        description: "Projeto e suas tarefas foram marcadas como concluídas"
      });
    }
  };

  const handleArchiveProject = (projectId: string) => {
    dispatch({ type: 'ARCHIVE_PROJECT', payload: projectId });
    toast({
      title: "Projeto arquivado",
      description: "Projeto foi arquivado com sucesso"
    });
  };

  const handleViewModeChange = (newViewMode: string) => {
    setViewMode(newViewMode as any);
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
      projects: state.projects,
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
        employees={state.projects.map(p => ({ id: p.responsible || p.id, name: p.responsible || p.name }))}
        selectedResponsibles={selectedResponsibles}
        onResponsibleChange={setSelectedResponsibles}
      />
    </>
  );

  const handleUnarchiveProject = (projectId: string) => {
    dispatch({ type: 'UNARCHIVE_PROJECT', payload: projectId });
    toast({
      title: "Projeto restaurado",
      description: "Projeto foi restaurado dos arquivos"
    });
  };

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
        {renderCurrentView()}
      </PageLayout>

      {/* Create Modal */}
      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
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
