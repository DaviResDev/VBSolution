import { Request, Response } from 'express';
import { WhatsAppService } from '../services/whatsapp.service';
import { z } from 'zod';
import logger from '../logger';

const startSessionSchema = z.object({
  sessionName: z.string().optional()
});

export class WhatsAppController {
  constructor(private whatsappService: WhatsAppService) {}

  async startSession(req: Request, res: Response) {
    try {
      const { sessionName } = startSessionSchema.parse(req.body);
      
      const result = await this.whatsappService.startSession();
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erro ao iniciar sessão WhatsApp:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao iniciar sessão WhatsApp'
      });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const status = this.whatsappService.getStatus();
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Erro ao obter status do WhatsApp:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter status do WhatsApp'
      });
    }
  }

  async stopSession(req: Request, res: Response) {
    try {
      await this.whatsappService.stopSession();
      
      res.json({
        success: true,
        message: 'Sessão WhatsApp encerrada'
      });
    } catch (error) {
      logger.error('Erro ao encerrar sessão WhatsApp:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao encerrar sessão WhatsApp'
      });
    }
  }

  async sendText(req: Request, res: Response) {
    try {
      const { to, text } = req.body;
      
      if (!to || !text) {
        return res.status(400).json({
          success: false,
          error: 'Número de destino e texto são obrigatórios'
        });
      }

      const result = await this.whatsappService.sendText(to, text);
      
      if (result) {
        res.json({
          success: true,
          message: 'Mensagem enviada com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao enviar mensagem'
        });
      }
    } catch (error) {
      logger.error('Erro ao enviar texto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar mensagem'
      });
    }
  }

  async sendFile(req: Request, res: Response) {
    try {
      const { to, filePath, caption } = req.body;
      
      if (!to || !filePath) {
        return res.status(400).json({
          success: false,
          error: 'Número de destino e caminho do arquivo são obrigatórios'
        });
      }

      const result = await this.whatsappService.sendFile(to, filePath, caption);
      
      if (result) {
        res.json({
          success: true,
          message: 'Arquivo enviado com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao enviar arquivo'
        });
      }
    } catch (error) {
      logger.error('Erro ao enviar arquivo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar arquivo'
      });
    }
  }

  async sendAudio(req: Request, res: Response) {
    try {
      const { to, audioPath } = req.body;
      
      if (!to || !audioPath) {
        return res.status(400).json({
          success: false,
          error: 'Número de destino e caminho do áudio são obrigatórios'
        });
      }

      const result = await this.whatsappService.sendAudio(to, audioPath);
      
      if (result) {
        res.json({
          success: true,
          message: 'Áudio enviado com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro ao enviar áudio'
        });
      }
    } catch (error) {
      logger.error('Erro ao enviar áudio:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar áudio'
      });
    }
  }
}
