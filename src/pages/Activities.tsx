import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVB } from '@/contexts/VBContext';
import { useActivities } from '@/hooks/useActivities';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BitrixActivityForm from '@/components/BitrixActivityForm';
import ActivityListView from '@/components/ActivityListView';
import ActivityDeadlineView from '@/components/ActivityDeadlineView';
import ActivityPlannerView from '@/components/ActivityPlannerView';
import ActivityCalendarView from '@/components/ActivityCalendarView';
import ActivityDashboardView from '@/components/ActivityDashboardView';
import { TestLocalStorage } from '@/components/TestLocalStorage';
import { 
  List, 
  Clock, 
  Calendar, 
  BarChart3, 
  Kanban 
} from 'lucide-react';
import CompactAdvancedFilters from '@/components/CompactAdvancedFilters';
import ResponsibleFilter from '@/components/ResponsibleFilter';

const Activities = () => {
  const { state } = useVB();
  const { companies, employees } = state;
  const { activities, loading, error, createActivity, updateActivity, deleteActivity, refetch } = useActivities();
  const [viewMode, setViewMode] = useState<'lista' | 'prazo' | 'planejador' | 'calendario' | 'dashboard'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const navigate = useNavigate();

  const updateActivityStatus = async (activityId: string, newStatus: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      try {
        const updateData: any = {
          status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled'
        };

        // Adicionar completed_at apenas se o status for 'completed'
        if (newStatus === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }

        const result = await updateActivity(activityId, updateData);
        
        if (result) {
          if (newStatus === 'completed') {
            const completedTaskInfo = {
              id: activityId,
              title: activity.title,
              completedAt: new Date().toISOString(),
              previousStatus: activity.status
            };

            const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
            completedTasks.push(completedTaskInfo);
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
          }

          const statusNames = {
            pending: 'Pendente',
            'in_progress': 'Em Andamento',
            completed: 'Finalizado',
            cancelled: 'Cancelado'
          };

          toast({
            title: "Status atualizado",
            description: `Atividade movida para ${statusNames[newStatus as keyof typeof statusNames]}`
          });
          
          // Atualizar a lista automaticamente
          refetch();
        }
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status da atividade",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteActivities = async (activityIds: string[]) => {
    try {
      for (const id of activityIds) {
        const success = await deleteActivity(id);
        if (!success) {
          throw new Error(`Falha ao excluir atividade ${id}`);
        }
      }
      
      toast({
        title: "Atividades excluídas",
        description: `${activityIds.length} atividade(s) foram excluídas com sucesso.`
      });
      
      // Atualizar a lista automaticamente
      refetch();
    } catch (error) {
      console.error('Erro ao excluir atividades:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir atividades",
        variant: "destructive"
      });
    }
  };

  const handleArchiveActivity = async (activityId: string) => {
    try {
      const result = await updateActivity(activityId, { status: 'cancelled' });
      
      if (result) {
        toast({
          title: 'Atividade arquivada',
          description: 'A atividade foi movida para os arquivos.'
        });
        
        // Atualizar a lista automaticamente
        refetch();
      }
    } catch (error) {
      console.error('Erro ao arquivar atividade:', error);
      toast({
        title: "Erro",
        description: "Erro ao arquivar atividade",
        variant: "destructive"
      });
    }
  };

  const handleActivityClick = (activityId: string) => {
    navigate(`/activities/${activityId}`);
  };

  const handleCreateActivity = async (formData: any) => {
    try {
      console.log('📝 Dados do formulário recebidos:', formData);
      
      const activityData = {
        title: formData.title,
        description: formData.description,
        type: formData.type as 'task' | 'meeting' | 'call' | 'email' | 'other',
        priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: 'pending' as const,
        due_date: formData.date ? new Date(formData.date).toISOString() : undefined,
        responsible_id: formData.responsibleId || undefined
      };

      console.log('🚀 Dados da atividade preparados:', activityData);

      const result = await createActivity(activityData);
      
      if (result) {
        console.log('✅ Atividade criada com sucesso:', result);
        toast({
          title: "Tarefa criada",
          description: "Nova tarefa foi criada com sucesso"
        });
        setIsCreateModalOpen(false);
        // Atualizar a lista automaticamente
        refetch();
      } else {
        console.error('❌ Falha ao criar atividade');
        toast({
          title: "Erro",
          description: "Erro ao criar tarefa",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar atividade:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar tarefa",
        variant: "destructive"
      });
    }
  };

  const handleCreateQuickTask = async (title: string, status: string) => {
    try {
      const activityData = {
        title,
        description: '',
        type: 'task' as const,
        priority: 'medium' as const,
        status: status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        responsible_id: employees.length > 0 ? employees[0].id : undefined
      };

      const result = await createActivity(activityData);
      
      if (result) {
        toast({
          title: "Tarefa rápida criada",
          description: "Nova tarefa foi criada com sucesso"
        });
        // Atualizar a lista automaticamente
        refetch();
      }
    } catch (error) {
      console.error('Erro ao criar tarefa rápida:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa rápida",
        variant: "destructive"
      });
    }
  };

  const handleViewModeChange = (value: string) => {
    setViewMode(value as 'lista' | 'prazo' | 'planejador' | 'calendario' | 'dashboard');
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const getFilteredActivities = () => {
    let filtered = activities;
    
    if (selectedResponsibles.length > 0) {
      filtered = filtered.filter(activity => 
        activity.responsible_id && selectedResponsibles.includes(activity.responsible_id)
      );
    }
    
    if (selectedWorkGroup) {
      filtered = filtered.filter(activity => 
        activity.work_group === selectedWorkGroup
      );
    }
    
    if (selectedDepartment) {
      filtered = filtered.filter(activity => 
        activity.department === selectedDepartment
      );
    }
    
    if (selectedProject) {
      filtered = filtered.filter(activity => 
        activity.project_id === selectedProject
      );
    }
    
    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  const handleClearAdvancedFilters = () => {
    setSelectedWorkGroup('');
    setSelectedDepartment('');
    setSelectedProject('');
  };

  const renderCurrentView = () => {
    const baseProps = {
      activities: filteredActivities,
      companies,
      employees,
      onActivityClick: handleActivityClick,
      onUpdateStatus: updateActivityStatus
    };

    switch (viewMode) {
      case 'lista':
        return (
          <ActivityListView 
            {...baseProps} 
            onDeleteActivities={handleDeleteActivities} 
            searchTerm={searchTerm}
            onArchiveActivity={handleArchiveActivity}
          />
        );
      case 'prazo':
        return <ActivityDeadlineView {...baseProps} onCreateQuickTask={handleCreateQuickTask} onOpenCreateModal={handleOpenCreateModal} />;
      case 'planejador':
        return <ActivityPlannerView {...baseProps} />;
      case 'calendario':
        return <ActivityCalendarView {...baseProps} />;
      case 'dashboard':
        return <ActivityDashboardView {...baseProps} />;
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
        employees={employees}
        selectedResponsibles={selectedResponsibles}
        onResponsibleChange={setSelectedResponsibles}
      />
      
      {/* Toggle Archived Filter - simple select style */}
      <Button 
        variant="outline"
        size="sm-professional"
        onClick={() => {
          // Simple toggle: when clicked, filter only archived (for demo we change search term)
          const showArchived = searchTerm === '__archived__';
          setSearchTerm(showArchived ? '' : '__archived__');
        }}
      >
        {searchTerm === '__archived__' ? 'Ver Ativas' : 'Ver Arquivadas'}
      </Button>
    </>
  );

  // Tratamento de erro
  if (error) {
    return (
      <PageLayout
        title="Minhas Tarefas"
        tabs={tabs}
        onTabChange={handleViewModeChange}
        activeTab={viewMode}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Criar Tarefa"
        searchPlaceholder="Buscar atividades..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        filters={filters}
        showSearch={viewMode === 'lista' || viewMode === 'prazo' || viewMode === 'planejador'}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar atividades</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Loading state
  if (loading) {
    return (
      <PageLayout
        title="Minhas Tarefas"
        tabs={tabs}
        onTabChange={handleViewModeChange}
        activeTab={viewMode}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Criar Tarefa"
        searchPlaceholder="Buscar atividades..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        filters={filters}
        showSearch={viewMode === 'lista' || viewMode === 'prazo' || viewMode === 'planejador'}
      >
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando suas tarefas...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title="Minhas Tarefas"
        tabs={tabs}
        onTabChange={handleViewModeChange}
        activeTab={viewMode}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Criar Tarefa"
        searchPlaceholder="Buscar atividades..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        filters={filters}
        showSearch={viewMode === 'lista' || viewMode === 'prazo' || viewMode === 'planejador'}
      >
        {renderCurrentView()}
        
        {/* Componente de teste temporário - comentado para evitar problemas */}
        {/* <div className="mt-8">
          <TestLocalStorage />
        </div> */}
      </PageLayout>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova tarefa
            </DialogDescription>
          </DialogHeader>
          <BitrixActivityForm companies={companies} employees={employees} onSubmit={handleCreateActivity} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Activities;
