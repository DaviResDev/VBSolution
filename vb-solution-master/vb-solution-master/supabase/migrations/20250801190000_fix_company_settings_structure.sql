-- Corrigir estrutura da tabela company_settings
-- Data: 2025-08-01

-- 1. Verificar se a tabela company_settings existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'company_settings') THEN
        CREATE TABLE public.company_settings (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
            setting_key TEXT NOT NULL,
            setting_value TEXT,
            company_name TEXT,
            logo_url TEXT,
            default_language TEXT DEFAULT 'pt-BR',
            default_timezone TEXT DEFAULT 'America/Sao_Paulo',
            default_currency TEXT DEFAULT 'BRL',
            datetime_format TEXT DEFAULT 'DD/MM/YYYY HH:mm',
            primary_color TEXT DEFAULT '#021529',
            secondary_color TEXT DEFAULT '#ffffff',
            accent_color TEXT DEFAULT '#3b82f6',
            enable_2fa BOOLEAN DEFAULT false,
            password_policy JSONB DEFAULT '{"min_length": 8, "require_numbers": true, "require_uppercase": true, "require_special": true}',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- 2. Adicionar colunas se não existirem na tabela company_settings
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS setting_key TEXT;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS setting_value TEXT;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS default_language TEXT DEFAULT 'pt-BR';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS default_timezone TEXT DEFAULT 'America/Sao_Paulo';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS default_currency TEXT DEFAULT 'BRL';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS datetime_format TEXT DEFAULT 'DD/MM/YYYY HH:mm';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#021529';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#ffffff';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#3b82f6';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS enable_2fa BOOLEAN DEFAULT false;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS password_policy JSONB DEFAULT '{"min_length": 8, "require_numbers": true, "require_uppercase": true, "require_special": true}';
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- 3. Verificar se a tabela user_profiles existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        CREATE TABLE public.user_profiles (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            avatar_url TEXT,
            position TEXT,
            department TEXT,
            role TEXT DEFAULT 'user',
            company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
            phone TEXT,
            address TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- 4. Adicionar coluna company_id se não existir
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- 5. Verificar se a tabela companies existe e adicionar colunas se necessário
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
        CREATE TABLE public.companies (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            cnpj TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            logo_url TEXT,
            description TEXT,
            sector TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Adicionar colunas se não existirem
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 6. Configurar RLS para company_settings
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "company_settings_allow_all" ON public.company_settings;
CREATE POLICY "company_settings_allow_all" ON public.company_settings
    FOR ALL USING (true);

-- 7. Configurar RLS para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_profiles_allow_all" ON public.user_profiles;
CREATE POLICY "user_profiles_allow_all" ON public.user_profiles
    FOR ALL USING (true);

-- 8. Configurar RLS para companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "companies_allow_all" ON public.companies;
CREATE POLICY "companies_allow_all" ON public.companies
    FOR ALL USING (true);

-- 9. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_company_settings_company_id ON public.company_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);

-- 10. Criar trigger para updated_at (com verificação de existência)
DROP TRIGGER IF EXISTS update_company_settings_updated_at ON public.company_settings;

-- Criar função se não existir
CREATE OR REPLACE FUNCTION update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
CREATE TRIGGER update_company_settings_updated_at 
    BEFORE UPDATE ON public.company_settings 
    FOR EACH ROW EXECUTE FUNCTION update_company_settings_updated_at();

-- 11. Inserir dados de exemplo se não existirem
INSERT INTO public.companies (name, status)
VALUES ('Visao Business', 'active')
ON CONFLICT DO NOTHING;

-- 12. Inserir configurações de exemplo se não existirem (usando setting_key)
INSERT INTO public.company_settings (company_id, setting_key, setting_value, company_name, logo_url, primary_color, secondary_color, accent_color)
SELECT 
    c.id,
    'company_info',
    'Visao Business',
    c.name,
    c.logo_url,
    '#021529',
    '#ffffff',
    '#3b82f6'
FROM public.companies c
WHERE c.name = 'Visao Business'
ON CONFLICT DO NOTHING;

-- 13. Atualizar perfis de usuários existentes com company_id
UPDATE public.user_profiles 
SET company_id = c.id
FROM public.companies c
WHERE c.name = 'Visao Business'
AND user_profiles.company_id IS NULL;

-- 14. Log de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Migração company_settings concluída com sucesso!';
    RAISE NOTICE 'Tabelas criadas/atualizadas: company_settings, user_profiles, companies';
    RAISE NOTICE 'Dados de exemplo inseridos para empresa: Visao Business';
    RAISE NOTICE 'Trigger e políticas RLS configurados';
END $$;
