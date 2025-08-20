import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  User, 
  Building2, 
  Target, 
  Users, 
  Clock, 
  FileText,
  MessageSquare,
  Paperclip,
  ArrowLeft,
  Edit,
  Save,
  X
} from 'lucide-react';

interface ActivityDetailModalProps {
  activity: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (activityId: string, updates: any) => Promise<void>;
  companies: any[];
  employees: any[];
}

const ActivityDetailModal = ({ 
  activity, 
  isOpen, 
  onClose, 
  onUpdate, 
  companies, 
  employees 
}: ActivityDetailModalProps) => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate(activity.id, editedActivity);
      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Atividade atualizada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar atividade",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedActivity(activity);
    setIsEditing(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('activity_comments')
        .insert([{
          activity_id: activity.id,
          user_id: profile?.id,
          comment: newComment.trim()
        }]);

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Comentário adicionado",
        description: "Comentário salvo com sucesso!"
      });
      
      // Recarregar a atividade para mostrar o novo comentário
      // Isso seria melhor implementado com um callback de atualização
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar comentário",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não definido';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return 'Não definida';
    const company = companies.find(c => c.id === companyId);
    return company ? company.fantasy_name || company.name : 'Empresa não encontrada';
  };

  const getEmployeeName = (employeeId: string | null) => {
    if (!employeeId) return 'Não definido';
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name || employee.full_name : 'Funcionário não encontrado';
  };

  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? 'Editar Atividade' : 'Detalhes da Atividade'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Informações Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  {isEditing ? (
                    <Input
                      value={editedActivity.title}
                      onChange={(e) => setEditedActivity({
                        ...editedActivity,
                        title: e.target.value
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{activity.title}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  {isEditing ? (
                    <Select
                      value={editedActivity.type}
                      onValueChange={(value) => setEditedActivity({
                        ...editedActivity,
                        type: value
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <option value="task">Tarefa</option>
                        <option value="meeting">Reunião</option>
                        <option value="call">Ligação</option>
                        <option value="other">Outro</option>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-gray-900 capitalize">{activity.type}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                {isEditing ? (
                  <Textarea
                    value={editedActivity.description || ''}
                    onChange={(e) => setEditedActivity({
                      ...editedActivity,
                      description: e.target.value
                    })}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {activity.description || 'Sem descrição'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedActivity.status}
                      onValueChange={(value) => setEditedActivity({
                        ...editedActivity,
                        status: value
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <option value="pending">Pendente</option>
                        <option value="in-progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                        <option value="overdue">Atrasada</option>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`mt-1 ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Prioridade</Label>
                  {isEditing ? (
                    <Select
                      value={editedActivity.priority}
                      onValueChange={(value) => setEditedActivity({
                        ...editedActivity,
                        priority: value
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`mt-1 ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Progresso</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedActivity.progress || 0}
                      onChange={(e) => setEditedActivity({
                        ...editedActivity,
                        progress: parseInt(e.target.value) || 0
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${activity.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{activity.progress || 0}%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas e Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas e Responsáveis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Data de Vencimento</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedActivity.due_date ? editedActivity.due_date.split('T')[0] : ''}
                      onChange={(e) => setEditedActivity({
                        ...editedActivity,
                        due_date: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{formatDate(activity.due_date)}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Início</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedActivity.start_date ? editedActivity.start_date.split('T')[0] : ''}
                      onChange={(e) => setEditedActivity({
                        ...editedActivity,
                        start_date: e.target.value ? new Date(e.target.value).toISOString() : null
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{formatDate(activity.start_date)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Responsável</Label>
                  {isEditing ? (
                    <Select
                      value={editedActivity.assigned_to || ''}
                      onValueChange={(value) => setEditedActivity({
                        ...editedActivity,
                        assigned_to: value || null
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecionar responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <option value="">Sem responsável</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name || employee.full_name}
                          </option>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {getEmployeeName(activity.assigned_to)}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Empresa</Label>
                  {isEditing ? (
                    <Select
                      value={editedActivity.company_id || ''}
                      onValueChange={(value) => setEditedActivity({
                        ...editedActivity,
                        company_id: value || null
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecionar empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        <option value="">Sem empresa</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.fantasy_name || company.name}
                          </option>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {getCompanyName(activity.company_id)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comentários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Adicionar comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comentar
                  </Button>
                </div>
                
                {/* Lista de comentários seria renderizada aqui */}
                <div className="text-center text-gray-500 py-4">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum comentário ainda</p>
                  <p className="text-sm">Seja o primeiro a comentar!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs font-medium text-gray-500">Criado por</Label>
                  <p className="mt-1">{getEmployeeName(activity.created_by)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">Data de Criação</Label>
                  <p className="mt-1">{formatDate(activity.created_at)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">Última Atualização</Label>
                  <p className="mt-1">{formatDate(activity.updated_at)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">ID da Atividade</Label>
                  <p className="mt-1 font-mono text-xs">{activity.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;
