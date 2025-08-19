// Tipos do WhatsApp
export interface WhatsAppStatus {
  connected: boolean;
  sessionId: string;
  lastActivity: Date;
  qrCode?: string;
  status: string;
}

export interface WhatsAppMessage {
  id: string;
  atendimentoId: string;
  conteudo: string;
  tipo: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
  remetente: 'CLIENTE' | 'ATENDENTE' | 'SISTEMA';
  timestamp: Date;
  mediaUrl?: string;
  mediaType?: string;
  mediaSize?: number;
}

// Tipos de Atendimento
export interface Atendimento {
  id: string;
  numeroCliente: string;
  nomeCliente?: string;
  status: 'ATIVO' | 'FINALIZADO' | 'CANCELADO';
  atendenteId?: string;
  createdAt: Date;
  updatedAt: Date;
  ultimaMensagem?: string;
  ultimaMensagemAt?: Date;
}

export interface AtendimentoWithMessages extends Atendimento {
  mensagens: WhatsAppMessage[];
}

export interface AtendimentoWithLastMessage extends Atendimento {
  ultimaMensagem: string;
  ultimaMensagemAt: Date;
}

// Tipos de Configuração
export interface ConfiguracaoAtendimento {
  id: string;
  nome: string;
  mensagemBoasVindas: string;
  mensagemMenu: string;
  mensagemDespedida: string;
  tempoResposta: number;
  maxTentativas: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpcaoAtendimento {
  id: string;
  atendimentoId: string;
  numero: number;
  texto: string;
  acao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    cursor?: string;
  };
}

export interface AtendimentoFilters {
  status?: string;
  atendenteId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
}

// Tipos de formulários
export interface CreateAtendimentoForm {
  numeroCliente: string;
  nomeCliente?: string;
  canal?: string;
}

export interface SendMessageForm {
  tipo: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
  texto?: string;
  fileId?: string;
}

export interface ConfiguracaoForm {
  nome: string;
  mensagemBoasVindas: string;
  mensagemMenu: string;
  mensagemDespedida: string;
  tempoResposta: number;
  maxTentativas: number;
}

export interface OpcaoForm {
  atendimentoId: string;
  numero: number;
  texto: string;
  acao?: string;
}

// Tipos de sessão WhatsApp
export interface WhatsAppSession {
  id: string;
  name: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_ready' | 'error';
  qrCode?: string;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de notificação
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
