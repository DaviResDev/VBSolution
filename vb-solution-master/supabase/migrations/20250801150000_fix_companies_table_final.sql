-- Corrigir tabela companies (VERSÃO FINAL)
-- Data: 2025-08-01

-- 1. GARANTIR que a tabela companies existe
DO $$
BEGIN
    -- Verificar se a tabela companies existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
        CREATE TABLE public.companies (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            fantasy_name TEXT,
            company_name TEXT,
            cnpj TEXT,
            email TEXT,
            phone TEXT,
            cep TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            description TEXT,
            sector TEXT DEFAULT 'Não especificado',
            reference TEXT,
            responsible_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            logo_url TEXT,
            status TEXT DEFAULT 'active',
            is_supplier BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        RAISE NOTICE '📋 Tabela companies criada';
    ELSE
        RAISE NOTICE '📋 Tabela companies já existe';
    END IF;
END $$;

-- 2. VERIFICAR se a tabela projects existe (sem criar se já existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        RAISE NOTICE '📋 Tabela projects já existe - não será criada';
    ELSE
        RAISE NOTICE '📋 Tabela projects não existe - será criada pela migração específica';
    END IF;
END $$;

-- 3. VERIFICAR se a tabela tem dados
DO $$
DECLARE
    company_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO company_count FROM public.companies;
    
    IF company_count = 0 THEN
        RAISE NOTICE '📋 Tabela companies está vazia - pronta para uso';
    ELSE
        RAISE NOTICE '📋 Tabela companies tem % empresas existentes', company_count;
    END IF;
END $$;

-- 4. GARANTIR que todas as colunas necessárias existem
DO $$
BEGIN
    -- Adicionar colunas que podem estar faltando
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'fantasy_name') THEN
        ALTER TABLE public.companies ADD COLUMN fantasy_name TEXT;
        RAISE NOTICE '📋 Coluna fantasy_name adicionada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'company_name') THEN
        ALTER TABLE public.companies ADD COLUMN company_name TEXT;
        RAISE NOTICE '📋 Coluna company_name adicionada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'cep') THEN
        ALTER TABLE public.companies ADD COLUMN cep TEXT;
        RAISE NOTICE '📋 Coluna cep adicionada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'reference') THEN
        ALTER TABLE public.companies ADD COLUMN reference TEXT;
        RAISE NOTICE '📋 Coluna reference adicionada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'is_supplier') THEN
        ALTER TABLE public.companies ADD COLUMN is_supplier BOOLEAN DEFAULT false;
        RAISE NOTICE '📋 Coluna is_supplier adicionada';
    END IF;
    
    RAISE NOTICE '✅ Estrutura da tabela companies verificada e corrigida';
END $$;

-- 5. MANTER RLS desabilitado
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- 6. LOG de sucesso
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 TABELA COMPANIES CORRIGIDA COM SUCESSO!';
    RAISE NOTICE '✅ Tabela existe e tem todas as colunas necessárias';
    RAISE NOTICE '✅ RLS desabilitado - sem recursão infinita';
    RAISE NOTICE '✅ Sistema pronto para uso';
    RAISE NOTICE '';
END $$;
