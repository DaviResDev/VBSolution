import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVB } from '@/contexts/VBContext';
import { useNavigate } from 'react-router-dom';
import { 
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Star
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const Dashboard = () => {
  const { state } = useVB();
  const { companies, employees, activities, settings, currentUser } = state;
  const navigate = useNavigate();

  // Métricas calculadas
  const overdueActivities = activities.filter(a => new Date(a.date) < new Date() && a.status !== 'completed').length;
  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const inProgressActivities = activities.filter(a => a.status === 'in-progress').length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;

  // Dados para gráficos
  const companiesByStage = settings.funnelStages.map(stage => ({
    name: stage.name,
    value: companies.filter(c => c.funnelStage === stage.id).length,
    color: '#6b7280' // Cor neutra para todos
  }));

  // Dados para o gráfico de linha "Horas Totais"
  const totalHoursData = [
    { month: 'Jan', hours: 240 },
    { month: 'Feb', hours: 320 },
    { month: 'Mar', hours: 280 },
    { month: 'Apr', hours: 380 },
    { month: 'Mai', hours: 420 },
    { month: 'Jun', hours: 360 },
  ];

  // Ranking da equipe
  const teamRanking = [
    { name: 'Ana Silva', role: 'Desenvolvedora Senior', hours: 180, tasks: 24, efficiency: 95 },
    { name: 'Carlos Santos', role: 'Product Manager', hours: 165, tasks: 21, efficiency: 92 },
    { name: 'Maria Costa', role: 'Designer UX/UI', hours: 170, tasks: 18, efficiency: 88 },
    { name: 'João Oliveira', role: 'Desenvolvedor Full Stack', hours: 155, tasks: 15, efficiency: 85 },
    { name: 'Paula Lima', role: 'QA Engineer', hours: 140, tasks: 12, efficiency: 82 },
  ];

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.name || 'Funcionário não encontrado';
  };

  // Função para obter saudação baseada na hora do dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom Dia';
    if (hour < 18) return 'Boa Tarde';
    return 'Boa Noite';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Principal - Estilo ClickUp */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 mb-1">{getGreeting()}, {currentUser?.name || 'Usuário'}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Seção de Atividades - Estilo ClickUp */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atividades Pendentes */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-base font-medium text-gray-900">Atividades Pendentes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                {activities.filter(a => a.status === 'pending').slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Atribuído a {getEmployeeName(activity.responsibleId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-gray-300 text-gray-700 bg-gray-50"
                      >
                        {activity.priority === 'high' ? 'high' : activity.priority === 'medium' ? 'medium' : 'low'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                        pending
                      </Badge>
                    </div>
                  </div>
                ))}
                {pendingActivities === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhuma atividade pendente</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900 text-xs">
                    Ver todas as atividades →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-base font-medium text-gray-900">Atividades Recentes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                {activities.filter(a => a.status === 'completed').slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Atribuído a {getEmployeeName(activity.responsibleId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-gray-300 text-gray-700 bg-gray-50"
                      >
                        {activity.priority === 'high' ? 'high' : activity.priority === 'medium' ? 'medium' : 'low'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                        completed
                      </Badge>
                    </div>
                  </div>
                ))}
                {completedActivities === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhuma atividade concluída</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Status - Estilo ClickUp */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Em Andamento */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-base font-medium text-gray-900">Em Andamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                {activities.filter(a => a.status === 'in-progress').slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Atribuído a {getEmployeeName(activity.responsibleId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-gray-300 text-gray-700 bg-gray-50"
                      >
                        {activity.priority === 'high' ? 'high' : activity.priority === 'medium' ? 'medium' : 'low'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {inProgressActivities === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhuma atividade em andamento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Atrasadas */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-base font-medium text-gray-900">Atrasadas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                {activities.filter(a => new Date(a.date) < new Date() && a.status !== 'completed').slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Atribuído a {getEmployeeName(activity.responsibleId)}</p>
                        <p className="text-xs text-gray-600">Vencida em {new Date(activity.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-gray-300 text-gray-700 bg-gray-50"
                      >
                        {activity.priority === 'high' ? 'high' : activity.priority === 'medium' ? 'medium' : 'low'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                        overdue
                      </Badge>
                    </div>
                  </div>
                ))}
                {overdueActivities === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhuma atividade atrasada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Empresas por etapa do funil */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <div>
                  <CardTitle className="text-base font-medium text-gray-900">Pipeline de Vendas</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Distribuição dos leads por etapa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={companiesByStage}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#6b7280"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {companiesByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Horas Totais */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-600" />
                <div>
                  <CardTitle className="text-base font-medium text-gray-900">Horas Trabalhadas</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Evolução mensal da equipe</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={totalHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#374151" 
                    strokeWidth={2}
                    dot={{ fill: '#374151', strokeWidth: 1, r: 4 }}
                    activeDot={{ r: 6, stroke: '#374151', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ranking da Equipe */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 text-gray-600" />
              <div>
                <CardTitle className="text-base font-medium text-gray-900">Top Performers</CardTitle>
                <CardDescription className="text-xs text-gray-500">Ranking dos colaboradores mais eficientes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {teamRanking.map((member, index) => (
                <div key={member.name} className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index === 0 ? 'bg-gray-50' : ''
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                      index === 0 ? 'bg-gray-800 text-white' :
                      index === 1 ? 'bg-gray-600 text-white' :
                      index === 2 ? 'bg-gray-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{member.hours}h</p>
                      <p className="text-xs text-gray-500">Horas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{member.tasks}</p>
                      <p className="text-xs text-gray-500">Tarefas</p>
                    </div>
                    <div className="text-center">
                      <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {member.efficiency}%
                      </div>
                      <p className="text-xs text-gray-500">Eficiência</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
