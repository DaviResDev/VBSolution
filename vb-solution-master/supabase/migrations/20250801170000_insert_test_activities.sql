-- Inserir dados de teste na tabela activities
-- Data: 2025-08-01
-- Objetivo: Criar atividades de teste para desenvolvimento

-- 1. Verificar se a tabela existe e tem a estrutura correta
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activities') THEN
        RAISE EXCEPTION 'Tabela activities não existe!';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'user_id') THEN
        RAISE EXCEPTION 'Coluna user_id não existe na tabela activities!';
    END IF;
    
    RAISE NOTICE '✅ Estrutura da tabela activities verificada com sucesso!';
END $$;

-- 2. Inserir atividades de teste (apenas se não existirem)
DO $$
DECLARE
    test_user_id UUID;
    test_company_id UUID;
    test_employee_id UUID;
    activity_count INTEGER;
    inserted_count INTEGER;
BEGIN
    -- Obter um usuário de teste (primeiro usuário autenticado)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE '⚠️  Nenhum usuário encontrado na tabela auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE '👤 Usuário de teste encontrado: %', test_user_id;
    
    -- Obter uma empresa de teste (se existir)
    SELECT id INTO test_company_id FROM public.companies LIMIT 1;
    
    -- Obter um funcionário de teste (se existir)
    SELECT id INTO test_employee_id FROM public.employees LIMIT 1;
    
    -- Verificar quantas atividades já existem
    SELECT COUNT(*) INTO activity_count FROM public.activities;
    
    IF activity_count > 0 THEN
        RAISE NOTICE 'ℹ️  Já existem % atividades na tabela. Pulando inserção de dados de teste.', activity_count;
        RETURN;
    END IF;
    
    -- Inserir atividades de teste
    INSERT INTO public.activities (
        title,
        description,
        type,
        status,
        priority,
        user_id,
        company_id,
        responsible_id,
        due_date,
        created_at,
        updated_at
    ) VALUES
    (
        'Reunião de Planejamento Semanal',
        'Reunião para discutir as metas e objetivos da semana, alinhar equipes e definir prioridades.',
        'meeting',
        'pending',
        'high',
        test_user_id,
        test_company_id,
        test_employee_id,
        NOW() + INTERVAL '2 days',
        NOW(),
        NOW()
    ),
    (
        'Desenvolver Dashboard de Vendas',
        'Criar dashboard interativo para visualização de métricas de vendas e performance da equipe.',
        'task',
        'in_progress',
        'medium',
        test_user_id,
        test_company_id,
        test_employee_id,
        NOW() + INTERVAL '5 days',
        NOW(),
        NOW()
    ),
    (
        'Ligar para Cliente Importante',
        'Entrar em contato com cliente para discutir renovação de contrato e novas oportunidades.',
        'call',
        'pending',
        'urgent',
        test_user_id,
        test_company_id,
        test_employee_id,
        NOW() + INTERVAL '1 day',
        NOW(),
        NOW()
    ),
    (
        'Revisar Documentação do Projeto',
        'Revisar e atualizar toda a documentação técnica do projeto em andamento.',
        'task',
        'pending',
        'low',
        test_user_id,
        test_company_id,
        test_employee_id,
        NOW() + INTERVAL '7 days',
        NOW(),
        NOW()
    ),
    (
        'Enviar Relatório Mensal',
        'Preparar e enviar relatório mensal de atividades para a diretoria.',
        'email',
        'completed',
        'medium',
        test_user_id,
        test_company_id,
        test_employee_id,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days'
    );
    
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    RAISE NOTICE '✅ % atividades de teste inseridas com sucesso!', inserted_count;
    RAISE NOTICE '👤 Usuário: %', test_user_id;
    RAISE NOTICE '🏢 Empresa: %', COALESCE(test_company_id::text, 'N/A');
    RAISE NOTICE '👷 Funcionário: %', COALESCE(test_employee_id::text, 'N/A');
    
END $$;

-- 3. Verificar se as atividades foram inseridas
SELECT 
    COUNT(*) as total_activities,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as activities_with_user,
    COUNT(CASE WHEN company_id IS NOT NULL THEN 1 END) as activities_with_company,
    COUNT(CASE WHEN responsible_id IS NOT NULL THEN 1 END) as activities_with_responsible
FROM public.activities;

-- 4. Mostrar algumas atividades para verificação
SELECT 
    id,
    title,
    type,
    status,
    priority,
    user_id,
    company_id,
    responsible_id,
    due_date,
    created_at
FROM public.activities
ORDER BY created_at DESC
LIMIT 5;
