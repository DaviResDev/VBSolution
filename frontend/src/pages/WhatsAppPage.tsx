import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  MessageSquare, 
  Phone, 
  PhoneOff,
  QrCode,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { useSocket } from '@/hooks/useSocket';
import { apiClient } from '@/lib/api';
import { Atendimento, WhatsAppStatus } from '@/types';
import QRModal from '@/components/QRModal';
import ChatWindow from '@/components/ChatWindow';
import AtendimentoList from '@/components/AtendimentoList';
import AtendimentoActions from '@/components/AtendimentoActions';

export default function WhatsAppPage() {
  const navigate = useNavigate();
  const {
    whatsappStatus,
    atendimentos,
    atendimentoAtual,
    isLoading,
    setAtendimentos,
    setAtendimentoAtual,
    setLoading,
  } = useChatStore();

  const { connected: socketConnected } = useSocket();
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isStoppingSession, setIsStoppingSession] = useState(false);

  // Carregar atendimentos iniciais
  useEffect(() => {
    loadAtendimentos();
  }, []);

  const loadAtendimentos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAtendimentos();
      
      if (response.success && response.data) {
        setAtendimentos(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sessão WhatsApp
  const startSession = async () => {
    try {
      setIsStartingSession(true);
      const response = await apiClient.startWhatsAppSession();
      
      if (response.success) {
        console.log('Sessão WhatsApp iniciada');
        setShowQRModal(true);
      }
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
    } finally {
      setIsStartingSession(false);
    }
  };

  // Parar sessão WhatsApp
  const stopSession = async () => {
    try {
      setIsStoppingSession(true);
      const response = await apiClient.stopWhatsAppSession();
      
      if (response.success) {
        console.log('Sessão WhatsApp parada');
      }
    } catch (error) {
      console.error('Erro ao parar sessão:', error);
    } finally {
      setIsStoppingSession(false);
    }
  };

  // Selecionar atendimento
  const selectAtendimento = async (atendimento: Atendimento) => {
    try {
      setLoading(true);
      const response = await apiClient.getAtendimento(atendimento.id);
      
      if (response.success && response.data) {
        setAtendimentoAtual(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar atendimento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fechar QR Modal
  const closeQRModal = () => {
    setShowQRModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  WhatsApp Atendimento
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status da Conexão */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  socketConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  {socketConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {/* Status do WhatsApp */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  whatsappStatus.connected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  WhatsApp {whatsappStatus.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {/* Botões de Controle */}
              <div className="flex items-center space-x-2">
                {!whatsappStatus.connected ? (
                  <button
                    onClick={startSession}
                    disabled={isStartingSession}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isStartingSession ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Phone className="h-4 w-4" />
                        <span>Conectar</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={stopSession}
                    disabled={isStoppingSession}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isStoppingSession ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <PhoneOff className="h-4 w-4" />
                        <span>Desconectar</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => navigate('/configuracao')}
                  className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Lista de Atendimentos */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border">
            <AtendimentoList
              atendimentos={atendimentos}
              atendimentoAtual={atendimentoAtual}
              onSelectAtendimento={selectAtendimento}
              isLoading={isLoading}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            {atendimentoAtual ? (
              <ChatWindow
                atendimento={atendimentoAtual}
                whatsappStatus={whatsappStatus}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Selecione um atendimento</p>
                  <p className="text-sm">Escolha um atendimento da lista para começar a conversar</p>
                </div>
              </div>
            )}
          </div>

          {/* Painel de Ações */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border">
            {atendimentoAtual ? (
              <AtendimentoActions
                atendimento={atendimentoAtual}
                onRefresh={loadAtendimentos}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MoreVertical className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Ações</p>
                  <p className="text-sm">Ações disponíveis aparecerão aqui</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {showQRModal && (
        <QRModal
          qrCode={whatsappStatus.qrCode}
          onClose={closeQRModal}
          status={whatsappStatus}
        />
      )}
    </div>
  );
}
