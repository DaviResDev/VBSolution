
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVB } from '@/contexts/VBContext';
import { 
  Clock, 
  User, 
  Building2, 
  AlertTriangle,
  CheckCircle,
  Play,
  Archive,
  Calendar,
  RotateCcw
} from 'lucide-react';
import ActivityFilters from './ActivityFilters';

interface KanbanBoardProps {
  activities: any[];
  onUpdateStatus: (activityId: string, newStatus: string) => void;
  onActivityClick: (activityId: string) => void;
}

const KanbanBoard = ({ activities, onUpdateStatus, onActivityClick }: KanbanBoardProps) => {
  const { state } = useVB();
  const { companies, employees, currentUser } = state;
  const [draggedActivity, setDraggedActivity] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    cargo: '',
    mes: '',
    ano: '',
    semana: '',
    dia: '',
    data: '',
    hora: ''
  });
  const [priorityFilter, setPriorityFilter] = useState('all');

  const columns = [
    { 
      id: 'backlog', 
      name: 'Backlog', 
      icon: Archive, 
      color: 'bg-gray-50/80 border-gray-300',
      headerColor: 'text-gray-700',
      count: activities.filter(a => a.status === 'backlog').length
    },
    { 
      id: 'pending', 
      name: 'Pendente', 
      icon: Clock, 
      color: 'bg-yellow-50/80 border-yellow-300',
      headerColor: 'text-yellow-700',
      count: activities.filter(a => a.status === 'pending').length
    },
    { 
      id: 'in-progress', 
      name: 'Em Andamento', 
      icon: Play, 
      color: 'bg-blue-50/80 border-blue-300',
      headerColor: 'text-blue-700',
      count: activities.filter(a => a.status === 'in-progress').length
    },
    { 
      id: 'completed', 
      name: 'Finalizado', 
      icon: CheckCircle, 
      color: 'bg-green-50/80 border-green-300',
      headerColor: 'text-green-700',
      count: activities.filter(a => a.status === 'completed').length
    }
  ];

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return 'Sem empresa';
    const company = companies.find(c => c.id === companyId);
    return company?.fantasyName || 'Empresa não encontrada';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.name || 'Funcionário não encontrado';
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap = {
      low: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      high: 'bg-red-100 text-red-700 border-red-300'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const isOverdue = (activity: any) => {
    if (activity.status === 'completed') return false;
    return new Date(activity.date) < new Date();
  };

  const handleDragStart = (activityId: string) => {
    setDraggedActivity(activityId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedActivity) {
      onUpdateStatus(draggedActivity, columnId);
      setDraggedActivity(null);
    }
  };

  const handleEndCycle = () => {
    if (currentUser?.role === 'admin') {
      console.log('Encerrando ciclo...');
    }
  };

  const getFilteredActivities = (columnId: string) => {
    let filtered = activities.filter(activity => activity.status === columnId);
    
    // Filtro por prioridade
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(a => a.priority === priorityFilter);
    }
    
    return filtered;
  };

  const priorityButtons = [
    { key: 'all', label: 'Todas', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { key: 'high', label: 'Alta', color: 'bg-red-100 text-red-700 border-red-300' },
    { key: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { key: 'low', label: 'Baixa', color: 'bg-green-100 text-green-700 border-green-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <ActivityFilters filters={filters} onFiltersChange={setFilters} />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kanban Board</h2>
              <p className="text-gray-600 mt-1">Visualize e gerencie o fluxo de atividades</p>
            </div>
            {currentUser?.role === 'admin' && (
              <Button onClick={handleEndCycle} variant="outline" size="sm" className="bg-white border-gray-300">
                <RotateCcw className="h-4 w-4 mr-2" />
                Encerrar Ciclo
              </Button>
            )}
          </div>

          {/* Filtros por Prioridade */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <AlertTriangle className="h-4 w-4" />
              Filtrar por Prioridade:
            </div>
            <div className="flex flex-wrap gap-2">
              {priorityButtons.map((button) => (
                <Button
                  key={button.key}
                  variant="outline"
                  size="sm"
                  onClick={() => setPriorityFilter(button.key)}
                  className={`border-2 transition-all duration-200 hover:scale-105 ${
                    priorityFilter === button.key 
                      ? `${button.color} shadow-md` 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnActivities = getFilteredActivities(column.id);

          return (
            <div
              key={column.id}
              className={`${column.color} backdrop-blur-sm rounded-xl border-2 p-4 flex flex-col shadow-sm`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Header da coluna */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300/50">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${column.headerColor}`} />
                  <h3 className={`font-semibold text-sm ${column.headerColor}`}>{column.name}</h3>
                </div>
                <Badge variant="secondary" className="bg-white/80 text-gray-700 font-medium px-2 py-1">
                  {columnActivities.length}
                </Badge>
              </div>

              {/* Atividades */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnActivities.map((activity) => (
                  <Card
                    key={activity.id}
                    className="cursor-move hover:shadow-md transition-all duration-200 bg-white/95 backdrop-blur-sm border border-gray-200/50 h-auto min-h-[140px]"
                    draggable
                    onDragStart={() => handleDragStart(activity.id)}
                    onClick={() => onActivityClick(activity.id)}
                  >
                    <CardHeader className="pb-2 px-4 pt-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 text-gray-900 flex-1 mr-2">
                          {activity.title}
                        </CardTitle>
                        <Badge className={`text-xs px-2 py-1 font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority === 'low' ? 'Baixa' : 
                           activity.priority === 'medium' ? 'Média' : 'Alta'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 py-2 space-y-2">
                      {/* Informações da atividade */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">
                            {activity.date.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-3 w-3" />
                          <span className="truncate text-xs">
                            {getEmployeeName(activity.responsibleId)}
                          </span>
                        </div>
                        {activity.companyId && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate text-xs">
                              {getCompanyName(activity.companyId)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Indicador de atraso */}
                      {isOverdue(activity) && activity.status !== 'completed' && (
                        <div className="flex items-center gap-1 text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Atrasado</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Estado vazio */}
                {columnActivities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Icon className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-xs font-medium">Nenhuma atividade</p>
                    <p className="text-xs opacity-75">Arraste atividades para cá</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
