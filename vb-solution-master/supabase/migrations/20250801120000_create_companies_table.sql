-- Criar tabela companies se não existir
-- Data: 2025-08-01

-- 1. Garantir que a tabela companies existe
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
            responsible_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            logo_url TEXT,
            description TEXT,
            sector TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- 2. Garantir que todas as colunas necessárias existem
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

-- 3. Configurar RLS para companies
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "companies_allow_all" ON public.companies;
DROP POLICY IF EXISTS "Allow all access to companies" ON public.companies;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 4. Criar política que permite todas as operações para usuários autenticados
CREATE POLICY "companies_allow_all" ON public.companies
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Inserir dados de exemplo se a tabela estiver vazia
INSERT INTO public.companies (name, cnpj, email, phone, address, city, state, sector, description)
SELECT 
    'Tech Solutions Ltda',
    '12.345.678/0001-90',
    'contato@techsolutions.com.br',
    '(11) 98765-4321',
    'Rua das Tecnologias, 123',
    'São Paulo',
    'SP',
    'Tecnologia',
    'Empresa especializada em soluções tecnológicas'
WHERE NOT EXISTS (SELECT 1 FROM public.companies LIMIT 1);

INSERT INTO public.companies (name, cnpj, email, phone, address, city, state, sector, description)
SELECT 
    'Inovação Digital',
    '98.765.432/0001-10',
    'vendas@inovacaodigital.com.br',
    '(21) 99876-5432',
    'Av. da Inovação, 456',
    'Rio de Janeiro',
    'RJ',
    'Marketing Digital',
    'Agência de marketing digital e inovação'
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE name = 'Inovação Digital');

INSERT INTO public.companies (name, cnpj, email, phone, address, city, state, sector, description)
SELECT 
    'Consultoria Prime',
    '11.222.333/0001-44',
    'prime@consultoria.com.br',
    '(31) 91234-5678',
    'Rua da Consultoria, 789',
    'Belo Horizonte',
    'MG',
    'Consultoria',
    'Consultoria empresarial especializada'
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE name = 'Consultoria Prime');

-- 6. Comentários finais
COMMENT ON TABLE public.companies IS 'Tabela de empresas - RLS configurado corretamente';
COMMENT ON POLICY "companies_allow_all" ON public.companies IS 'Política que permite todas as operações para usuários autenticados';
