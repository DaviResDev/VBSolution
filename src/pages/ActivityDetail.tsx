
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVB } from '@/contexts/VBContext';
import { ArrowLeft, Calendar, User, Building2, Clock, Edit, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ActivityForm from '@/components/ActivityForm';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useVB();
  const { activities, companies, employees } = state;
  const [isEditing, setIsEditing] = useState(false);

  const activity = activities.find(a => a.id === id);
  const isNewActivity = id === 'new';

  useEffect(() => {
    if (isNewActivity) {
      setIsEditing(true);
    }
  }, [isNewActivity]);

  if (!activity && !isNewActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-sm text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Atividade não encontrada</h1>
            <Button onClick={() => navigate('/activities')} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Atividades
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return 'Sem empresa';
    const company = companies.find(c => c.id === companyId);
    return company?.fantasyName || 'Empresa não encontrada';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.name || 'Funcionário não encontrado';
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'backlog': 'bg-gray-100 text-gray-700 border-gray-200',
      'overdue': 'bg-red-100 text-red-700 border-red-200'
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.pending;
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      'completed': 'Concluída',
      'in-progress': 'Em Andamento',
      'pending': 'Pendente',
      'backlog': 'Backlog',
      'overdue': 'Atrasada'
    };
    return statusTexts[status as keyof typeof statusTexts] || 'Pendente';
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      'high': 'bg-red-100 text-red-700 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'low': 'bg-green-100 text-green-700 border-green-200'
    };
    return priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium;
  };

  const getPriorityText = (priority: string) => {
    const priorityTexts = {
      'high': 'Alta',
      'medium': 'Média',
      'low': 'Baixa'
    };
    return priorityTexts[priority as keyof typeof priorityTexts] || 'Média';
  };

  const handleSave = (formData: any) => {
    if (isNewActivity) {
      const newActivity = {
        id: Date.now().toString(),
        ...formData,
        status: 'backlog' as const,
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
      toast({
        title: "Sucesso",
        description: "Atividade criada com sucesso!",
      });
      navigate('/activities');
    } else {
      dispatch({
        type: 'UPDATE_ACTIVITY',
        payload: { ...activity, ...formData }
      });
      toast({
        title: "Sucesso",
        description: "Atividade atualizada com sucesso!",
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/activities')}
                className="bg-white border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {isNewActivity ? 'Nova Atividade' : activity?.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isNewActivity ? 'Criar uma nova atividade no sistema' : 'Detalhes e configurações da atividade'}
                </p>
              </div>
            </div>
            
            {!isNewActivity && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="bg-white border-gray-300"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        {isEditing ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-sm">
            <ActivityForm 
              companies={companies}
              employees={employees}
              onSubmit={handleSave}
              initialData={activity}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações Principais */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Informações da Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Título</label>
                    <p className="text-gray-900 font-medium">{activity?.title}</p>
                  </div>
                  
                  {activity?.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Descrição</label>
                      <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {activity?.date.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Responsável</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {getEmployeeName(activity?.responsibleId || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {activity?.companyId && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Empresa</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {getCompanyName(activity.companyId)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status e Métricas */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Status Atual</label>
                    <Badge className={`text-sm ${getStatusColor(activity?.status || 'pending')}`}>
                      {getStatusText(activity?.status || 'pending')}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Prioridade</label>
                    <Badge className={`text-sm ${getPriorityColor(activity?.priority || 'medium')}`}>
                      {getPriorityText(activity?.priority || 'medium')}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 text-sm">
                        {activity?.createdAt?.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetail;
