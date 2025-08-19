-- DIAGNÓSTICO: Problema com tabela companies
-- Execute este script para identificar o que está causando o erro

-- 1. VERIFICAR se a tabela companies existe
SELECT 
    'Teste 1: Existência da tabela' as teste,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') 
        THEN '✅ Tabela companies existe'
        ELSE '❌ Tabela companies NÃO existe'
    END as resultado;

-- 2. VERIFICAR estrutura da tabela companies
SELECT 
    'Teste 2: Estrutura da tabela' as teste,
    'Colunas encontradas: ' || COUNT(*) as resultado
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'companies';

-- 3. VERIFICAR se há dados na tabela
SELECT 
    'Teste 3: Dados na tabela' as teste,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Tabela tem ' || COUNT(*) || ' registros'
        ELSE '⚠️  Tabela está vazia'
    END as resultado,
    COUNT(*) as total_registros
FROM public.companies;

-- 4. VERIFICAR se a coluna responsible_id existe
SELECT 
    'Teste 4: Coluna responsible_id' as teste,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'responsible_id')
        THEN '✅ Coluna responsible_id existe'
        ELSE '❌ Coluna responsible_id NÃO existe'
    END as resultado;

-- 5. VERIFICAR se a coluna created_at existe
SELECT 
    'Teste 5: Coluna created_at' as teste,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'created_at')
        THEN '✅ Coluna created_at existe'
        ELSE '❌ Coluna created_at NÃO existe'
    END as resultado;

-- 6. VERIFICAR se RLS está desabilitado
SELECT 
    'Teste 6: Status do RLS' as teste,
    CASE 
        WHEN c.relrowsecurity THEN '⚠️  RLS ainda habilitado'
        ELSE '✅ RLS desabilitado (correto)'
    END as resultado,
    c.relname as tabela
FROM pg_class c
WHERE c.relname = 'companies';

-- 7. VERIFICAR se há políticas RLS ativas
SELECT 
    'Teste 7: Políticas RLS' as teste,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Nenhuma política RLS ativa'
        ELSE '⚠️  Ainda existem ' || COUNT(*) || ' políticas RLS'
    END as resultado,
    COUNT(*) as politicas_ativas
FROM pg_policies p
JOIN pg_class c ON p.tablename = c.relname
WHERE c.relname = 'companies';

-- 8. TESTE: Consulta que a aplicação está tentando fazer
SELECT 
    'Teste 8: Consulta da aplicação' as teste,
    CASE 
        WHEN COUNT(*) >= 0 THEN '✅ Consulta funcionando - ' || COUNT(*) || ' empresas encontradas'
        ELSE '❌ Consulta falhou'
    END as resultado,
    COUNT(*) as empresas_encontradas
FROM public.companies
WHERE responsible_id IS NOT NULL
ORDER BY created_at DESC;

-- 9. VERIFICAR se há usuários autenticados
SELECT 
    'Teste 9: Usuários autenticados' as teste,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Existem ' || COUNT(*) || ' usuários'
        ELSE '⚠️  Nenhum usuário encontrado'
    END as resultado,
    COUNT(*) as total_usuarios
FROM auth.users;

-- 10. VERIFICAR se há dados de exemplo
SELECT 
    'Teste 10: Dados de exemplo' as teste,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Dados de exemplo encontrados'
        ELSE '⚠️  Tabela vazia - inserir dados de exemplo'
    END as resultado,
    COUNT(*) as registros
FROM public.companies
WHERE name LIKE '%Tech%' OR name LIKE '%Inovação%' OR name LIKE '%Consultoria%';

-- 11. RESULTADO FINAL E RECOMENDAÇÕES
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔍 DIAGNÓSTICO COMPLETO:';
    RAISE NOTICE '';
    
    -- Verificar se a tabela existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
        RAISE NOTICE '✅ Tabela companies existe';
        
        -- Verificar se tem dados
        IF EXISTS (SELECT 1 FROM public.companies LIMIT 1) THEN
            RAISE NOTICE '✅ Tabela companies tem dados';
        ELSE
            RAISE NOTICE '⚠️  Tabela companies está vazia - INSERIR DADOS DE EXEMPLO';
        END IF;
        
        -- Verificar RLS
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'companies' AND NOT relrowsecurity) THEN
            RAISE NOTICE '✅ RLS está desabilitado corretamente';
        ELSE
            RAISE NOTICE '⚠️  RLS ainda pode estar habilitado';
        END IF;
        
    ELSE
        RAISE NOTICE '❌ Tabela companies NÃO existe - CRIAR TABELA';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '📋 RECOMENDAÇÕES:';
    RAISE NOTICE '1. Se a tabela não existe: Executar migração de criação';
    RAISE NOTICE '2. Se está vazia: Inserir dados de exemplo';
    RAISE NOTICE '3. Se RLS ainda ativo: Executar migração de emergência novamente';
    RAISE NOTICE '';
END $$;
