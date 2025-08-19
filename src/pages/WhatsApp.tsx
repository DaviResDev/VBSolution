
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Smartphone, 
  Send, 
  Phone, 
  PhoneOff,
  RefreshCw,
  Trash2,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { WhatsAppStatus, WhatsAppMessage } from '@/types';

const WhatsAppPage: React.FC = () => {
  const [status, setStatus] = useState<WhatsAppStatus>({
    connected: false,
    sessionId: 'default',
    lastActivity: new Date(),
    status: 'disconnected'
  });
  
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<string>('default');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const socket = useSocket('/whatsapp');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Conectar ao Socket.IO
  useEffect(() => {
    if (socket) {
      // Inscrever na sessão atual
      socket.emit('whatsapp:subscribe', { sessionName: currentSession });

      // Escutar eventos do WhatsApp
      socket.on('whatsapp:qr_code', (data) => {
        if (data.sessionName === currentSession) {
          setQrCode(data.qrCode);
          setStatus(prev => ({ ...prev, status: 'qr_ready' }));
          toast.success('QR Code gerado! Escaneie com seu WhatsApp.');
        }
      });

      socket.on('whatsapp:ready', (data) => {
        if (data.sessionName === currentSession) {
          setQrCode(null);
          setStatus(prev => ({ ...prev, connected: true, status: 'connected' }));
          toast.success('WhatsApp conectado com sucesso!');
          loadMessages();
        }
      });

      socket.on('whatsapp:state_change', (data) => {
        if (data.sessionName === currentSession) {
          setStatus(prev => ({ ...prev, status: data.status }));
        }
      });

      socket.on('whatsapp:message', (data) => {
        if (data.sessionName === currentSession) {
          setMessages(prev => [data.message, ...prev]);
        }
      });

      return () => {
        socket.off('whatsapp:qr_code');
        socket.off('whatsapp:ready');
        socket.off('whatsapp:state_change');
        socket.off('whatsapp:message');
      };
    }
  }, [socket, currentSession]);

  // Carregar status inicial
  useEffect(() => {
    loadStatus();
    loadSessions();
  }, [currentSession]);

  const loadStatus = async () => {
    try {
      const response = await fetch(`/api/whatsapp/status?sessionName=${currentSession}`, {
        headers: {
          'Authorization': `Bearer VB_DEV_TOKEN`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.data);
        if (data.data.connected) {
          loadMessages();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/whatsapp/sessions', {
        headers: {
          'Authorization': `Bearer VB_DEV_TOKEN`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/whatsapp/messages?sessionName=${currentSession}&limit=100`, {
        headers: {
          'Authorization': `Bearer VB_DEV_TOKEN`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.reverse()); // Inverter para mostrar mais recentes por último
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/whatsapp/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer VB_DEV_TOKEN`
        },
        body: JSON.stringify({ sessionName: currentSession })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data.qrCode) {
          setQrCode(data.data.qrCode);
          setStatus(prev => ({ ...prev, status: 'qr_ready' }));
          toast.success('QR Code gerado! Escaneie com seu WhatsApp.');
        } else {
          toast.success('Sessão iniciada com sucesso!');
          loadStatus();
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao iniciar sessão');
      }
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      toast.error('Erro ao iniciar sessão');
    } finally {
      setIsConnecting(false);
    }
  };

  const stopSession = async () => {
    try {
      const response = await fetch(`/api/whatsapp/stop-session?sessionName=${currentSession}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer VB_DEV_TOKEN`
        }
      });
      
      if (response.ok) {
        setQrCode(null);
        setStatus(prev => ({ ...prev, connected: false, status: 'disconnected' }));
        setMessages([]);
        toast.success('Sessão encerrada');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao encerrar sessão');
      }
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  const deleteSession = async () => {
    if (!confirm('Tem certeza que deseja remover esta sessão?')) return;
    
    try {
      const response = await fetch(`/api/whatsapp/sessions/${currentSession}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer VB_DEV_TOKEN`
        }
      });
      
      if (response.ok) {
        toast.success('Sessão removida');
        setCurrentSession('default');
        loadSessions();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao remover sessão');
      }
    } catch (error) {
      console.error('Erro ao remover sessão:', error);
      toast.error('Erro ao remover sessão');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !status.connected) return;
    
    try {
      const response = await fetch('/api/whatsapp/send-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer VB_DEV_TOKEN`
        },
        body: JSON.stringify({ 
          to: '5511999999999', // Número padrão para teste
          text: newMessage 
        })
      });
      
      if (response.ok) {
        // Adicionar mensagem localmente
        const message: WhatsAppMessage = {
          id: Date.now().toString(),
          atendimentoId: 'test',
          conteudo: newMessage,
          tipo: 'TEXT',
          remetente: 'ATENDENTE',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        toast.success('Mensagem enviada');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'qr_ready': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'qr_ready': return 'QR Code Pronto';
      case 'error': return 'Erro';
      default: return 'Desconectado';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            WhatsApp Business
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas conversas e sessões do WhatsApp
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            className={`${getStatusColor(status.status)} text-white`}
          >
            {getStatusText(status.status)}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadStatus}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Sessões</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversa WhatsApp</span>
                <div className="flex items-center space-x-2">
                  {!status.connected && !qrCode && (
                    <Button
                      onClick={startSession}
                      disabled={isConnecting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isConnecting ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Phone className="h-4 w-4 mr-2" />
                      )}
                      {isConnecting ? 'Conectando...' : 'Conectar WhatsApp'}
                    </Button>
                  )}
                  
                  {status.connected && (
                    <Button
                      onClick={stopSession}
                      variant="destructive"
                      size="sm"
                    >
                      <PhoneOff className="h-4 w-4 mr-2" />
                      Desconectar
                    </Button>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                {status.connected 
                  ? 'WhatsApp conectado e funcionando'
                  : 'Conecte seu WhatsApp para começar a conversar'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* QR Code */}
              {qrCode && (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={qrCode} 
                      alt="QR Code WhatsApp" 
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escaneie este QR Code com seu WhatsApp para conectar
                  </p>
                </div>
              )}

              {/* Chat */}
              {status.connected && (
                <div className="space-y-4">
                  <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.remetente === 'ATENDENTE' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.remetente === 'ATENDENTE'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.conteudo}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Sessões WhatsApp</span>
              </CardTitle>
              <CardDescription>
                Gerencie suas sessões ativas do WhatsApp
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-lg border ${
                      session.name === currentSession 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{session.name}</h3>
                          <p className="text-sm text-gray-500">
                            Status: {getStatusText(session.status)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Criada em: {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusText(session.status)}
                        </Badge>
                        
                        {session.name === currentSession ? (
                          <Badge variant="outline">Ativa</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentSession(session.name)}
                          >
                            Ativar
                          </Button>
                        )}
                        
                        {session.name !== 'default' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSession()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações do WhatsApp</span>
              </CardTitle>
              <CardDescription>
                Configure as opções do seu WhatsApp Business
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sessão Atual</label>
                  <Input value={currentSession} disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Input value={getStatusText(status.status)} disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Última Atividade</label>
                  <Input 
                    value={status.lastActivity.toLocaleString()} 
                    disabled 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sessão ID</label>
                  <Input value={status.sessionId} disabled />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Informações da API</h4>
                  <p className="text-sm text-gray-500">
                    Endpoint: /api/whatsapp
                  </p>
                </div>
                
                <Button variant="outline" onClick={loadStatus}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppPage;
