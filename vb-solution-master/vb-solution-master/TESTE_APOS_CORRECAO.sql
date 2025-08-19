-- Teste após correção de emergência
-- Execute este script para verificar se o problema foi resolvido

-- 1. TESTE BÁSICO: Verificar se consegue acessar companies
SELECT 
    'Teste 1: Acesso básico a companies' as teste,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ SUCESSO - Tabela companies acessível'
        ELSE '❌ FALHA - Não consegue acessar companies'
    END as resultado,
    COUNT(*) as registros_encontrados
FROM public.companies;

-- 2. TESTE: Verificar se consegue acessar company_users
SELECT 
    'Teste 2: Acesso básico a company_users' as teste,
    CASE 
        WHEN COUNT(*) >= 0 THEN '✅ SUCESSO - Tabela company_users acessível'
        ELSE '❌ FALHA - Não consegue acessar company_users'
    END as resultado,
    COUNT(*) as registros_encontrados
FROM public.company_users;

-- 3. TESTE: Verificar se RLS está desabilitado
SELECT 
    'Teste 3: Status do RLS' as teste,
    CASE 
        WHEN c.relrowsecurity THEN '⚠️  RLS ainda habilitado'
        ELSE '✅ RLS desabilitado (correto para emergência)'
    END as resultado,
    c.relname as tabela
FROM pg_class c
WHERE c.relname IN ('companies', 'company_users')
ORDER BY c.relname;

-- 4. TESTE: Verificar se políticas foram removidas
SELECT 
    'Teste 4: Políticas RLS' as teste,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCESSO - Todas as políticas foram removidas'
        ELSE '⚠️  Ainda existem ' || COUNT(*) || ' políticas ativas'
    END as resultado,
    COUNT(*) as politicas_restantes
FROM pg_policies p
JOIN pg_class c ON p.tablename = c.relname
WHERE c.relname IN ('companies', 'company_users');

-- 5. TESTE: Consulta que estava falhando (carregamento de empresas)
SELECT 
    'Teste 5: Consulta de empresas (simulando aplicação)' as teste,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ SUCESSO - Consulta funcionando normalmente'
        ELSE '⚠️  Tabela vazia ou problema de dados'
    END as resultado,
    COUNT(*) as empresas_encontradas
FROM public.companies
WHERE status = 'active' OR status IS NULL;

-- 6. TESTE: Verificar estrutura das tabelas
SELECT 
    'Teste 6: Estrutura das tabelas' as teste,
    'Tabela: ' || table_name || ' - Colunas: ' || COUNT(*) as resultado
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'company_users')
GROUP BY table_name
ORDER BY table_name;

-- 7. RESULTADO FINAL
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔍 RESULTADO DOS TESTES:';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Se todos os testes passaram: PROBLEMA RESOLVIDO!';
    RAISE NOTICE '⚠️  Se algum teste falhou: Verificar migração';
    RAISE NOTICE '';
    RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Teste a aplicação - deve carregar empresas normalmente';
    RAISE NOTICE '2. Se funcionar, o erro de recursão foi resolvido';
    RAISE NOTICE '3. RLS será reconfigurado com segurança em breve';
    RAISE NOTICE '';
END $$;
