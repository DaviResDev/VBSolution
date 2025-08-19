import { create, Whatsapp } from 'venom-bot';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import env from '../env';
import logger from '../logger';
import { PrismaClient, TipoMensagem, Remetente, AtendimentoStatus } from '@prisma/client';
import { WhatsAppMessage } from '../types/whatsapp';
import { RoutingService } from './routing.service';

export class WhatsAppService {
  private client: any = null; // Usando any para compatibilidade com Venom-Bot
  private io: SocketIOServer;
  private prisma: PrismaClient;
  private routingService: RoutingService;
  private sessionName: string = 'session-vbsolution';
  private isConnected: boolean = false;
  private qrCode: string | null = null;

  constructor(io: SocketIOServer, prisma: PrismaClient) {
    this.io = io;
    this.prisma = prisma;
    this.routingService = new RoutingService(prisma);
    
    // Garantir que o diretório de sessões existe
    if (!fs.existsSync(env.VENOM_SESSION_DIR)) {
      fs.mkdirSync(env.VENOM_SESSION_DIR, { recursive: true });
    }
  }

  async startSession(): Promise<{ started: boolean; connected: boolean }> {
    try {
      if (this.client && this.isConnected) {
        logger.info('Sessão WhatsApp já está ativa');
        return { started: true, connected: true };
      }

      logger.info('Iniciando sessão WhatsApp...');

      const sessionPath = path.join(env.VENOM_SESSION_DIR, this.sessionName);
      
      // Criar cliente Venom-Bot com configuração correta
      this.client = await create(
        this.sessionName,
        (base64Qr: string) => {
          // Callback QR Code
          this.qrCode = base64Qr;
          this.io.emit('chat:qr', { base64: base64Qr });
        },
        (statusSession: string) => {
          // Callback Status
          logger.info(`Status da sessão: ${statusSession}`);
        },
        {
          multidevice: env.VENOM_MULTI_DEVICE,
          headless: true,
          useChrome: false,
          debug: env.NODE_ENV === 'development',
          logQR: true,
          disableWelcome: true,
          updatesLog: true,
          autoClose: 60000,
          createPathFileToken: sessionPath,
          addBrowserArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      );

      this.setupEventHandlers();
      
      logger.info('Sessão WhatsApp iniciada com sucesso');
      return { started: true, connected: this.isConnected };
    } catch (error) {
      logger.error('Erro ao iniciar sessão WhatsApp:', error);
      return { started: false, connected: false };
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    // QR Code
    this.client.on('qr', (qr: string) => {
      logger.info('QR Code recebido');
      this.qrCode = qr;
      this.io.emit('chat:qr', { base64: qr });
    });

    // Status da sessão
    this.client.on('ready', () => {
      logger.info('WhatsApp conectado e pronto');
      this.isConnected = true;
      this.qrCode = null;
      this.io.emit('chat:session_status', { connected: true });
    });

    this.client.on('authenticated', () => {
      logger.info('WhatsApp autenticado');
    });

    this.client.on('auth_failure', (msg: string) => {
      logger.error('Falha na autenticação WhatsApp:', msg);
      this.isConnected = false;
      this.io.emit('chat:session_status', { connected: false });
    });

    this.client.on('disconnected', (reason: string) => {
      logger.warn('WhatsApp desconectado:', reason);
      this.isConnected = false;
      this.io.emit('chat:session_status', { connected: false });
    });

    // Mensagens recebidas
    this.client.on('message', async (message: any) => {
      try {
        await this.handleIncomingMessage(message);
      } catch (error) {
        logger.error('Erro ao processar mensagem recebida:', error);
      }
    });
  }

  private async handleIncomingMessage(message: any): Promise<void> {
    try {
      const from = message.from;
      const messageType = this.mapMessageType(message.type);
      let content = '';
      let mediaUrl = '';
      let mediaTipo = '';
      let mediaNome = '';
      let mediaTamanho = 0;

      // Processar conteúdo baseado no tipo
      switch (messageType) {
        case TipoMensagem.TEXTO:
          content = message.body || '';
          break;
        case TipoMensagem.IMAGEM:
        case TipoMensagem.AUDIO:
        case TipoMensagem.DOCUMENTO:
        case TipoMensagem.VIDEO:
          const fileInfo = await this.downloadMedia(message);
          mediaUrl = fileInfo.url;
          mediaTipo = fileInfo.mimeType;
          mediaNome = fileInfo.filename;
          mediaTamanho = fileInfo.size;
          content = message.caption || '';
          break;
        default:
          content = message.body || 'Mensagem não suportada';
      }

      // Processar atendimento
      await this.processAtendimento(from, content, messageType, mediaUrl, mediaTipo, mediaNome, mediaTamanho);

    } catch (error) {
      logger.error('Erro ao processar mensagem:', error);
    }
  }

  private async downloadMedia(message: any): Promise<{ url: string; mimeType: string; filename: string; size: number }> {
    try {
      const decryptedBuffer = await this.client!.decryptFile(message);
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      const mediaDir = path.join(env.UPLOAD_DIR, String(year), month, day);
      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
      }

      const extension = this.getFileExtension(message.mimetype);
      const filename = `${uuidv4()}.${extension}`;
      const filePath = path.join(mediaDir, filename);
      
      fs.writeFileSync(filePath, decryptedBuffer);
      
      // Gerar URL pública
      const relativePath = path.relative(env.UPLOAD_DIR, filePath);
      const url = `/uploads/${relativePath.replace(/\\/g, '/')}`;
      
      return {
        url,
        mimeType: message.mimetype || 'application/octet-stream',
        filename: message.filename || filename,
        size: decryptedBuffer.length
      };
    } catch (error) {
      logger.error('Erro ao baixar mídia:', error);
      throw error;
    }
  }

  private getFileExtension(mimeType: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'video/mp4': 'mp4',
      'video/3gpp': '3gp',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    };
    
    return extensions[mimeType] || 'bin';
  }

