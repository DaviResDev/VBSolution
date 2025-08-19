import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { authMiddleware } from '../middlewares/auth';

export function createWhatsAppRoutes(whatsappController: WhatsAppController) {
  const router = Router();

  // Aplicar middleware de autenticação em todas as rotas
  router.use(authMiddleware);

  // Iniciar sessão WhatsApp
  router.post('/start-session', (req, res) => whatsappController.startSession(req, res));

  // Obter status da sessão
  router.get('/status', (req, res) => whatsappController.getStatus(req, res));

  // Encerrar sessão WhatsApp
  router.post('/stop-session', (req, res) => whatsappController.stopSession(req, res));

  // Enviar mensagem de texto
  router.post('/send-text', (req, res) => whatsappController.sendText(req, res));

  // Enviar arquivo
  router.post('/send-file', (req, res) => whatsappController.sendFile(req, res));

  // Enviar áudio
  router.post('/send-audio', (req, res) => whatsappController.sendAudio(req, res));

  return router;
}
