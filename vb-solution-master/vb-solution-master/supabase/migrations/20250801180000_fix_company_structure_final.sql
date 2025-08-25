-- Migração para corrigir estrutura das tabelas companies e company_settings
-- Baseada na análise do projeto atual

-- 1. Corrigir estrutura da tabela companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS fantasy_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Corrigir estrutura da tabela company_settings
ALTER TABLE public.company_settings 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS default_language TEXT DEFAULT 'pt-BR',
ADD COLUMN IF NOT EXISTS default_timezone TEXT DEFAULT 'America/Sao_Paulo',
ADD COLUMN IF NOT EXISTS default_currency TEXT DEFAULT 'BRL',
ADD COLUMN IF NOT EXISTS datetime_format TEXT DEFAULT 'DD/MM/YYYY HH:mm',
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#021529',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS enable_2fa BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS password_policy JSONB DEFAULT '{"min_length": 8, "require_numbers": true, "require_uppercase": true, "require_special": true}'::jsonb;

-- 3. Inserir empresa padrão se não existir (com todos os campos obrigatórios)
INSERT INTO public.companies (
    name, 
    fantasy_name, 
    company_name, 
    status,
    description,
    email,
    phone,
    address,
    city,
    state,
    cep,
    cnpj,
    sector,
    reference,
    responsible_id
) VALUES (
    'Visao Business',           -- name (obrigatório)
    'Visao Business',           -- fantasy_name
    'Visao Business',           -- company_name
    'active',                   -- status
    'Empresa de tecnologia e inovação', -- description
    'contato@visaobusiness.com', -- email
    '(11) 99999-9999',         -- phone
    'Rua das Empresas, 123',   -- address
    'São Paulo',                -- city
    'SP',                       -- state
    '01234-567',                -- cep
    '12.345.678/0001-90',      -- cnpj
    'Tecnologia',               -- sector
    'REF001',                   -- reference
    NULL                        -- responsible_id
) ON CONFLICT DO NOTHING;

-- 4. Inserir configurações padrão se não existirem
INSERT INTO public.company_settings (company_id, company_name, logo_url, default_language, default_timezone, default_currency, datetime_format, primary_color, secondary_color, accent_color, enable_2fa, password_policy) 
SELECT 
    c.id, 
    c.fantasy_name,
    NULL,
    'pt-BR',
    'America/Sao_Paulo',
    'BRL',
    'DD/MM/YYYY HH:mm',
    '#021529',
    '#ffffff',
    '#3b82f6',
    false,
    '{"min_length": 8, "require_numbers": true, "require_uppercase": true, "require_special": true}'::jsonb
FROM public.companies c 
WHERE c.fantasy_name = 'Visao Business' 
ON CONFLICT DO NOTHING;

-- 5. Verificar resultado
SELECT 
    c.name,
    c.fantasy_name as company_name,
    cs.company_name as setting_name,
    cs.default_language,
    cs.default_timezone
FROM public.companies c
LEFT JOIN public.company_settings cs ON c.id = cs.company_id
WHERE c.fantasy_name = 'Visao Business';
