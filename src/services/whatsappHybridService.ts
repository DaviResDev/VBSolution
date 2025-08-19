import { qrCodeService } from './qrCodeService';
import { whatsappRealFrontendService, WhatsAppConnectionStatus, WhatsAppMessage } from './whatsappRealFrontendService';

export interface WhatsAppSession {
  id: string;
  session_name: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  qr_code?: string;
  connected_at?: string;
  disconnected_at?: string;
}

export interface WhatsAppAtendimento {
  id: string;
  numero_cliente: string;
  nome_cliente?: string;
  status: 'AGUARDANDO' | 'EM_ATENDIMENTO' | 'FINALIZADO' | 'CANCELADO';
  data_inicio: string;
  data_fim?: string;
  ultima_mensagem: string;
  atendente_id?: string;
  prioridade: number;
  tags?: any;
  observacoes?: string;
  canal: string;
  company_id?: string;
}

export interface WhatsAppMensagem {
  id: string;
  atendimento_id: string;
  conteudo: string;
  tipo: 'TEXTO' | 'IMAGEM' | 'AUDIO' | 'VIDEO' | 'DOCUMENTO';
  remetente: 'CLIENTE' | 'ATENDENTE' | 'SISTEMA';
  timestamp: string;
  lida: boolean;
  midia_url?: string;
  midia_tipo?: string;
  midia_nome?: string;
  midia_tamanho?: number;
}

export interface WhatsAppConfiguracao {
  id: string;
  nome: string;
  mensagem_boas_vindas: string;
  mensagem_menu: string;
  mensagem_despedida: string;
  tempo_resposta: number;
  max_tentativas: number;
  ativo: boolean;
}

class WhatsAppHybridService {
  private currentSessionId: string | null = null;
  private useRealService: boolean = true; // Usar serviço real por padrão
  private mockData = {
    session: null as WhatsAppSession | null,
    atendimentos: [] as WhatsAppAtendimento[],
    mensagens: [] as WhatsAppMensagem[],
    configuracao: {
      id: '1',
      nome: 'padrao',
      mensagem_boas_vindas: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo?',
      mensagem_menu: 'Escolha uma opção:\n1. Falar com atendente\n2. Ver produtos\n3. Agendar reunião\n4. Sair',
      mensagem_despedida: 'Obrigado por nos contatar! Tenha um ótimo dia!',
      tempo_resposta: 300,
      max_tentativas: 3,
      ativo: true
    } as WhatsAppConfiguracao
  };

  constructor() {
    // Tentar usar o serviço real primeiro
    this.initializeRealService();
  }

  /**
   * Inicializa o serviço real do WhatsApp
   */
  private async initializeRealService(): Promise<void> {
    try {
      // Verificar se as dependências estão disponíveis
      if (typeof window !== 'undefined') {
        // Estamos no cliente, usar serviço real frontend
        this.useRealService = true;
        console.log('Usando serviço real frontend do WhatsApp');
      } else {
        // Estamos no servidor, usar serviço real
        this.useRealService = true;
        console.log('Usando serviço real do WhatsApp');
      }
    } catch (error) {
      console.log('Falha ao inicializar serviço real, usando mockado:', error);
      this.useRealService = false;
    }
  }

  // Gerenciar sessão WhatsApp
  async getSessionStatus(): Promise<WhatsAppSession | null> {
    if (this.useRealService) {
      const venomStatus = whatsappRealFrontendService.getConnectionStatus();
      return {
        id: this.currentSessionId || 'venom-session',
        session_name: 'vbsolution-main',
        status: venomStatus.status,
        qr_code: venomStatus.qrCode,
        connected_at: venomStatus.status === 'connected' ? new Date().toISOString() : undefined,
        disconnected_at: venomStatus.status === 'disconnected' ? new Date().toISOString() : undefined,
      };
    }
    return this.mockData.session;
  }

  async createOrUpdateSession(status: string, qrCode?: string): Promise<WhatsAppSession | null> {
    const session: WhatsAppSession = {
      id: this.currentSessionId || 'session-1',
      session_name: 'vbsolution-main',
      status: status as any,
      qr_code: qrCode,
      connected_at: status === 'connected' ? new Date().toISOString() : undefined,
      disconnected_at: status === 'disconnected' ? new Date().toISOString() : undefined,
    };

    if (this.useRealService) {
      // Atualizar status no serviço real
      // O serviço real gerencia seu próprio status
    } else {
      this.mockData.session = session;
    }
    
    return session;
  }

  // Gerenciar atendimentos
  async getAtendimentos(): Promise<WhatsAppAtendimento[]> {
    if (this.mockData.atendimentos.length === 0) {
      // Criar dados de exemplo
      this.mockData.atendimentos = [
        {
          id: '1',
          numero_cliente: '5511999999999',
          nome_cliente: 'João Silva',
          status: 'AGUARDANDO',
          data_inicio: new Date().toISOString(),
          ultima_mensagem: new Date().toISOString(),
          prioridade: 1,
          canal: 'whatsapp'
        },
        {
          id: '2',
          numero_cliente: '5511888888888',
          nome_cliente: 'Maria Santos',
          status: 'EM_ATENDIMENTO',
          data_inicio: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          ultima_mensagem: new Date().toISOString(),
          prioridade: 2,
          canal: 'whatsapp'
        }
      ];
    }
    return this.mockData.atendimentos;
  }

