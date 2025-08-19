
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProjectData {
  name: string;
  description: string;
  responsible: string;
  company: string;
  tags: string[];
  status: 'Em Andamento' | 'Concluído' | 'Pausado' | 'Planejado';
  dueDate?: string;
}

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: ProjectData) => void;
}

const ProjectCreateModal = ({ isOpen, onClose, onSubmit }: ProjectCreateModalProps) => {
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    responsible: '',
    company: '',
    tags: [],
    status: 'Planejado',
    dueDate: ''
  });
  const [tagInput, setTagInput] = useState('');

  const companies = [
    'TechCorp',
    'MarketingPro',
    'SalesForce Inc',
    'Digital Agency',
    'ConsultingGroup'
  ];

  const responsibles = [
    'João Silva',
    'Maria Santos',
    'Carlos Oliveira',
    'Ana Costa',
    'Pedro Almeida'
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.responsible) {
      onSubmit(formData);
      setFormData({
        name: '',
        description: '',
        responsible: '',
        company: '',
        tags: [],
        status: 'Planejado',
        dueDate: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Nome */}
            <div>
              <Label htmlFor="name">Nome do Projeto*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome do projeto"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description">Descrição*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o projeto"
                rows={3}
                required
              />
            </div>

            {/* Responsável e Empresa */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsible">Responsável*</Label>
                <Select value={formData.responsible} onValueChange={(value) => setFormData({ ...formData, responsible: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles.map((responsible) => (
                      <SelectItem key={responsible} value={responsible}>
                        {responsible}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company">Empresa</Label>
                <Select value={formData.company} onValueChange={(value) => setFormData({ ...formData, company: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status e Prazo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planejado">Planejado</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Prazo</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
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
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar Projeto</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreateModal;
