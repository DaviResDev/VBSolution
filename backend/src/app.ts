import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import env from './env';
import logger from './logger';
import { errorHandler, notFoundHandler } from './middlewares/error';
import { createWhatsAppRoutes } from './routes/whatsapp.routes';
import { createAtendimentoRoutes } from './routes/atendimento.routes';
import { createConfigRoutes } from './routes/config.routes';
import { createMediaRoutes } from './routes/media.routes';
import { WhatsAppController } from './controllers/whatsapp.controller';
import { AtendimentoController } from './controllers/atendimento.controller';
import { ConfigController } from './controllers/config.controller';
import { MediaController } from './controllers/media.controller';
import { WhatsAppService } from './services/whatsapp.service';
import { AtendimentoService } from './services/atendimento.service';
import { ConfigService } from './services/config.service';
import { MediaService } from './services/media.service';
import { PrismaClient } from '@prisma/client';

export function createApp(io: any) {
  const app = express();
  const prisma = new PrismaClient();

  // Middlewares de segurança
  app.use(helmet());
  app.use(cors({
    origin: env.WEB_ORIGIN,
    credentials: true
  }));

  // Middlewares de parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Servir arquivos estáticos
  app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

  // Log de requisições
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    next();
  });

  // Inicializar serviços
  const whatsappService = new WhatsAppService(io, prisma);
  const atendimentoService = new AtendimentoService(prisma);
  const configService = new ConfigService(prisma);
  const mediaService = new MediaService(prisma);

  // Inicializar controladores
  const whatsappController = new WhatsAppController(whatsappService);
  const atendimentoController = new AtendimentoController(atendimentoService);
  const configController = new ConfigController(configService);
  const mediaController = new MediaController(mediaService);

  // Rotas da API
  app.use('/api/whatsapp', createWhatsAppRoutes(whatsappController));
  app.use('/api/atendimento', createAtendimentoRoutes(atendimentoController));
  app.use('/api/config', createConfigRoutes(configController));
  app.use('/api/media', createMediaRoutes(mediaController));

  // Rota de health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'WhatsApp Module API está funcionando',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Middleware de tratamento de erros
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM recebido, encerrando aplicação...');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT recebido, encerrando aplicação...');
    await prisma.$disconnect();
    process.exit(0);
  });

  return app;
}
