import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

// Import the view components
import ActivityListView from '@/components/ActivityListView';
import ActivityPlannerView from '@/components/ActivityPlannerView';
import ActivityCalendarView from '@/components/ActivityCalendarView';
import ActivityDeadlineView from '@/components/ActivityDeadlineView';
import ActivityDashboardView from '@/components/ActivityDashboardView';
import BitrixActivityForm from '@/components/BitrixActivityForm';

const Activities = () => {
  const { state, dispatch } = useVB();
  const { activities, companies, employees } = state;
  const [viewMode, setViewMode] = useState<'lista' | 'prazo' | 'planejador' | 'calendario' | 'dashboard'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const navigate = useNavigate();

  const updateActivityStatus = (activityId: string, newStatus: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      const updatedActivity = {
        ...activity,
        status: newStatus as any,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : activity.completedAt
      };
      dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });

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
        backlog: 'Backlog',
        pending: 'Pendente',
        'in-progress': 'Em Andamento',
        completed: 'Finalizado',
        overdue: 'Atrasado'
      };

      toast({
        title: "Status atualizado",
        description: `Atividade movida para ${statusNames[newStatus as keyof typeof statusNames]}`
      });
    }
  };

  const handleDeleteActivities = (activityIds: string[]) => {
    activityIds.forEach(id => {
      dispatch({ type: 'DELETE_ACTIVITY', payload: id });
    });
    toast({
      title: "Atividades excluídas",
      description: `${activityIds.length} atividade(s) foram excluídas com sucesso.`
    });
  };

  const handleArchiveActivity = (activityId: string) => {
    dispatch({ type: 'ARCHIVE_ACTIVITY', payload: activityId });
    toast({
      title: 'Atividade arquivada',
      description: 'A atividade foi movida para os arquivos.'
    });
  };

  const handleActivityClick = (activityId: string) => {
    navigate(`/activities/${activityId}`);
  };

  const handleCreateActivity = (formData: any) => {
    const newActivity = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      priority: formData.priority as 'high' | 'medium' | 'low',
      responsibleId: formData.responsibleId,
      companyId: formData.companyId,
      projectId: formData.projectId !== 'none' ? formData.projectId : undefined,
      workGroup: formData.workGroup,
      department: formData.department,
      type: formData.type as 'call' | 'meeting' | 'task' | 'other',
      status: 'backlog' as const,
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    toast({
      title: "Tarefa criada",
      description: "Nova tarefa foi criada com sucesso"
    });
    setIsCreateModalOpen(false);
  };

  const handleCreateQuickTask = (title: string, status: string) => {
    const newActivity = {
      id: Date.now().toString(),
      title,
      description: '',
      date: new Date(),
      priority: 'medium' as const,
      responsibleId: employees[0]?.id || '',
      companyId: '',
      type: 'task' as const,
      status: status as 'backlog' | 'pending' | 'in-progress' | 'completed' | 'overdue',
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
  };

  const handleViewModeChange = (value: string) => {
    setViewMode(value as any);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const getFilteredActivities = () => {
    let filtered = activities;
    
    if (selectedResponsibles.length > 0) {
      filtered = filtered.filter(activity => selectedResponsibles.includes(activity.responsibleId));
    }
    
    if (selectedWorkGroup) {
      filtered = filtered.filter(activity => activity.workGroup === selectedWorkGroup);
    }
    
    if (selectedDepartment) {
      filtered = filtered.filter(activity => activity.department === selectedDepartment);
    }
    
    if (selectedProject) {
      filtered = filtered.filter(activity => activity.projectId === selectedProject);
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
