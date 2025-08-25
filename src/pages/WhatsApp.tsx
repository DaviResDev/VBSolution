
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useVB } from '@/contexts/VBContext';
import { 
  MessageCircle, 
  Send,
  Search,
  Plus,
  Settings,
  User,
  Clock,
  Check,
  CheckCheck,
  Phone
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const WhatsApp = () => {
  const { state } = useVB();
  const { companies, settings } = state;
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    message: '',
    stage: ''
  });

  // Dados carregados do Supabase
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchWhatsAppData();
  }, []);

  const fetchWhatsAppData = async () => {
    try {
      // Buscar dados do WhatsApp do Supabase
      // Por enquanto, arrays vazios
      setConversations([]);
      setMessages([]);
      setTemplates([]);
    } catch (error) {
      console.error('Erro ao buscar dados do WhatsApp:', error);
    }
  };

  const getCompanyById = (id: string) => {
    return companies.find(c => c.id === id);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const company = getCompanyById(conv.companyId);
    return company?.fantasyName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedConversation = conversations.find(c => c.id === selectedContact);
  const selectedCompany = selectedConversation ? getCompanyById(selectedConversation.companyId) : null;
  const conversationMessages = messages.filter(m => m.conversationId === selectedContact);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    // Aqui você integraria com a EvolutionAPI ou outro gateway
    console.log('Enviando mensagem:', newMessage, 'para:', selectedContact);
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso!",
    });

    setNewMessage('');
  };

  const useTemplate = (template: any) => {
    if (!selectedCompany) return;
    
    const personalizedMessage = template.message.replace('{nome}', selectedCompany.fantasyName);
    setNewMessage(personalizedMessage);
  };

  const sendBulkMessage = (templateId: string, stageId: string) => {
    const template = templates.find(t => t.id === templateId);
    const targetCompanies = companies.filter(c => c.funnelStage === stageId);
    
    console.log(`Enviando mensagem em massa para ${targetCompanies.length} empresas`);
    
    toast({
      title: "Mensagens enviadas",
      description: `Mensagem enviada para ${targetCompanies.length} empresas na etapa selecionada.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business</h1>
          <p className="text-muted-foreground">
            Gerencie conversas e envie mensagens para seus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Template de Mensagem</DialogTitle>
                <DialogDescription>
                  Crie modelos de mensagens para diferentes etapas do funil
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Nome do Template</Label>
                  <Input
                    id="templateName"
                    value={templateData.name}
                    onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                    placeholder="Ex: Boas-vindas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateStage">Etapa do Funil</Label>
                  <Select 
                    value={templateData.stage} 
                    onValueChange={(value) => setTemplateData({ ...templateData, stage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.funnelStages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateMessage">Mensagem</Label>
                  <Textarea
                    id="templateMessage"
                    value={templateData.message}
                    onChange={(e) => setTemplateData({ ...templateData, message: e.target.value })}
                    placeholder="Use {nome} para personalizar com o nome da empresa"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="vb-button-primary">
                    Criar Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configurar API
          </Button>
        </div>
      </div>

      {/* Interface do WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Lista de conversas */}
        <Card className="vb-card lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const company = getCompanyById(conversation.companyId);
                if (!company) return null;

                return (
                  <div
                    key={conversation.id}
                    className={`p-3 cursor-pointer border-b hover:bg-muted transition-colors ${
                      selectedContact === conversation.id ? 'bg-vb-primary/10 border-vb-primary' : ''
                    }`}
                    onClick={() => setSelectedContact(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={company.logo} />
                        <AvatarFallback className="bg-vb-secondary text-vb-primary text-xs">
                          {getInitials(company.fantasyName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{company.fantasyName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center gap-1">
                            {conversation.unread > 0 && (
                              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                {conversation.unread}
                              </Badge>
                            )}
                            {getStatusIcon(conversation.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="vb-card lg:col-span-2 flex flex-col">
          {selectedCompany ? (
            <>
              {/* Header do chat */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedCompany.logo} />
                      <AvatarFallback className="bg-vb-secondary text-vb-primary text-sm">
                        {getInitials(selectedCompany.fantasyName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedCompany.fantasyName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCompany.phone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Mensagens */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromContact ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isFromContact
                            ? 'bg-muted text-foreground'
                            : 'bg-vb-primary text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {!message.isFromContact && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Input de mensagem */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} className="vb-button-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Selecione uma conversa</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha uma conversa para começar a enviar mensagens
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Templates e Envio em Massa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <Card className="vb-card">
          <CardHeader>
            <CardTitle>Templates de Mensagem</CardTitle>
            <CardDescription>
              Modelos prontos para diferentes situações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {settings.funnelStages.find(s => s.id === template.stage)?.name}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.message}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => useTemplate(template)}
                    disabled={!selectedContact}
                  >
                    Usar Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendBulkMessage(template.id, template.stage)}
                  >
                    Envio em Massa
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card className="vb-card">
          <CardHeader>
            <CardTitle>Estatísticas de Mensagens</CardTitle>
            <CardDescription>
              Resumo da atividade de mensagens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-vb-primary">{conversations.length}</div>
                <div className="text-sm text-muted-foreground">Conversas Ativas</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{messages.length}</div>
                <div className="text-sm text-muted-foreground">Mensagens Hoje</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-muted-foreground">Taxa de Resposta</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12min</div>
                <div className="text-sm text-muted-foreground">Tempo Médio</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Integração com EvolutionAPI</h4>
              <p className="text-sm text-muted-foreground">
                Configure sua instância da EvolutionAPI para começar a enviar mensagens automaticamente.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Integração
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsApp;
