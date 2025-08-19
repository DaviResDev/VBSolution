
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
  Phone,
  QrCode,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  Bot
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { whatsappHybridService, WhatsAppSession, WhatsAppAtendimento, WhatsAppMensagem, WhatsAppConfiguracao } from '@/services/whatsappHybridService';

const WhatsApp = () => {
  const { state } = useVB();
  const { companies, settings } = state;
  
  // Estados do WhatsApp
  const [whatsappSession, setWhatsappSession] = useState<WhatsAppSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  
  // Estados dos atendimentos
  const [atendimentos, setAtendimentos] = useState<WhatsAppAtendimento[]>([]);
  const [selectedAtendimento, setSelectedAtendimento] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<WhatsAppMensagem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados dos modais
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  
  // Estados de configuração
  const [configData, setConfigData] = useState<WhatsAppConfiguracao | null>(null);
  
  const [templateData, setTemplateData] = useState({
    name: '',
    message: '',
    stage: ''
  });

  // Estados de loading
  const [isLoadingAtendimentos, setIsLoadingAtendimentos] = useState(false);

  // Efeitos
  useEffect(() => {
    loadWhatsAppStatus();
    loadAtendimentos();
    loadConfiguracao();
    
    // Polling para status do WhatsApp
    const interval = setInterval(loadWhatsAppStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedAtendimento) {
      loadMensagens(selectedAtendimento);
    }
  }, [selectedAtendimento]);

  // Funções de conexão com o WhatsApp
  const loadWhatsAppStatus = async () => {
    try {
      const session = await whatsappHybridService.getSessionStatus();
      setWhatsappSession(session);
      
      if (session?.status === 'error') {
        setConnectionError('Erro na conexão WhatsApp');
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  const connectWhatsApp = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      toast({
        title: "Conectando WhatsApp...",
        description: "Gerando QR Code para conexão...",
      });

      const result = await whatsappHybridService.connectWhatsApp();
      
      if (result.success && result.qrCode) {
        setQrCodeData(result.qrCode);
        setIsQRModalOpen(true);
        
        toast({
          title: "QR Code Gerado!",
          description: "Escaneie o QR Code com seu WhatsApp para conectar.",
        });
        
        await loadWhatsAppStatus();
      } else {
        throw new Error('Falha na geração do QR Code');
      }
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      setConnectionError('Erro ao conectar WhatsApp');
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível gerar o QR Code.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      const success = await whatsappHybridService.disconnectWhatsApp();
      
      if (success) {
        setQrCodeData(null);
        setIsQRModalOpen(false);
        
        toast({
          title: "WhatsApp Desconectado",
          description: "Sessão encerrada com sucesso.",
        });
        await loadWhatsAppStatus();
      }
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
    }
  };

  // Funções de atendimento
  const loadAtendimentos = async () => {
    try {
      setIsLoadingAtendimentos(true);
      const data = await whatsappHybridService.getAtendimentos();
      setAtendimentos(data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
      toast({
        title: "Erro ao Carregar",
        description: "Não foi possível carregar os atendimentos.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAtendimentos(false);
    }
  };

  const loadMensagens = async (atendimentoId: string) => {
    try {
      const data = await whatsappHybridService.getMensagens(atendimentoId);
      setMensagens(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedAtendimento) return;

    try {
      const mensagem: Omit<WhatsAppMensagem, 'id' | 'created_at'> = {
        atendimento_id: selectedAtendimento,
        conteudo: newMessage,
        tipo: 'TEXTO',
        remetente: 'ATENDENTE',
        timestamp: new Date().toISOString(),
        lida: false
      };

      const result = await whatsappHybridService.sendMensagem(mensagem);
      
      if (result) {
        setMensagens(prev => [...prev, result]);
        setNewMessage('');
        
        toast({
          title: "Mensagem Enviada",
          description: "Sua mensagem foi enviada com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao Enviar",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      });
    }
  };

  // Funções de configuração
  const loadConfiguracao = async () => {
    try {
      const data = await whatsappHybridService.getConfiguracao();
      setConfigData(data);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const saveConfiguracao = async () => {
    if (!configData) return;

    try {
      const success = await whatsappHybridService.updateConfiguracao(configData.id, configData);
      
      if (success) {
        toast({
          title: "Configuração Salva",
          description: "As configurações foram salvas com sucesso!",
        });
        setIsConfigModalOpen(false);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  // Funções auxiliares
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGUARDANDO': return 'bg-yellow-100 text-yellow-800';
      case 'EM_ATENDIMENTO': return 'bg-blue-100 text-blue-800';
      case 'FINALIZADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AGUARDANDO': return 'Aguardando';
      case 'EM_ATENDIMENTO': return 'Em Atendimento';
      case 'FINALIZADO': return 'Finalizado';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getSessionStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const filteredAtendimentos = atendimentos.filter(atendimento =>
    atendimento.numero_cliente.includes(searchTerm) ||
    (atendimento.nome_cliente && atendimento.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedAtendimentoData = atendimentos.find(a => a.id === selectedAtendimento);

  const isConnected = whatsappSession?.status === 'connected';

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
          <Button
            variant="outline"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
          <Button
            variant={isConnected ? "destructive" : "default"}
            onClick={isConnected ? disconnectWhatsApp : connectWhatsApp}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : isConnected ? (
              <WifiOff className="mr-2 h-4 w-4" />
            ) : (
              <Wifi className="mr-2 h-4 w-4" />
            )}
            {isConnected ? 'Desconectar' : 'Conectar WhatsApp'}
          </Button>
        </div>
      </div>

      {/* Status do WhatsApp */}
      <Card className="vb-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getSessionStatusColor(whatsappSession?.status || 'disconnected')}`} />
              <span className="font-medium">
                Status: {getSessionStatusText(whatsappSession?.status || 'disconnected')}
              </span>
              {whatsappSession?.qr_code && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  QR Code Disponível
                </Badge>
              )}
              {connectionError && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Erro de Conexão
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Sessão: {whatsappSession?.session_name || 'vbsolution-main'}</span>
              {isConnected && (
                <span className="text-green-600">• Online</span>
              )}
            </div>
          </div>
          
          {connectionError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Erro de Conexão:</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{connectionError}</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setConnectionError(null)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interface do WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Lista de atendimentos */}
        <Card className="vb-card lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Atendimentos</CardTitle>
              <Badge variant="secondary">{atendimentos.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar atendimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {isLoadingAtendimentos ? (
                <div className="p-4 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Carregando atendimentos...
                </div>
              ) : filteredAtendimentos.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p>Nenhum atendimento encontrado</p>
                  <p className="text-sm">Conecte o WhatsApp para começar</p>
                </div>
              ) : (
                filteredAtendimentos.map((atendimento) => (
                  <div
                    key={atendimento.id}
                    className={`p-3 cursor-pointer border-b hover:bg-muted transition-colors ${
                      selectedAtendimento === atendimento.id ? 'bg-vb-primary/10 border-vb-primary' : ''
                    }`}
                    onClick={() => setSelectedAtendimento(atendimento.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-vb-secondary text-vb-primary text-xs">
                          {atendimento.nome_cliente ? 
                            atendimento.nome_cliente.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) :
                            atendimento.numero_cliente.substring(0, 2)
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {atendimento.nome_cliente || atendimento.numero_cliente}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(atendimento.status)}`}
                          >
                            {getStatusText(atendimento.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate">
                            {atendimento.numero_cliente}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(atendimento.ultima_mensagem)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="vb-card lg:col-span-2 flex flex-col">
          {selectedAtendimentoData ? (
            <>
              {/* Header do chat */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-vb-secondary text-vb-primary text-sm">
                        {selectedAtendimentoData.nome_cliente ? 
                          selectedAtendimentoData.nome_cliente.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) :
                          selectedAtendimentoData.numero_cliente.substring(0, 2)
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedAtendimentoData.nome_cliente || 'Cliente'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedAtendimentoData.numero_cliente}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(selectedAtendimentoData.status)}
                    >
                      {getStatusText(selectedAtendimentoData.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Mensagens */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`flex ${mensagem.remetente === 'CLIENTE' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          mensagem.remetente === 'CLIENTE'
                            ? 'bg-muted text-foreground'
                            : 'bg-vb-primary text-white'
                        }`}
                      >
                        <p className="text-sm">{mensagem.conteudo}</p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <span className="text-xs opacity-70">
                            {formatDate(mensagem.timestamp)}
                          </span>
                          {mensagem.remetente === 'ATENDENTE' && (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          )}
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
                    disabled={!isConnected}
                  />
                  <Button 
                    onClick={sendMessage} 
                    className="vb-button-primary"
                    disabled={!isConnected || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Selecione um atendimento</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha um atendimento para começar a conversar
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Estatísticas */}
      <Card className="vb-card">
        <CardHeader>
          <CardTitle>Estatísticas do WhatsApp</CardTitle>
          <CardDescription>
            Resumo da atividade de mensagens e atendimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-vb-primary">{atendimentos.length}</div>
              <div className="text-sm text-muted-foreground">Total Atendimentos</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {atendimentos.filter(a => a.status === 'EM_ATENDIMENTO').length}
              </div>
              <div className="text-sm text-muted-foreground">Em Atendimento</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {atendimentos.filter(a => a.status === 'AGUARDANDO').length}
              </div>
              <div className="text-sm text-muted-foreground">Aguardando</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mensagens.length}</div>
              <div className="text-sm text-muted-foreground">Total Mensagens</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal QR Code */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code com seu WhatsApp para conectar
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            {qrCodeData ? (
              <>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img 
                    src={qrCodeData} 
                    alt="QR Code WhatsApp" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    📱 Abra o WhatsApp no seu celular
                  </p>
                  <p className="text-sm text-muted-foreground">
                    🔍 Toque em <strong>Menu</strong> → <strong>WhatsApp Web</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📷 Aponte a câmera para o QR Code acima
                  </p>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={() => setIsQRModalOpen(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Fechar
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p>Gerando QR Code...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Configurações */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurações do Robô</DialogTitle>
            <DialogDescription>
              Configure as mensagens automáticas e comportamento do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {configData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mensagemBoasVindas">Mensagem de Boas-vindas</Label>
                    <Textarea
                      id="mensagemBoasVindas"
                      value={configData.mensagem_boas_vindas}
                      onChange={(e) => setConfigData({ ...configData, mensagem_boas_vindas: e.target.value })}
                      placeholder="Mensagem exibida quando um cliente inicia contato..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensagemMenu">Mensagem do Menu</Label>
                    <Textarea
                      id="mensagemMenu"
                      value={configData.mensagem_menu}
                      onChange={(e) => setConfigData({ ...configData, mensagem_menu: e.target.value })}
                      placeholder="Mensagem com as opções disponíveis..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensagemDespedida">Mensagem de Despedida</Label>
                  <Textarea
                    id="mensagemDespedida"
                    value={configData.mensagem_despedida}
                    onChange={(e) => setConfigData({ ...configData, mensagem_despedida: e.target.value })}
                    placeholder="Mensagem exibida ao finalizar atendimento..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempoResposta">Tempo de Resposta (segundos)</Label>
                    <Input
                      id="tempoResposta"
                      type="number"
                      value={configData.tempo_resposta}
                      onChange={(e) => setConfigData({ ...configData, tempo_resposta: parseInt(e.target.value) || 300 })}
                      min="1"
                      max="3600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTentativas">Máximo de Tentativas</Label>
                    <Input
                      id="maxTentativas"
                      type="number"
                      value={configData.max_tentativas}
                      onChange={(e) => setConfigData({ ...configData, max_tentativas: parseInt(e.target.value) || 3 })}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={saveConfiguracao} className="vb-button-primary">
                    Salvar Configurações
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p>Carregando configurações...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsApp;
