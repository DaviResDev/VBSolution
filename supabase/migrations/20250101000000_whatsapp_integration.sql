-- Criação das tabelas para o módulo WhatsApp
-- Integrado ao sistema principal VBsolution

-- Tabela de sessões WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'disconnected',
  qr_code TEXT,
  connected_at TIMESTAMP WITH TIME ZONE,
  disconnected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atendimentos
CREATE TABLE IF NOT EXISTS whatsapp_atendimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_cliente TEXT NOT NULL,
  nome_cliente TEXT,
  status TEXT NOT NULL DEFAULT 'AGUARDANDO',
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_fim TIMESTAMP WITH TIME ZONE,
  ultima_mensagem TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atendente_id UUID REFERENCES auth.users(id),
  prioridade INTEGER DEFAULT 1,
  tags JSONB,
  observacoes TEXT,
  canal TEXT DEFAULT 'whatsapp',
  company_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS whatsapp_mensagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  atendimento_id UUID NOT NULL REFERENCES whatsapp_atendimentos(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'TEXTO',
  remetente TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lida BOOLEAN DEFAULT FALSE,
  midia_url TEXT,
  midia_tipo TEXT,
  midia_nome TEXT,
  midia_tamanho INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do robô
CREATE TABLE IF NOT EXISTS whatsapp_configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  mensagem_boas_vindas TEXT NOT NULL,
  mensagem_menu TEXT NOT NULL,
  mensagem_despedida TEXT NOT NULL,
  tempo_resposta INTEGER DEFAULT 300,
  max_tentativas INTEGER DEFAULT 3,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de opções de atendimento
CREATE TABLE IF NOT EXISTS whatsapp_opcoes_atendimento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  atendimento_id UUID NOT NULL REFERENCES whatsapp_atendimentos(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  texto TEXT NOT NULL,
  acao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_atendimentos_status ON whatsapp_atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_atendimentos_numero_cliente ON whatsapp_atendimentos(numero_cliente);
CREATE INDEX IF NOT EXISTS idx_whatsapp_mensagens_atendimento_id ON whatsapp_mensagens(atendimento_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_mensagens_timestamp ON whatsapp_mensagens(timestamp);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar timestamps
CREATE TRIGGER update_whatsapp_sessions_updated_at 
  BEFORE UPDATE ON whatsapp_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_atendimentos_updated_at 
  BEFORE UPDATE ON whatsapp_atendimentos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_configuracoes_updated_at 
  BEFORE UPDATE ON whatsapp_configuracoes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir configuração padrão
INSERT INTO whatsapp_configuracoes (nome, mensagem_boas_vindas, mensagem_menu, mensagem_despedida, tempo_resposta, max_tentativas)
VALUES (
  'padrao',
  'Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo?',
  'Escolha uma opção:\n1. Falar com atendente\n2. Ver produtos\n3. Agendar reunião\n4. Sair',
  'Obrigado por nos contatar! Tenha um ótimo dia!',
  300,
  3
) ON CONFLICT (nome) DO NOTHING;

-- Políticas de segurança RLS
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_opcoes_atendimento ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Usuários autenticados podem ver sessões" ON whatsapp_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver atendimentos" ON whatsapp_atendimentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver mensagens" ON whatsapp_mensagens
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver configurações" ON whatsapp_configuracoes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver opções" ON whatsapp_opcoes_atendimento
  FOR ALL USING (auth.role() = 'authenticated');
