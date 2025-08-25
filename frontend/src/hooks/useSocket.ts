import { useEffect, useCallback } from 'react';
import { socketClient } from '@/lib/socket';
import { useChatStore } from '@/store/useChatStore';
import {
  WhatsAppStatus,
  WhatsAppMessage,
} from '@/types';

export const useSocket = () => {
  const {
    setWhatsAppStatus,
    setQRCode,
    addMensagem,
    updateAtendimento,
  } = useChatStore();

  // Conectar ao socket
  const connect = useCallback((token?: string) => {
    socketClient.connect(token);
  }, []);

  // Desconectar do socket
  const disconnect = useCallback(() => {
    socketClient.disconnect();
  }, []);

  // Inscrever em um chat
  const subscribeToChat = useCallback((atendimentoId: string) => {
    socketClient.subscribeToChat(atendimentoId);
  }, []);

  // Enviar status de digitação
  const sendTypingStatus = useCallback((atendimentoId: string, isTyping: boolean) => {
    socketClient.sendTypingStatus(atendimentoId, isTyping);
  }, []);

  // Configurar listeners dos eventos do socket
  useEffect(() => {
    const socket = socketClient.socketInstance;

    if (!socket) return;

    // Listener para QR Code
    const handleQRCode = (qrCode: string) => {
      console.log('QR Code recebido no hook:', qrCode);
      setQRCode(qrCode);
    };

    // Listener para status da sessão
    const handleSessionStatus = (status: WhatsAppStatus) => {
      console.log('Status da sessão atualizado no hook:', status);
      setWhatsAppStatus(status);
      
      // Limpar QR Code se conectado
      if (status.connected) {
        setQRCode(null);
      }
    };

    // Listener para mensagens recebidas
    const handleMessageIn = (message: WhatsAppMessage) => {
      console.log('Nova mensagem recebida no hook:', message);
      addMensagem(message.atendimentoId, message);
      
      // Atualizar último atendimento se for o atual
      // Isso será implementado quando tivermos o atendimento atual
    };

    // Listener para status de digitação
    const handleTyping = (data: { atendimentoId: string; isTyping: boolean }) => {
      console.log('Status de digitação no hook:', data);
      // Implementar lógica de digitação se necessário
    };

    // Adicionar listeners
    socket.on('chat:qr', handleQRCode);
    socket.on('chat:session_status', handleSessionStatus);
    socket.on('chat:message_in', handleMessageIn);
    socket.on('chat:typing', handleTyping);

    // Cleanup
    return () => {
      socket.off('chat:qr', handleQRCode);
      socket.off('chat:session_status', handleSessionStatus);
      socket.off('chat:message_in', handleMessageIn);
      socket.off('chat:typing', handleTyping);
    };
  }, [setWhatsAppStatus, setQRCode, addMensagem, updateAtendimento]);

  // Conectar automaticamente ao montar o componente
  useEffect(() => {
    connect();
    
    // Cleanup ao desmontar
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connect,
    disconnect,
    subscribeToChat,
    sendTypingStatus,
    connected: socketClient.connected,
    socket: socketClient.socketInstance,
  };
};
