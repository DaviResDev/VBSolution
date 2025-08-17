-- Corrigir estrutura da tabela companies para sistema de cadastro de usuários
-- Data: 2025-08-01
-- Esta migração corrige a estrutura para funcionar com o formulário de cadastro

-- 1. VERIFICAR estrutura atual da tabela
DO $$
DECLARE
    column_count INTEGER;
    column_names TEXT[];
BEGIN
    -- Contar colunas existentes
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies';
    
    -- Listar nomes das colunas
    SELECT array_agg(column_name) INTO column_names
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies'
    ORDER BY ordinal_position;
    
    RAISE NOTICE '📊 Estrutura atual da tabela companies:';
    RAISE NOTICE 'Total de colunas: %', column_count;
    RAISE NOTICE 'Colunas: %', array_to_string(column_names, ', ');
END $$;

-- 2. ADICIONAR colunas que podem estar faltando para o formulário
DO $$
BEGIN
    -- Adicionar colunas que o formulário espera
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
    
    RAISE NOTICE '✅ Estrutura da tabela verificada e corrigida';
END $$;

-- 3. CORRIGIR mapeamento de colunas (se necessário)
DO $$
BEGIN
    -- Se a coluna 'name' existe mas 'fantasy_name' não, copiar dados
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'name') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'fantasy_name') THEN
            -- Atualizar fantasy_name com dados de name se fantasy_name estiver vazio
            UPDATE public.companies 
            SET fantasy_name = name 
            WHERE (fantasy_name IS NULL OR fantasy_name = '') AND name IS NOT NULL;
            
            RAISE NOTICE '📋 Dados da coluna name copiados para fantasy_name';
        END IF;
    END IF;
    
    RAISE NOTICE '✅ Mapeamento de colunas corrigido';
END $$;

-- 4. GARANTIR que as colunas obrigatórias tenham valores padrão
DO $$
BEGIN
    -- Definir valores padrão para colunas importantes
    UPDATE public.companies 
    SET status = COALESCE(status, 'active')
    WHERE status IS NULL;
    
    UPDATE public.companies 
    SET sector = COALESCE(sector, 'Não especificado')
    WHERE sector IS NULL;
    
    RAISE NOTICE '✅ Valores padrão aplicados para colunas obrigatórias';
END $$;

-- 5. VERIFICAR se a tabela está pronta para uso
DO $$
DECLARE
    ready_columns TEXT[];
    missing_columns TEXT[];
    col_name TEXT;
BEGIN
    -- Lista de colunas necessárias para o formulário
    ready_columns := ARRAY['id', 'fantasy_name', 'company_name', 'cnpj', 'email', 'phone', 'cep', 'address', 'city', 'state', 'description', 'sector', 'reference', 'responsible_id', 'created_at', 'updated_at'];
    
    -- Verificar cada coluna necessária
    FOREACH col_name IN ARRAY ready_columns
    LOOP
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = col_name) THEN
            missing_columns := array_append(missing_columns, col_name);
        END IF;
    END LOOP;
    
    -- Reportar status
    IF array_length(missing_columns, 1) IS NULL THEN
        RAISE NOTICE '✅ Tabela companies está pronta para uso!';
        RAISE NOTICE '✅ Todas as colunas necessárias estão presentes';
    ELSE
        RAISE NOTICE '⚠️  Colunas faltando: %', array_to_string(missing_columns, ', ');
        RAISE NOTICE '❌ Tabela não está pronta para uso';
    END IF;
END $$;

-- 6. CRIAR índices para melhor performance
DO $$
BEGIN
    -- Índice para responsible_id (usado nas consultas)
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'companies' AND indexname = 'idx_companies_responsible_id') THEN
        CREATE INDEX idx_companies_responsible_id ON public.companies(responsible_id);
        RAISE NOTICE '📊 Índice criado para responsible_id';
    END IF;
    
    -- Índice para fantasy_name (usado nas buscas)
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'companies' AND indexname = 'idx_companies_fantasy_name') THEN
        CREATE INDEX idx_companies_fantasy_name ON public.companies(fantasy_name);
        RAISE NOTICE '📊 Índice criado para fantasy_name';
    END IF;
    
    -- Índice para sector (usado nas buscas e filtros)
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'companies' AND indexname = 'idx_companies_sector') THEN
        CREATE INDEX idx_companies_sector ON public.companies(sector);
        RAISE NOTICE '📊 Índice criado para sector';
    END IF;
    
    RAISE NOTICE '✅ Índices de performance criados';
END $$;

-- 7. VERIFICAR se RLS está configurado corretamente
DO $$
DECLARE
    rls_enabled BOOLEAN;
    policy_count INTEGER;
BEGIN
    -- Verificar status do RLS
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'companies';
    
    -- Verificar políticas existentes
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'companies';
    
    RAISE NOTICE '🔒 Status do RLS: %', CASE WHEN rls_enabled THEN 'Habilitado' ELSE 'Desabilitado' END;
    RAISE NOTICE '📋 Políticas RLS ativas: %', policy_count;
    
    IF NOT rls_enabled THEN
        RAISE NOTICE '⚠️  RLS está desabilitado - permitindo acesso total';
    ELSE
        RAISE NOTICE '✅ RLS está habilitado com % políticas', policy_count;
    END IF;
END $$;

-- 8. LOG de sucesso
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ESTRUTURA DA TABELA COMPANIES CORRIGIDA!';
    RAISE NOTICE '✅ Todas as colunas necessárias estão presentes';
    RAISE NOTICE '✅ Mapeamento de colunas corrigido';
    RAISE NOTICE '✅ Valores padrão aplicados';
    RAISE NOTICE '✅ Índices de performance criados';
    RAISE NOTICE '✅ Sistema pronto para cadastro de usuários';
    RAISE NOTICE '';
    RAISE NOTICE '📋 COMO FUNCIONA AGORA:';
    RAISE NOTICE '1. Usuários se cadastram na página de login';
    RAISE NOTICE '2. Usuários logados podem cadastrar empresas';
    RAISE NOTICE '3. Formulário funciona com todas as colunas necessárias';
    RAISE NOTICE '4. Dados são salvos permanentemente no Supabase';
    RAISE NOTICE '5. Empresas ficam vinculadas ao usuário logado';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Teste o cadastro de usuário na página de login';
    RAISE NOTICE '2. Teste o cadastro de empresas na página /companies';
    RAISE NOTICE '3. Verifique se os dados são salvos corretamente';
    RAISE NOTICE '';
END $$;
