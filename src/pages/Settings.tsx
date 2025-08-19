
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Building2, 
  Users, 
  Shield, 
  Settings as SettingsIcon,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Upload,
  Trash2 as TrashIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  MapPin,
  Lock,
  Key,
  AlertTriangle
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { useToast } from '@/hooks/useToast';
import { AddItemModal } from '@/components/AddItemModal';
import { AddUserModal } from '@/components/AddUserModal';
import { EditItemModal } from '@/components/EditItemModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ColorPicker } from '@/components/ColorPicker';
import { LogoUpload } from '@/components/LogoUpload';
import { ToastContainer } from '@/components/ui/toast';

export default function Settings() {
  const isMobile = useIsMobile();
  const { success, error: showError, toasts, removeToast } = useToast();
  const {
    settings,
    areas,
    roles,
    users,
    loading,
    error,
    saveCompanySettings,
    addArea,
    editArea,
    deleteArea,
    addRole,
    editRole,
    deleteRole,
    saveRolePermissions,
    addUser,
    editUser,
    deleteUser,
    updateUserStatus,
    resetUserPassword,
    updateLogo,
    removeLogo,
  } = useCompanySettings();

  const [activeTab, setActiveTab] = useState('company');
  const [companyForm, setCompanyForm] = useState({
    company_name: '',
    default_language: 'pt-BR',
    default_timezone: 'America/Sao_Paulo',
    default_currency: 'BRL',
    datetime_format: 'DD/MM/YYYY HH:mm',
  });

  const [themeColors, setThemeColors] = useState({
    primary_color: '#021529',
    secondary_color: '#ffffff',
    accent_color: '#3b82f6',
  });

  const [securitySettings, setSecuritySettings] = useState({
    enable_2fa: false,
    password_policy: {
      min_length: 8,
      require_numbers: true,
      require_uppercase: true,
      require_special: true,
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Atualizar formulários quando settings mudar
  useEffect(() => {
    if (settings) {
      setCompanyForm({
        company_name: settings.company_name || '',
        default_language: settings.default_language || 'pt-BR',
        default_timezone: settings.default_timezone || 'America/Sao_Paulo',
        default_currency: settings.default_currency || 'BRL',
        datetime_format: settings.datetime_format || 'DD/MM/YYYY HH:mm',
      });
      setThemeColors({
        primary_color: settings.primary_color || '#021529',
        secondary_color: settings.secondary_color || '#ffffff',
        accent_color: settings.accent_color || '#3b82f6',
      });
      setSecuritySettings({
        enable_2fa: settings.enable_2fa || false,
        password_policy: settings.password_policy || {
          min_length: 8,
          require_numbers: true,
          require_uppercase: true,
          require_special: true,
        },
      });
    }
  }, [settings]);

  // Validar formulário da empresa
  const validateCompanyForm = () => {
    const errors: Record<string, string> = {};
    
    if (!companyForm.company_name.trim()) {
      errors.company_name = 'Nome da empresa é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers para formulários
  const handleCompanyFormChange = (field: string, value: string) => {
    setCompanyForm(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digita
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleThemeColorChange = (field: string, value: string) => {
    setThemeColors(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: any) => {
    if (field === 'password_policy') {
      setSecuritySettings(prev => ({ 
        ...prev, 
        password_policy: { ...prev.password_policy, ...value } 
      }));
    } else {
      setSecuritySettings(prev => ({ ...prev, [field]: value }));
    }
  };

  // Salvar configurações da empresa
  const handleSaveCompanySettings = async () => {
    if (!validateCompanyForm()) {
      showError('Erro de validação', 'Por favor, corrija os campos obrigatórios');
      return;
    }

    try {
      const result = await saveCompanySettings({
        ...companyForm,
        ...themeColors,
        ...securitySettings,
      });

      if (result.success) {
        // Aplicar tema globalmente
        document.documentElement.style.setProperty('--primary-color', themeColors.primary_color);
        document.documentElement.style.setProperty('--secondary-color', themeColors.secondary_color);
        document.documentElement.style.setProperty('--accent-color', themeColors.accent_color);
        
        success('Sucesso!', 'Configurações salvas com sucesso');
      } else {
        showError('Erro', 'Falha ao salvar configurações');
      }
    } catch (error) {
      showError('Erro', 'Erro inesperado ao salvar configurações');
      console.error('Erro ao salvar configurações:', error);
    }
  };

  // Salvar tema
  const handleSaveTheme = async () => {
    try {
      const result = await saveCompanySettings(themeColors);
      if (result.success) {
        // Aplicar tema globalmente
        document.documentElement.style.setProperty('--primary-color', themeColors.primary_color);
        document.documentElement.style.setProperty('--secondary-color', themeColors.secondary_color);
        document.documentElement.style.setProperty('--accent-color', themeColors.accent_color);
        success('Tema aplicado', 'Tema aplicado com sucesso!');
      } else {
        showError('Erro', 'Falha ao aplicar tema');
      }
    } catch (error) {
      showError('Erro', 'Erro inesperado ao aplicar tema');
      console.error('Erro ao aplicar tema:', error);
    }
  };

  // Handlers para CRUD com toasts
  const handleDeleteArea = async (id: string) => {
    try {
      const result = await deleteArea(id);
      if (result.success) {
        success('Área excluída', 'Área excluída com sucesso');
      } else {
        showError('Erro', 'Falha ao excluir área');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao excluir área');
      return { success: false, error };
    }
  };

  const handleAddArea = async (name: string, description?: string) => {
    try {
      const result = await addArea(name, description);
      if (result.success) {
        success('Área criada', 'Área criada com sucesso');
      } else {
        showError('Erro', 'Falha ao criar área');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao criar área');
      return { success: false, error };
    }
  };

  const handleEditArea = async (id: string, updates: Partial<CompanyArea>) => {
    try {
      const result = await editArea(id, updates);
      if (result.success) {
        success('Área atualizada', 'Área atualizada com sucesso');
      } else {
        showError('Erro', 'Falha ao atualizar área');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao atualizar área');
      return { success: false, error };
    }
  };

  const handleAddRole = async (name: string, description?: string) => {
    try {
      const result = await addRole(name, description);
      if (result.success) {
        success('Cargo criado', 'Cargo criado com sucesso');
      } else {
        showError('Erro', 'Falha ao criar cargo');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao criar cargo');
      return { success: false, error };
    }
  };

  const handleEditRole = async (id: string, updates: Partial<CompanyRole>) => {
    try {
      const result = await editRole(id, updates);
      if (result.success) {
        success('Cargo atualizado', 'Cargo atualizado com sucesso');
      } else {
        showError('Erro', 'Falha ao atualizar cargo');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao atualizar cargo');
      return { success: false, error };
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const result = await deleteRole(id);
      if (result.success) {
        success('Cargo excluído', 'Cargo excluído com sucesso');
      } else {
        showError('Erro', 'Falha ao excluir cargo');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao excluir cargo');
      return { success: false, error };
    }
  };

  const handleSavePermissions = async (roleId: string, permissions: Record<string, boolean>) => {
    try {
      const result = await saveRolePermissions(roleId, permissions);
      if (result.success) {
        success('Permissões salvas', 'Permissões do cargo atualizadas com sucesso');
      } else {
        showError('Erro', 'Falha ao salvar permissões');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao salvar permissões');
      return { success: false, error };
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const result = await deleteUser(id);
      if (result.success) {
        success('Usuário excluído', 'Usuário excluído com sucesso');
      } else {
        showError('Erro', 'Falha ao excluir usuário');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao excluir usuário');
      return { success: false, error };
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const result = await updateUserStatus(userId, newStatus);
      if (result.success) {
        const statusText = newStatus === 'active' ? 'ativado' : newStatus === 'inactive' ? 'desativado' : 'aprovado';
        success('Status alterado', `Usuário ${statusText} com sucesso`);
      } else {
        showError('Erro', 'Falha ao alterar status do usuário');
      }
      return result;
    } catch (error) {
      showError('Erro', 'Erro inesperado ao alterar status');
      return { success: false, error };
    }
  };

  // Toggle de usuário expandido
  const toggleUserExpanded = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  // Badges de status
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: React.ReactNode; text: string }> = {
      active: {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <UserCheck className="h-3 w-3" />,
        text: 'Ativo'
      },
      pending: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />,
        text: 'Pendente'
      },
      inactive: {
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <UserX className="h-3 w-3" />,
        text: 'Inativo'
      },
      suspended: {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <AlertTriangle className="h-3 w-3" />,
        text: 'Suspenso'
      },
    };

    const variant = variants[status] || variants.inactive;
    return (
      <Badge className={`${variant.className} flex items-center gap-1 border`}>
        {variant.icon}
        {variant.text}
      </Badge>
    );
  };

  // Ações de status
  const getStatusActions = (user: any) => {
    const currentStatus = user.status;
    
    if (currentStatus === 'active') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange(user.id, 'inactive')}
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          Desativar
        </Button>
      );
    } else if (currentStatus === 'inactive') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange(user.id, 'active')}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          Ativar
        </Button>
      );
    } else if (currentStatus === 'pending') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange(user.id, 'active')}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          Aprovar
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange(user.id, 'active')}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          Reativar
        </Button>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333]">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações do sistema e da empresa</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} w-full bg-white shadow-sm border border-gray-200`}>
            <TabsTrigger value="company" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Building2 className="h-4 w-4" />
              {!isMobile && 'Empresa'}
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <SettingsIcon className="h-4 w-4" />
              {!isMobile && 'Estrutura'}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              {!isMobile && 'Usuários'}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Shield className="h-4 w-4" />
              {!isMobile && 'Segurança'}
            </TabsTrigger>
          </TabsList>

          {/* Tela 1 - Empresa */}
          <TabsContent value="company" className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informações da Empresa
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                    Nome da empresa *
                  </Label>
                  <Input
                    id="company_name"
                    value={companyForm.company_name}
                    onChange={(e) => handleCompanyFormChange('company_name', e.target.value)}
                    placeholder="Digite o nome da empresa"
                    className={`h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary ${
                      formErrors.company_name ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {formErrors.company_name && (
                    <p className="text-sm text-red-600">{formErrors.company_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_language" className="text-sm font-medium text-gray-700">
                    Idioma padrão
                  </Label>
                  <Select value={companyForm.default_language} onValueChange={(value) => handleCompanyFormChange('default_language', value)}>
                    <SelectTrigger className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                      <SelectItem value="es">Espanhol</SelectItem>
                      <SelectItem value="fr">Francês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_timezone" className="text-sm font-medium text-gray-700">
                    Fuso horário padrão
                  </Label>
                  <Select value={companyForm.default_timezone} onValueChange={(value) => handleCompanyFormChange('default_timezone', value)}>
                    <SelectTrigger className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                      <SelectItem value="America/Belem">Belém (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_currency" className="text-sm font-medium text-gray-700">
                    Moeda padrão
                  </Label>
                  <Select value={companyForm.default_currency} onValueChange={(value) => handleCompanyFormChange('default_currency', value)}>
                    <SelectTrigger className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL (Real Brasileiro)</SelectItem>
                      <SelectItem value="USD">USD (Dólar Americano)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (Libra Esterlina)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="datetime_format" className="text-sm font-medium text-gray-700">
                    Formato de data e hora
                  </Label>
                  <Select value={companyForm.datetime_format} onValueChange={(value) => handleCompanyFormChange('datetime_format', value)}>
                    <SelectTrigger className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY HH:mm">DD/MM/YYYY HH:mm</SelectItem>
                      <SelectItem value="MM/DD/YYYY HH:mm">MM/DD/YYYY HH:mm</SelectItem>
                      <SelectItem value="YYYY-MM-DD HH:mm">YYYY-MM-DD HH:mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleSaveCompanySettings}
                  className="bg-primary text-white rounded-md px-6 py-2 hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tela 2 - Estrutura da Empresa */}
          <TabsContent value="structure" className="space-y-6">
            {/* Seção: Áreas */}
            <Collapsible className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Áreas da Empresa</h3>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="flex justify-end mb-4">
                  <AddItemModal
                    title="Adicionar Área"
                    itemType="area"
                    onAdd={handleAddArea}
                  />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Nome da Área</TableHead>
                      <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {areas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                          Nenhuma área cadastrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      areas.map((area) => (
                        <TableRow key={area.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{area.name}</TableCell>
                          <TableCell className="text-gray-600">{area.description || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <EditItemModal
                                item={area}
                                itemType="area"
                                onEdit={handleEditArea}
                              />
                              <DeleteConfirmModal
                                itemName={area.name}
                                itemType="area"
                                onDelete={() => handleDeleteArea(area.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção: Cargos */}
            <Collapsible className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Cargos</h3>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="flex justify-end mb-4">
                  <AddItemModal
                    title="Adicionar Cargo"
                    itemType="role"
                    onAdd={handleAddRole}
                  />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Nome do Cargo</TableHead>
                      <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                          Nenhum cargo cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map((role) => (
                        <TableRow key={role.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell className="text-gray-600">{role.description || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <EditItemModal
                                item={role}
                                itemType="role"
                                onEdit={handleEditRole}
                              />
                              <DeleteConfirmModal
                                itemName={role.name}
                                itemType="role"
                                onDelete={() => handleDeleteRole(role.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção: Permissões por Cargo */}
            <Collapsible className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Permissões por Cargo (RBAC)</h3>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Selecionar Cargo</Label>
                    <Select>
                      <SelectTrigger className="w-64 h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                        <SelectValue placeholder="Selecione um cargo para configurar permissões" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Dashboard */}
                    <div className="space-y-3 p-4 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Dashboard</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="view_dashboard" />
                          <Label htmlFor="view_dashboard" className="text-sm font-normal">
                            Ver dashboard
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hide_dashboard" />
                          <Label htmlFor="hide_dashboard" className="text-sm font-normal">
                            Ocultar dashboard
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Tarefas */}
                    <div className="space-y-3 p-4 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Tarefas</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="create_tasks" />
                          <Label htmlFor="create_tasks" className="text-sm font-normal">
                            Criar tarefas
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="edit_tasks" />
                          <Label htmlFor="edit_tasks" className="text-sm font-normal">
                            Editar tarefas
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="delete_tasks" />
                          <Label htmlFor="delete_tasks" className="text-sm font-normal">
                            Excluir tarefas
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Relatórios */}
                    <div className="space-y-3 p-4 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Relatórios</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="access_reports" />
                          <Label htmlFor="access_reports" className="text-sm font-normal">
                            Acessar relatórios
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Configurações */}
                    <div className="space-y-3 p-4 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Configurações</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="manage_settings" />
                          <Label htmlFor="manage_settings" className="text-sm font-normal">
                            Gerenciar configurações
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Clientes */}
                    <div className="space-y-3 p-4 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Clientes</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="create_edit_clients" />
                          <Label htmlFor="create_edit_clients" className="text-sm font-normal">
                            Criar e editar clientes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="view_own_data" />
                          <Label htmlFor="view_own_data" className="text-sm font-normal">
                            Ver somente dados próprios
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-3 p-4 border rounded-lg">
                      <h5 className="font-medium text-gray-900">WhatsApp</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="send_messages" />
                          <Label htmlFor="send_messages" className="text-sm font-normal">
                            Enviar mensagens
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-primary text-white rounded-md px-6 py-2 hover:bg-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Permissões
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção: Identidade Visual */}
            <Collapsible className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Identidade Visual</h3>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Logo da empresa</Label>
                    <LogoUpload
                      currentLogoUrl={settings.logo_url}
                      onLogoChange={updateLogo}
                      onLogoRemove={removeLogo}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ColorPicker
                      label="Cor Primária"
                      value={themeColors.primary_color}
                      onChange={(value) => handleThemeColorChange('primary_color', value)}
                    />
                    <ColorPicker
                      label="Cor Secundária"
                      value={themeColors.secondary_color}
                      onChange={(value) => handleThemeColorChange('secondary_color', value)}
                    />
                    <ColorPicker
                      label="Cor de Destaque"
                      value={themeColors.accent_color}
                      onChange={(value) => handleThemeColorChange('accent_color', value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveTheme} className="bg-primary text-white rounded-md px-6 py-2 hover:bg-primary/90">
                      <Palette className="h-4 w-4 mr-2" />
                      Aplicar Tema
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* Tela 3 - Usuários e Permissões */}
          <TabsContent value="users" className="space-y-6">
            {/* Cadastro de Usuário */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#333] flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Cadastro de Usuário
                </h2>
                <AddUserModal
                  areas={areas}
                  roles={roles}
                  onAdd={addUser}
                />
              </div>
            </div>

            {/* Lista de Usuários */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Lista de Usuários
              </h2>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                    <TableHead className="font-semibold text-gray-700">E-mail</TableHead>
                    <TableHead className="font-semibold text-gray-700">Cargo</TableHead>
                    <TableHead className="font-semibold text-gray-700">Área</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        Nenhum usuário cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <>
                        <TableRow key={user.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell className="text-gray-600">{user.email}</TableCell>
                          <TableCell className="text-gray-600">
                            {roles.find(r => r.id === user.role_id)?.name || '-'}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {areas.find(a => a.id === user.area_id)?.name || '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {getStatusActions(user)}
                              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DeleteConfirmModal
                                itemName={user.full_name}
                                itemType="user"
                                onDelete={() => handleDeleteUser(user.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Linha expandível */}
                        {expandedUsers.has(user.id) && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Último login:</span>
                                    <span className="text-gray-600">
                                      {user.last_login ? new Date(user.last_login).toLocaleString('pt-BR') : 'Nunca'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">IP:</span>
                                    <span className="text-gray-600">{user.last_login_ip || '-'}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Data de nascimento:</span>
                                    <span className="text-gray-600">
                                      {user.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : '-'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Telefone:</span>
                                    <span className="text-gray-600">{user.phone || '-'}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tela 4 - Segurança */}
          <TabsContent value="security" className="space-y-6">
            {/* 2FA */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Autenticação de Dois Fatores (2FA)
              </h2>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Ativar 2FA</Label>
                  <p className="text-sm text-gray-600">Requer autenticação adicional para login</p>
                </div>
                <Switch
                  checked={securitySettings.enable_2fa}
                  onCheckedChange={(checked) => handleSecurityChange('enable_2fa', checked)}
                />
              </div>
            </div>

            {/* Política de Senha */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Política de Senha
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min_length" className="text-sm font-medium text-gray-700">
                    Mínimo de caracteres
                  </Label>
                  <Input
                    id="min_length"
                    type="number"
                    value={securitySettings.password_policy.min_length}
                    onChange={(e) => handleSecurityChange('password_policy', {
                      min_length: parseInt(e.target.value)
                    })}
                    className="w-32 h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                    min="6"
                    max="20"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Requisitos da senha</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.password_policy.require_numbers}
                        onCheckedChange={(checked) => handleSecurityChange('password_policy', {
                          require_numbers: checked
                        })}
                      />
                      <Label className="text-sm text-gray-700">Exigir números</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.password_policy.require_uppercase}
                        onCheckedChange={(checked) => handleSecurityChange('password_policy', {
                          require_uppercase: checked
                        })}
                      />
                      <Label className="text-sm text-gray-700">Exigir letras maiúsculas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.password_policy.require_special}
                        onCheckedChange={(checked) => handleSecurityChange('password_policy', {
                          require_special: checked
                        })}
                      />
                      <Label className="text-sm text-gray-700">Exigir caracteres especiais</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tentativas de Login Falhas */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Tentativas de Login Falhas
              </h2>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Data/Hora</TableHead>
                    <TableHead className="font-semibold text-gray-700">IP</TableHead>
                    <TableHead className="font-semibold text-gray-700">Usuário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      Nenhuma tentativa de login falha registrada
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Alterar Senha */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Alterar Senha
              </h2>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current_password" className="text-sm font-medium text-gray-700">
                    Senha atual
                  </Label>
                  <Input
                    id="current_password"
                    type="password"
                    className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="Digite sua senha atual"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                    Nova senha
                  </Label>
                  <Input
                    id="new_password"
                    type="password"
                    className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="Digite a nova senha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                    Confirmar nova senha
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    className="h-10 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="Confirme a nova senha"
                  />
                </div>
                <Button className="w-full bg-primary text-white rounded-md hover:bg-primary/90">
                  Alterar Senha
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Botão FAB para mobile */}
        {isMobile && activeTab === 'company' && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={handleSaveCompanySettings}
              className="rounded-full w-14 h-14 shadow-lg bg-primary text-white hover:bg-primary/90"
            >
              <Save className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Container de Toasts */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