  private mapMessageType(venomType: string): TipoMensagem {
    const typeMap: { [key: string]: TipoMensagem } = {
      'text': TipoMensagem.TEXTO,
      'image': TipoMensagem.IMAGEM,
      'audio': TipoMensagem.AUDIO,
      'document': TipoMensagem.DOCUMENTO,
      'video': TipoMensagem.VIDEO,
      'sticker': TipoMensagem.IMAGEM,
      'location': TipoMensagem.LOCALIZACAO,
      'contact': TipoMensagem.CONTATO
    };
    
    return typeMap[venomType] || TipoMensagem.TEXTO;
  }

  private async processAtendimento(
    numero: string,
    conteudo: string,
    tipo: TipoMensagem,
    mediaUrl: string,
    mediaTipo: string,
    mediaNome: string,
    mediaTamanho: number
  ): Promise<void> {
    try {
      // Buscar ou criar atendimento
      let atendimento = await this.prisma.atendimento.findFirst({
        where: {
          numeroCliente: numero,
          status: { not: 'FINALIZADO' }
        }
      });

      if (!atendimento) {
        // Criar novo atendimento
        atendimento = await this.prisma.atendimento.create({
          data: {
            numeroCliente: numero,
            canal: 'whatsapp',
            status: 'AGUARDANDO'
          }
        });

        // Enviar mensagem de boas-vindas do robô
        await this.routingService.sendWelcomeMessage(atendimento.id, numero);
      }

      // Salvar mensagem do cliente
      const mensagem = await this.prisma.mensagem.create({
        data: {
          atendimentoId: atendimento.id,
          remetente: Remetente.CLIENTE,
          tipo: tipo,
          conteudo: conteudo,
          midiaUrl: mediaUrl || null,
          midiaTipo: mediaTipo || null,
          midiaNome: mediaNome || null,
          midiaTamanho: mediaTamanho || null
        }
      });

      // Processar roteamento se for atendimento AGUARDANDO
      if (atendimento.status === 'AGUARDANDO') {
        await this.routingService.processRouting(atendimento.id, conteudo);
      }

      // Notificar frontend via Socket.IO
      this.io.to(`atendimento-${atendimento.id}`).emit('chat:message_in', {
        atendimentoId: atendimento.id,
        msg: mensagem
      });

      logger.info(`Mensagem processada: atendimento ${atendimento.id}, tipo ${tipo}`);

    } catch (error) {
      logger.error('Erro ao processar atendimento:', error);
    }
  }

  async sendText(to: string, text: string): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        throw new Error('WhatsApp não está conectado');
      }

      await this.client.sendText(to, text);
      logger.info(`Mensagem de texto enviada para ${to}`);
      return true;
    } catch (error) {
      logger.error('Erro ao enviar texto:', error);
      return false;
    }
  }

  async sendFile(to: string, filePath: string, caption?: string): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        throw new Error('WhatsApp não está conectado');
      }

      await this.client.sendFile(to, filePath, caption || '');
      logger.info(`Arquivo enviado para ${to}: ${filePath}`);
      return true;
    } catch (error) {
      logger.error('Erro ao enviar arquivo:', error);
      return false;
    }
  }

  async sendAudio(to: string, audioPath: string): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        throw new Error('WhatsApp não está conectado');
      }

      await this.client.sendVoice(to, audioPath);
      logger.info(`Áudio enviado para ${to}: ${audioPath}`);
      return true;
    } catch (error) {
      logger.error('Erro ao enviar áudio:', error);
      return false;
    }
  }

  getStatus(): { connected: boolean; sessionId: string; lastActivity: Date } {
    return {
      connected: this.isConnected,
      sessionId: this.sessionName,
      lastActivity: new Date()
    };
  }

  isSessionConnected(): boolean {
    return this.isConnected;
  }

  getQrCode(): string | null {
    return this.qrCode;
  }

  async stopSession(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.isConnected = false;
        this.qrCode = null;
        logger.info('Sessão WhatsApp encerrada');
      }
    } catch (error) {
      logger.error('Erro ao encerrar sessão WhatsApp:', error);
    }
  }
}
