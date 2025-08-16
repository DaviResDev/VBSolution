
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SafeSelectItem } from '@/components/ui/safe-select-item';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { Activity } from '@/contexts/VBContext';
import { createSafeSelectItems } from '@/utils/selectValidation';

interface ActivityFormProps {
  companies: any[];
  employees: any[];
  onSubmit: (formData: any) => void;
  initialData?: Activity;
}

const ActivityForm = ({ companies, employees, onSubmit, initialData }: ActivityFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    responsibleId: '',
    companyId: '',
    type: 'task' as 'call' | 'meeting' | 'task' | 'other',
    clientName: '',
    comments: '',
    files: [] as File[]
  });

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
        priority: initialData.priority || 'medium',
        responsibleId: initialData.responsibleId || '',
        companyId: initialData.companyId || '',
        type: initialData.type || 'task',
        clientName: '', // This field doesn't exist in Activity interface
        comments: '', // This field doesn't exist in Activity interface
        files: [] // Reset files when editing
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.responsibleId) {
      toast({
        title: "Erro",
        description: "Título, data e responsável são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const activityData = {
      ...formData,
      date: new Date(formData.date),
    };

    onSubmit(activityData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files)
      });
    }
  };

  // Create safe select items with enhanced validation
  const companyItems = createSafeSelectItems(
    (companies || []).filter(company => company && company.id && (company.fantasyName || company.cnpj)),
    (company) => company.id,
    (company) => `${company.fantasyName} - ${company.cnpj}`,
    'company'
  );

  const employeeItems = createSafeSelectItems(
    (employees || []).filter(employee => employee && employee.id && employee.name),
    (employee) => employee.id,
    (employee) => `${employee.name} - ${employee.position || 'N/A'}`,
    'employee'
  );

  const selectedCompany = companies.find(c => c.id === formData.companyId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título da Atividade *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Reunião de planejamento"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Atividade</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value: any) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SafeSelectItem value="call">Ligação</SafeSelectItem>
              <SafeSelectItem value="meeting">Reunião</SafeSelectItem>
              <SafeSelectItem value="task">Tarefa</SafeSelectItem>
              <SafeSelectItem value="other">Outro</SafeSelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyId">Empresa/Instituição</Label>
        <Select 
          value={formData.companyId || 'no-company'}
          onValueChange={(value) => setFormData({ ...formData, companyId: value === 'no-company' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma empresa registrada" />
          </SelectTrigger>
          <SelectContent>
            <SafeSelectItem value="no-company">Selecione uma empresa</SafeSelectItem>
            {companyItems.map((item) => (
              <SafeSelectItem key={item.key} value={item.value}>
                {item.label}
              </SafeSelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCompany && (
          <div className="p-2 bg-gray-50 rounded text-sm">
            <p><strong>CNPJ:</strong> {selectedCompany.cnpj}</p>
            <p><strong>Email:</strong> {selectedCompany.email}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">Nome do Cliente (Opcional)</Label>
        <Input
          id="clientName"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          placeholder="Nome específico do contato"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data e Hora *</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SafeSelectItem value="low">Baixa</SafeSelectItem>
              <SafeSelectItem value="medium">Média</SafeSelectItem>
              <SafeSelectItem value="high">Alta</SafeSelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibleId">Responsável *</Label>
        <Select 
          value={formData.responsibleId || 'no-responsible'}
          onValueChange={(value) => setFormData({ ...formData, responsibleId: value === 'no-responsible' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o responsável" />
          </SelectTrigger>
          <SelectContent>
            <SafeSelectItem value="no-responsible">Selecione o responsável</SafeSelectItem>
            {employeeItems.map((item) => (
              <SafeSelectItem key={item.key} value={item.value}>
                {item.label}
              </SafeSelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição da Tarefa</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva os detalhes da atividade..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentários</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Comentários adicionais..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="files">Arquivos (Todos os tipos)</Label>
        <div className="relative">
          <Input
            id="files"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('files')?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Arquivos
          </Button>
        </div>
        {formData.files.length > 0 && (
          <div className="text-sm text-gray-600">
            {formData.files.length} arquivo(s) selecionado(s)
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" className="vb-button-primary">
          {initialData ? 'Atualizar Atividade' : 'Criar Atividade'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