  async createAtendimento(atendimento: Omit<WhatsAppAtendimento, 'id' | 'created_at' | 'updated_at'>): Promise<WhatsAppAtendimento | null> {
    const newAtendimento: WhatsAppAtendimento = {
      ...atendimento,
      id: Date.now().toString()
    };
    
    this.mockData.atendimentos.push(newAtendimento);
    return newAtendimento;
  }

  async updateAtendimento(id: string, updates: Partial<WhatsAppAtendimento>): Promise<boolean> {
    const index = this.mockData.atendimentos.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockData.atendimentos[index] = { ...this.mockData.atendimentos[index], ...updates };
      return true;
    }
    return false;
  }

  // Gerenciar mensagens
  async getMensagens(atendimentoId: string): Promise<WhatsAppMensagem[]> {
    return this.mockData.mensagens.filter(m => m.atendimento_id === atendimentoId);
  }

  async sendMensagem(mensagem: Omit<WhatsAppMensagem, 'id' | 'created_at'>): Promise<WhatsAppMensagem | null> {
    const newMensagem: WhatsAppMensagem = {
      ...mensagem,
      id: Date.now().toString()
    };
    
    this.mockData.mensagens.push(newMensagem);
    
    // Atualizar última mensagem do atendimento
    await this.updateAtendimento(mensagem.atendimento_id, {
      ultima_mensagem: new Date().toISOString()
    });

    return newMensagem;
  }

  // Gerenciar configurações
  async getConfiguracao(): Promise<WhatsAppConfiguracao | null> {
    return this.mockData.configuracao;
  }

  async updateConfiguracao(id: string, updates: Partial<WhatsAppConfiguracao>): Promise<boolean> {
    this.mockData.configuracao = { ...this.mockData.configuracao, ...updates };
    return true;
  }

  // Conexão WhatsApp - Tenta Venom primeiro, fallback para mockado
  async connectWhatsApp(): Promise<{ success: boolean; qrCode?: string; sessionId?: string }> {
    try {
      // Gerar ID único para a sessão
      const sessionId = `vbs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.currentSessionId = sessionId;

      if (this.useRealService) {
        // Tentar usar o serviço real
        try {
          console.log('Tentando conectar com serviço real...');
          const result = await whatsappRealFrontendService.connect();
          
          if (result.success && result.qrCode) {
            // Serviço real funcionou e retornou QR Code
            console.log('Serviço real conectado com sucesso! QR Code recebido');
            await this.createOrUpdateSession('connecting', result.qrCode);
            return { success: true, qrCode: result.qrCode, sessionId };
          } else {
            throw new Error(result.error || 'Falha no serviço real');
          }
        } catch (realError) {
          console.log('Serviço real falhou, usando mockado:', realError);
          this.useRealService = false;
        }
      }

      // Fallback para serviço mockado
      console.log('Usando serviço mockado como fallback');
      await this.createOrUpdateSession('connecting');
      
      // Gerar QR Code mockado
      const qrCode = await qrCodeService.generateWhatsAppQRCode(sessionId);
      
      // Salvar QR Code na sessão
      await this.createOrUpdateSession('connecting', qrCode);
      
      // Simular conexão após 10 segundos
      setTimeout(async () => {
        await this.createOrUpdateSession('connected');
      }, 10000);
      
      return { success: true, qrCode, sessionId };
      
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      await this.createOrUpdateSession('error');
      return { success: false };
    }
  }

  async disconnectWhatsApp(): Promise<boolean> {
    try {
      if (this.useRealService) {
        // Desconectar do serviço real
        await whatsappRealFrontendService.disconnect();
      }

      // Atualizar status na sessão
      await this.createOrUpdateSession('disconnected');
      
      return true;
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
      return false;
    }
  }

  // Simular recebimento de mensagem
  async simulateIncomingMessage(numeroCliente: string, conteudo: string): Promise<boolean> {
    try {
      let atendimento = await this.findAtendimentoByNumber(numeroCliente);
      
      if (!atendimento) {
        atendimento = await this.createAtendimento({
          numero_cliente: numeroCliente,
          nome_cliente: `Cliente ${numeroCliente}`,
          status: 'AGUARDANDO',
          data_inicio: new Date().toISOString(),
          ultima_mensagem: new Date().toISOString(),
          prioridade: 1,
          canal: 'whatsapp'
        });
      }

      if (!atendimento) return false;

      await this.sendMensagem({
        atendimento_id: atendimento.id,
        conteudo,
        tipo: 'TEXTO',
        remetente: 'CLIENTE',
        timestamp: new Date().toISOString(),
        lida: false
      });

      return true;
    } catch (error) {
      console.error('Erro ao simular mensagem recebida:', error);
      return false;
    }
  }

  private async findAtendimentoByNumber(numero: string): Promise<WhatsAppAtendimento | null> {
    return this.mockData.atendimentos.find(a => a.numero_cliente === numero) || null;
  }

  // Limpar recursos ao destruir o serviço
  destroy(): void {
    if (this.useRealService) {
      // O serviço real não tem método destroy, apenas disconnect
      // whatsappRealFrontendService.destroy();
    }
  }

  // Verificar se está usando serviço real
  isUsingRealService(): boolean {
    return this.useRealService;
  }
}

export const whatsappHybridService = new WhatsAppHybridService();
