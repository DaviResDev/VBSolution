import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(namespace: string = '/') {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Criar conexão Socket.IO
    socketRef.current = io(`http://localhost:3000${namespace}`, {
      auth: {
        token: 'VB_DEV_TOKEN'
      },
      transports: ['websocket', 'polling']
    });

    // Configurar eventos de conexão
    socketRef.current.on('connect', () => {
      console.log('Conectado ao Socket.IO:', namespace);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Desconectado do Socket.IO:', namespace);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Erro de conexão Socket.IO:', error);
    });

    // Cleanup na desconexão
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [namespace]);

  return socketRef.current;
}
