import { useState } from 'react';
import { Plus, Users, List, Grid3X3, Calendar, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkGroupCreateModal from '@/components/WorkGroupCreateModal';
import WorkGroupDetailModal from '@/components/WorkGroupDetailModal';
import { toast } from '@/hooks/use-toast';

// Mock data para grupos de trabalho
const initialWorkGroups = [
  {
    id: 1,
    name: "Marketing Digital",
    description: "Equipe responsável pelas campanhas digitais e redes sociais",
    color: "#3B82F6",
    photo: "",
    sector: "Marketing",
    members: [
      { name: "Ana Silva", initials: "AS" },
      { name: "Carlos Lima", initials: "CL" },
      { name: "Maria Santos", initials: "MS" },
      { name: "João Costa", initials: "JC" }
    ],
    tasksCount: 12,
    completedTasks: 8,
    activeProjects: 3
  },
  {
    id: 2,
    name: "Desenvolvimento",
    description: "Equipe de desenvolvimento de software e sistemas",
    color: "#10B981",
    photo: "",
    sector: "Tecnologia",
    members: [
      { name: "Paulo Oliveira", initials: "PO" },
      { name: "Sandra Ferreira", initials: "SF" },
      { name: "Lucas Mendes", initials: "LM" }
    ],
    tasksCount: 18,
    completedTasks: 14,
    activeProjects: 5
  },
  {
    id: 3,
    name: "Vendas",
    description: "Equipe comercial responsável pelas vendas e relacionamento com clientes",
    color: "#F59E0B",
    photo: "",
    sector: "Comercial",
    members: [
      { name: "Roberto Dias", initials: "RD" },
      { name: "Juliana Costa", initials: "JC" }
    ],
    tasksCount: 9,
    completedTasks: 6,
    activeProjects: 2
  }
];

const WorkGroups = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [workGroups, setWorkGroups] = useState(initialWorkGroups);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const handleCreateWorkGroup = (workGroupData: any) => {
    const newWorkGroup = {
      id: Date.now(),
      name: workGroupData.name,
      description: workGroupData.description,
      color: workGroupData.color,
      photo: workGroupData.photo,
      sector: workGroupData.department || "Não definido",
      members: workGroupData.collaborators.map((name: string) => ({
        name,
        initials: name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)
      })),
      tasksCount: 0,
      completedTasks: 0,
      activeProjects: 0
    };

    setWorkGroups(prev => [newWorkGroup, ...prev]);
    toast({
      title: "Grupo criado",
      description: `Grupo "${workGroupData.name}" foi criado com sucesso`
    });
  };

  const handleWorkGroupClick = (workGroup: any) => {
    setSelectedWorkGroup(workGroup);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grupos de Trabalho</h1>
            <p className="text-gray-600 mt-2">
              Organize equipes e acompanhe atividades por grupos de trabalho
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex gap-2">
              <div className="flex">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </Button>
            <Button 
              className="bg-black hover:bg-gray-800 text-white"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Grupo
            </Button>
          </div>
        </div>

        {/* Stats Cards - Icons changed to black */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-black" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Grupos</p>
                  <p className="text-2xl font-bold text-gray-900">{workGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-black" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Membros</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workGroups.reduce((sum, group) => sum + group.members.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-black" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tarefas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workGroups.reduce((sum, group) => sum + group.tasksCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-black" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workGroups.reduce((sum, group) => sum + group.activeProjects, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Content */}
        <Card>
          <CardHeader>
            <CardTitle>Grupos de Trabalho</CardTitle>
            <CardDescription>
              Visualize todos os grupos organizados por setor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {workGroups.map((group) => (
                  <Card 
                    key={group.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleWorkGroupClick(group)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {group.photo ? (
                            <img
                              src={group.photo}
                              alt={group.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                              style={{ backgroundColor: group.color }}
                            >
                              {group.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {group.name}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {group.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">
                          {group.sector}
                        </Badge>
                        <Badge variant="secondary">
                          {group.members.length} membros
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progresso das Tarefas</span>
                          <span>{getProgressPercentage(group.completedTasks, group.tasksCount)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: group.color, 
                              width: `${getProgressPercentage(group.completedTasks, group.tasksCount)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{group.tasksCount}</p>
                          <p className="text-xs text-gray-600">Tarefas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{group.completedTasks}</p>
                          <p className="text-xs text-gray-600">Concluídas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{group.activeProjects}</p>
                          <p className="text-xs text-gray-600">Projetos</p>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Equipe</p>
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 5).map((member, index) => (
                            <Avatar key={index} className="border-2 border-white w-8 h-8">
                              <AvatarFallback className="text-xs bg-black text-white">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {group.members.length > 5 && (
                            <div className="w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">+{group.members.length - 5}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {workGroups.map((group) => (
                  <Card 
                    key={group.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleWorkGroupClick(group)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {group.photo ? (
                            <img
                              src={group.photo}
                              alt={group.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                              style={{ backgroundColor: group.color }}
                            >
                              {group.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                            <p className="text-gray-600">{group.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{group.sector}</Badge>
                              <Badge variant="secondary">{group.members.length} membros</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{group.tasksCount}</p>
                            <p className="text-sm text-gray-600">Tarefas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{group.completedTasks}</p>
                            <p className="text-sm text-gray-600">Concluídas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{group.activeProjects}</p>
                            <p className="text-sm text-gray-600">Projetos</p>
                          </div>
                          
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 3).map((member, index) => (
                              <Avatar key={index} className="border-2 border-white w-8 h-8">
                                <AvatarFallback className="text-xs bg-black text-white">
                                  {member.initials}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {group.members.length > 3 && (
                              <div className="w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">+{group.members.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {workGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum grupo de trabalho encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Crie seu primeiro grupo de trabalho para organizar suas equipes.
                </p>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Grupo de Trabalho
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Modal */}
        <WorkGroupCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateWorkGroup}
        />

        {/* Detail Modal */}
        <WorkGroupDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          workGroup={selectedWorkGroup}
        />
      </div>
    </div>
  );
};

export default WorkGroups;
