
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar, Building2, User } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProjectData {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  due_date?: string;
  budget?: number;
  company_id?: string;
  tags?: string[];
  notes?: string;
}

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectCreateModal = ({ isOpen, onClose }: ProjectCreateModalProps) => {
  const { user } = useAuth();
  const { createProject, loading } = useProjects();
  
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: '',
    due_date: '',
    budget: undefined,
    company_id: '',
    tags: [],
    notes: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dados de exemplo para empresas (serão substituídos por dados reais do Supabase)
  const companies = [
    { id: '1', name: 'TechCorp' },
    { id: '2', name: 'MarketingPro' },
    { id: '3', name: 'SalesForce Inc' },
    { id: '4', name: 'Digital Agency' },
    { id: '5', name: 'ConsultingGroup' }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar projetos",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Preparar dados do projeto
      const projectData = {
        ...formData,
        responsible_id: user.id, // VINCULAR AO USUÁRIO LOGADO
        currency: 'BRL',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // SALVAR NO SUPABASE usando o hook useProjects
      const savedProject = await createProject(projectData);
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `Projeto "${savedProject.name}" foi salvo na sua conta e no Supabase`,
      });

      // Limpar formulário
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        start_date: '',
        due_date: '',
        budget: undefined,
        company_id: '',
        tags: [],
        notes: ''
      });
      
      // Fechar modal
      onClose();
      
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Crie um novo projeto que será salvo na sua conta e no Supabase
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome do Projeto */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome do Projeto*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome do projeto"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva detalhadamente o projeto"
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Status e Prioridade */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProjectData['status']) => setFormData({ ...formData, status: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejado</SelectItem>
                  <SelectItem value="active">Em Andamento</SelectItem>
                  <SelectItem value="on_hold">Pausado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ProjectData['priority']) => setFormData({ ...formData, priority: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Datas */}
            <div>
              <Label htmlFor="start_date">
                <Calendar className="inline w-4 h-4 mr-2" />
                Data de Início
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="due_date">
                <Calendar className="inline w-4 h-4 mr-2" />
                Data de Entrega
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            {/* Orçamento */}
            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>

            {/* Empresa */}
            <div>
              <Label htmlFor="company">
                <Building2 className="inline w-4 h-4 mr-2" />
                Empresa (Opcional)
              </Label>
              <Select
                value={formData.company_id}
                onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma empresa</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite uma tag e pressione Enter"
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações, requisitos especiais, etc."
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          {/* Informações do usuário */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Projeto será salvo na sua conta</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Usuário: {user?.email || 'Não identificado'} | 
              ID: {user?.id ? `${user.id.substring(0, 8)}...` : 'Não identificado'}
            </p>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name || !formData.description}
            >
              {isSubmitting ? 'Salvando...' : 'Criar Projeto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreateModal;
