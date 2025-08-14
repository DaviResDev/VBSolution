
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Building2, User, Bell, Palette, Globe, Shield, Database, Download, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    topBarColor, 
    sidebarColor, 
    setTopBarColor, 
    setSidebarColor 
  } = useTheme();
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('VBSolution');
  const [companyEmail, setCompanyEmail] = useState('contato@vbsolution.com');
  const [companyPhone, setCompanyPhone] = useState('(11) 99999-9999');
  const [companyAddress, setCompanyAddress] = useState('São Paulo, SP');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [autoSave, setAutoSave] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  // Load settings from localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('userLogo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCompanyLogo(result);
        localStorage.setItem('userLogo', result);
        
        // Trigger custom event to update TopBar immediately
        const event = new CustomEvent('customStorageChange', {
          detail: { key: 'userLogo', value: result }
        });
        window.dispatchEvent(event);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    localStorage.removeItem('userLogo');
    
    // Trigger custom event to update TopBar immediately
    const event = new CustomEvent('customStorageChange', {
      detail: { key: 'userLogo', value: null }
    });
    window.dispatchEvent(event);
  };

  const handleSaveSettings = () => {
    // Salvar configurações no localStorage ou API
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyEmail', companyEmail);
    localStorage.setItem('companyPhone', companyPhone);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('language', language);
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('autoSave', autoSave.toString());
    localStorage.setItem('backupFrequency', backupFrequency);
    


    // Mostrar feedback de sucesso
    alert('Configurações salvas com sucesso!');
  };

  const handleExportSettings = () => {
    const settings = {
      companyLogo,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      notifications,
      language,
      timezone,
      autoSave,
      backupFrequency
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vbsolution-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    if (confirm('Tem certeza que deseja redefinir todas as configurações? Esta ação não pode ser desfeita.')) {
      // Resetar para valores padrão
      setCompanyName('VBSolution');
      setCompanyEmail('contato@vbsolution.com');
      setCompanyPhone('(11) 99999-9999');
      setCompanyAddress('São Paulo, SP');
      setNotifications(true);
      setLanguage('pt-BR');
      setTimezone('America/Sao_Paulo');
      setAutoSave(true);
      setBackupFrequency('daily');
      
      // Limpar localStorage
      localStorage.removeItem('userLogo');
      localStorage.removeItem('companyName');
      localStorage.removeItem('companyEmail');
      localStorage.removeItem('companyPhone');
      localStorage.removeItem('companyAddress');
      localStorage.removeItem('language');
      localStorage.removeItem('timezone');
      localStorage.removeItem('autoSave');
      localStorage.removeItem('backupFrequency');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações do sistema e da empresa</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            <Trash2 className="h-4 w-4 mr-2" />
            Redefinir
          </Button>
          <Button onClick={handleSaveSettings}>
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Usuário
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* Configurações da Empresa */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Configure as informações básicas da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo da Empresa */}
              <div className="space-y-4">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <label htmlFor="company-logo-upload" className="cursor-pointer">
                      <div className="w-24 h-24 flex items-center justify-center">
                        {companyLogo ? (
                          <img 
                            src={companyLogo} 
                            alt="Logo da empresa" 
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-xs text-gray-500 font-medium">Clique para adicionar</div>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id="company-logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleLogoUpload}
                      className="hidden"
                />
              </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Formatos aceitos: PNG, JPEG, JPG
                    </p>
                    <p className="text-sm text-gray-600">
                      Tamanho recomendado: 200x200 pixels
                    </p>
                    {companyLogo && (
                      <Button variant="outline" size="sm" onClick={handleRemoveLogo}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover Logo
              </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informações da Empresa */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                    <Input
                    id="company-email"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                  />
              </div>

                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input
                    id="company-phone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Input
                    id="company-address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Cidade, Estado"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Usuário */}
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Configurações do Usuário
              </CardTitle>
              <CardDescription>
                Gerencie suas preferências pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                      <SelectItem value="America/Belem">Belém (UTC-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar Notificações</Label>
                  <p className="text-sm text-gray-500">
                    Receba notificações sobre atividades importantes
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Novas Atividades</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Leads e Oportunidades</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lembretes de Prazo</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Atualizações do Sistema</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-gray-500">
                    Ativar tema escuro para o sistema
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Cores Personalizáveis</h4>
                
                {/* Cor da Top Bar */}
                <div className="space-y-2">
                  <Label htmlFor="topbar-color">Cor da Top Bar</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="topbar-color"
                      type="color"
                      value={topBarColor}
                      onChange={(e) => setTopBarColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded-lg cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={topBarColor}
                      onChange={(e) => setTopBarColor(e.target.value)}
                      placeholder="#021529"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Cor da Sidebar */}
                <div className="space-y-2">
                  <Label htmlFor="sidebar-color">Cor da Sidebar</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="sidebar-color"
                      type="color"
                      value={sidebarColor}
                      onChange={(e) => setSidebarColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded-lg cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={sidebarColor}
                      onChange={(e) => setSidebarColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Cores Predefinidas</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { name: 'Azul Escuro', value: '#021529' },
                      { name: 'Verde Escuro', value: '#064e3b' },
                      { name: 'Roxo Escuro', value: '#581c87' },
                      { name: 'Vermelho Escuro', value: '#7f1d1d' },
                      { name: 'Cinza Escuro', value: '#1f2937' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTopBarColor(color.value)}
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sistema
              </CardTitle>
              <CardDescription>
                Configurações avançadas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Salvamento Automático</Label>
                  <p className="text-sm text-gray-500">
                    Salvar alterações automaticamente
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Informações do Sistema</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Versão:</span>
                    <span className="ml-2 text-gray-600">1.0.0</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Última Atualização:</span>
                    <span className="ml-2 text-gray-600">15/01/2025</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Banco de Dados:</span>
                    <span className="ml-2 text-gray-600">PostgreSQL 14</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Servidor:</span>
                    <span className="ml-2 text-gray-600">Ubuntu 22.04</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
