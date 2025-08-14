import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ArrowRight,
  Calendar,
  Star,
  Zap,
  BarChart3,
  UserCheck,
  CalendarDays,
  Target as TargetIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  progress: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  currentTask: string;
  efficiency: number;
}

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  team: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Reunião com cliente ABC',
    status: 'pending',
    priority: 'high',
    assignee: 'João Silva',
    dueDate: '2024-01-15',
    progress: 0
  },
  {
    id: '2',
    title: 'Desenvolvimento do dashboard',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Maria Santos',
    dueDate: '2024-01-20',
    progress: 65
  },
  {
    id: '3',
    title: 'Revisão de documentação',
    status: 'completed',
    priority: 'low',
    assignee: 'Carlos Oliveira',
    dueDate: '2024-01-10',
    progress: 100
  },
  {
    id: '4',
    title: 'Configuração de servidor',
    status: 'overdue',
    priority: 'high',
    assignee: 'Ana Costa',
    dueDate: '2024-01-08',
    progress: 30
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Desenvolvedor Senior',
    avatar: '/avatars/joao.jpg',
    status: 'online',
    currentTask: 'Dashboard Redesign',
    efficiency: 92
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'UX Designer',
    avatar: '/avatars/maria.jpg',
    status: 'busy',
    currentTask: 'Prototipagem',
    efficiency: 88
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    role: 'Product Manager',
    avatar: '/avatars/carlos.jpg',
    status: 'online',
    currentTask: 'Análise de Requisitos',
    efficiency: 95
  },
  {
    id: '4',
    name: 'Ana Costa',
    role: 'QA Engineer',
    avatar: '/avatars/ana.jpg',
    status: 'offline',
    currentTask: 'Testes de Integração',
    efficiency: 85
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Dashboard Redesign',
    status: 'active',
    progress: 75,
    team: ['João Silva', 'Maria Santos'],
    dueDate: '2024-02-15',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Sistema de Notificações',
    status: 'planning',
    progress: 20,
    team: ['Carlos Oliveira', 'Ana Costa'],
    dueDate: '2024-03-01',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'API de Integração',
    status: 'completed',
    progress: 100,
    team: ['João Silva', 'Carlos Oliveira'],
    dueDate: '2024-01-10',
    priority: 'high'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'in-progress':
      return <Activity className="h-4 w-4 text-blue-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'overdue':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Home() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const pendingActivities = mockActivities.filter(a => a.status === 'pending');
  const recentActivities = mockActivities.filter(a => a.status === 'completed').slice(0, 3);
  const inProgressActivities = mockActivities.filter(a => a.status === 'in-progress');
  const overdueActivities = mockActivities.filter(a => a.status === 'overdue');

  const efficiencyScore = Math.round(
    mockTeamMembers.reduce((acc, member) => acc + member.efficiency, 0) / mockTeamMembers.length
  );

  const taskCompletionRate = Math.round(
    (mockActivities.filter(a => a.status === 'completed').length / mockActivities.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="border-2 rounded-xl p-6 text-white" style={{ borderColor: '#021529' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#021529' }}>Bem-vindo de volta!</h1>
        <p style={{ color: '#021529' }}>Aqui está um resumo do que está acontecendo hoje</p>
      </div>

      {/* Efficiency Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiência da Equipe</p>
                <p className="text-2xl font-bold text-gray-900">{efficiencyScore}%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={efficiencyScore} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-gray-900">{taskCompletionRate}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={taskCompletionRate} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atividades Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingActivities.length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{mockProjects.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Atividades Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.assignee}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/activities">
                  Ver todas as atividades
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.assignee}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* In Progress Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inProgressActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{activity.assignee}</p>
                    <Progress value={activity.progress} className="h-2" />
                    <p className="text-xs text-gray-500">{activity.progress}% concluído</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Atrasadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-red-200 bg-red-50"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.assignee}</p>
                      <p className="text-xs text-red-600">Vencida em {activity.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team and Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Equipe de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.currentTask}</p>
                  </div>
                  <div className="text-right">
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' : 
                      member.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <p className="text-sm font-medium text-gray-900">{member.efficiency}%</p>
                    <p className="text-xs text-gray-500">Eficiência</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/employees">
                  Ver equipe completa
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TargetIcon className="h-5 w-5 text-purple-500" />
              Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Vencimento: {project.dueDate}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {project.team.length} membros
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/projects">
                  Ver todos os projetos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes da Atividade</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedActivity(null)}
              >
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedActivity.title}</h4>
                <p className="text-sm text-gray-600">Responsável: {selectedActivity.assignee}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(selectedActivity.priority)}>
                  {selectedActivity.priority}
                </Badge>
                <Badge className={getStatusColor(selectedActivity.status)}>
                  {selectedActivity.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Vencimento: {selectedActivity.dueDate}</span>
              </div>
              {selectedActivity.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{selectedActivity.progress}%</span>
                  </div>
                  <Progress value={selectedActivity.progress} className="h-2" />
                </div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link to="/activities">Ver Atividades</Link>
                </Button>
                <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Projeto</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedProject.name}</h4>
                <p className="text-sm text-gray-600">Status: {selectedProject.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(selectedProject.priority)}>
                  {selectedProject.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Vencimento: {selectedProject.dueDate}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{selectedProject.progress}%</span>
                </div>
                <Progress value={selectedProject.progress} className="h-2" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Equipe:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.team.map((member, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link to="/projects">Ver Projetos</Link>
                </Button>
                <Button variant="outline" onClick={() => setSelectedProject(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
