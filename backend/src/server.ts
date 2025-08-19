import { createServer } from 'http';
import { createApp } from './app';
import { createSocketIO } from './sockets/io';
import env from './env';
import logger from './logger';

async function startServer() {
  try {
    // Criar servidor HTTP
    const httpServer = createServer();
    
    // Criar Socket.IO
    const io = createSocketIO(httpServer);
    
    // Criar aplicação Express
    const app = createApp(io);
    
    // Montar app no servidor HTTP
    httpServer.on('request', app);
    
    // Iniciar servidor
    const port = env.PORT;
    httpServer.listen(port, () => {
      logger.info('🚀 Servidor iniciado com sucesso!');
      logger.info(`📱 Módulo WhatsApp ativo`);
      logger.info(`🌐 Servidor rodando na porta ${port}`);
      logger.info(`🌍 Ambiente: ${env.NODE_ENV}`);
      logger.info(`🔗 CORS origin: ${env['WEB_ORIGIN']}`);
      logger.info(`📁 Uploads: ${env.UPLOAD_DIR}`);
      logger.info(`💾 Sessões: ${env.VENOM_SESSION_DIR}`);
      logger.info(`📊 Health check: http://localhost:${port}/health`);
      logger.info(`🔌 Socket.IO: http://localhost:${port}/chat`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM recebido, encerrando servidor...');
      httpServer.close(() => {
        logger.info('Servidor encerrado');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT recebido, encerrando servidor...');
      httpServer.close(() => {
        logger.info('Servidor encerrado');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();
