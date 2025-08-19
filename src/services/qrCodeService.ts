import QRCode from 'qrcode';

export interface QRCodeData {
  sessionId: string;
  timestamp: number;
  deviceInfo: string;
  connectionString: string;
}

export class QRCodeService {
  private static instance: QRCodeService;
  private activeSessions: Map<string, QRCodeData> = new Map();

  static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  /**
   * Gera um QR Code real para conexão WhatsApp
   * @param sessionId - ID único da sessão
   * @returns Promise com o QR Code em base64
   */
  async generateWhatsAppQRCode(sessionId: string): Promise<string> {
    try {
      // Criar dados únicos para a sessão
      const qrData: QRCodeData = {
        sessionId,
        timestamp: Date.now(),
        deviceInfo: `VBsolution-${navigator.platform}`,
        connectionString: `whatsapp://connect?session=${sessionId}&timestamp=${Date.now()}`
      };

      // Armazenar dados da sessão
      this.activeSessions.set(sessionId, qrData);

      // Gerar QR Code real usando a biblioteca qrcode
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw new Error('Falha ao gerar QR Code');
    }
  }

  /**
   * Verifica se uma sessão está ativa
   * @param sessionId - ID da sessão
   * @returns true se a sessão estiver ativa
   */
  isSessionActive(sessionId: string): boolean {
    return this.activeSessions.has(sessionId);
  }

  /**
   * Remove uma sessão ativa
   * @param sessionId - ID da sessão
   */
  removeSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  /**
   * Gera um QR Code de exemplo para demonstração
   * @returns QR Code de exemplo
   */
  async generateDemoQRCode(): Promise<string> {
    try {
      const demoData = {
        message: 'WhatsApp VBsolution Demo',
        timestamp: new Date().toISOString(),
        instructions: 'Escaneie este QR Code para conectar ao WhatsApp'
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(demoData), {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code de demonstração:', error);
      throw new Error('Falha ao gerar QR Code de demonstração');
    }
  }

  /**
   * Gera um QR Code personalizado com dados específicos
   * @param data - Dados para incluir no QR Code
   * @param options - Opções de personalização
   * @returns QR Code personalizado
   */
  async generateCustomQRCode(
    data: any, 
    options: {
      width?: number;
      color?: { dark: string; light: string };
    } = {}
  ): Promise<string> {
    try {
      const defaultOptions = {
        errorCorrectionLevel: 'M' as const,
        type: 'image/png' as const,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      };

      const finalOptions = { ...defaultOptions, ...options };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(data), finalOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code personalizado:', error);
      throw new Error('Falha ao gerar QR Code personalizado');
    }
  }

  /**
   * Valida se um QR Code é válido
   * @param qrCodeData - Dados do QR Code
   * @returns true se o QR Code for válido
   */
  validateQRCode(qrCodeData: string): boolean {
    try {
      const data = JSON.parse(qrCodeData);
      return data && typeof data === 'object' && data.sessionId;
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações de uma sessão ativa
   * @param sessionId - ID da sessão
   * @returns Dados da sessão ou null se não existir
   */
  getSessionInfo(sessionId: string): QRCodeData | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Lista todas as sessões ativas
   * @returns Array com IDs das sessões ativas
   */
  getActiveSessions(): string[] {
    return Array.from(this.activeSessions.keys());
  }

  /**
   * Limpa todas as sessões expiradas (mais de 5 minutos)
   */
  cleanupExpiredSessions(): void {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    for (const [sessionId, sessionData] of this.activeSessions.entries()) {
      if (now - sessionData.timestamp > fiveMinutes) {
        this.activeSessions.delete(sessionId);
      }
    }
  }
}

export const qrCodeService = QRCodeService.getInstance();
