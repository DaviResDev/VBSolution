-- Script para criar as tabelas do WhatsApp no Supabase
-- Execute este script diretamente no seu banco de dados

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
  atendente_id UUID,
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
  atendimento_id UUID NOT NULL,
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
  atendimento_id UUID NOT NULL,
  numero INTEGER NOT NULL,
  texto TEXT NOT NULL,
  acao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar foreign keys
ALTER TABLE whatsapp_mensagens 
ADD CONSTRAINT fk_mensagens_atendimento 
FOREIGN KEY (atendimento_id) REFERENCES whatsapp_atendimentos(id) ON DELETE CASCADE;

ALTER TABLE whatsapp_opcoes_atendimento 
ADD CONSTRAINT fk_opcoes_atendimento 
FOREIGN KEY (atendimento_id) REFERENCES whatsapp_atendimentos(id) ON DELETE CASCADE;

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
DROP TRIGGER IF EXISTS update_whatsapp_sessions_updated_at ON whatsapp_sessions;
CREATE TRIGGER update_whatsapp_sessions_updated_at 
  BEFORE UPDATE ON whatsapp_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_whatsapp_atendimentos_updated_at ON whatsapp_atendimentos;
CREATE TRIGGER update_whatsapp_atendimentos_updated_at 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_whatsapp_configuracoes_updated_at ON whatsapp_configuracoes;
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

-- Criar alguns atendimentos de exemplo
INSERT INTO whatsapp_atendimentos (numero_cliente, nome_cliente, status, canal)
VALUES 
  ('5511999999999', 'João Silva', 'AGUARDANDO', 'whatsapp'),
  ('5511888888888', 'Maria Santos', 'EM_ATENDIMENTO', 'whatsapp'),
  ('5511777777777', 'Pedro Costa', 'FINALIZADO', 'whatsapp')
ON CONFLICT DO NOTHING;

-- Criar algumas mensagens de exemplo
INSERT INTO whatsapp_mensagens (atendimento_id, conteudo, tipo, remetente)
SELECT 
  id,
  'Olá! Gostaria de saber mais sobre seus serviços.',
  'TEXTO',
  'CLIENTE'
FROM whatsapp_atendimentos 
WHERE status = 'AGUARDANDO'
ON CONFLICT DO NOTHING;

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('whatsapp_sessions', 'whatsapp_atendimentos', 'whatsapp_mensagens', 'whatsapp_configuracoes', 'whatsapp_opcoes_atendimento')
    THEN '✅ CRIADA'
    ELSE '❌ NÃO CRIADA'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'whatsapp_%'
ORDER BY table_name;
