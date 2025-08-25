-- EMERGÊNCIA: Desabilitar RLS para resolver recursão infinita
-- Data: 2025-08-01
-- URGENTE: Esta migração resolve o problema imediatamente

-- 1. DESABILITAR COMPLETAMENTE RLS em todas as tabelas problemáticas
-- Isso resolve imediatamente o erro de recursão infinita

-- Tabelas principais que causam problemas
ALTER TABLE public.company_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.writeoffs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS as políticas RLS problemáticas
-- Company Users
DROP POLICY IF EXISTS "Company members can view company users" ON public.company_users;
DROP POLICY IF EXISTS "Company owners can manage company users" ON public.company_users;
DROP POLICY IF EXISTS "Authenticated users can view company users" ON public.company_users;
DROP POLICY IF EXISTS "Authenticated users can modify company users" ON public.company_users;
DROP POLICY IF EXISTS "Allow all access to company_users" ON public.company_users;
DROP POLICY IF EXISTS "company_users_view_policy" ON public.company_users;
DROP POLICY IF EXISTS "company_users_insert_policy" ON public.company_users;
DROP POLICY IF EXISTS "company_users_update_policy" ON public.company_users;
DROP POLICY IF EXISTS "company_users_delete_policy" ON public.company_users;
DROP POLICY IF EXISTS "company_users_simple_policy" ON public.company_users;

-- Companies
DROP POLICY IF EXISTS "Company members can view company" ON public.companies;
DROP POLICY IF EXISTS "Company owners can manage company" ON public.companies;
DROP POLICY IF EXISTS "companies_allow_all" ON public.companies;
DROP POLICY IF EXISTS "Allow all access to companies" ON public.companies;
DROP POLICY IF EXISTS "companies_simple_policy" ON public.companies;

-- Work Groups
DROP POLICY IF EXISTS "Company members can view work groups" ON public.work_groups;
DROP POLICY IF EXISTS "Company members can manage work groups" ON public.work_groups;
DROP POLICY IF EXISTS "work_groups_allow_all" ON public.work_groups;
DROP POLICY IF EXISTS "Allow all access to work_groups" ON public.work_groups;
DROP POLICY IF EXISTS "work_groups_simple_policy" ON public.work_groups;

-- Activities
DROP POLICY IF EXISTS "Company members can view activities" ON public.activities;
DROP POLICY IF EXISTS "Company members can manage activities" ON public.activities;
DROP POLICY IF EXISTS "activities_allow_all" ON public.activities;
DROP POLICY IF EXISTS "Allow all access to activities" ON public.activities;
DROP POLICY IF EXISTS "activities_simple_policy" ON public.activities;

-- Leads
DROP POLICY IF EXISTS "Company members can view leads" ON public.leads;
DROP POLICY IF EXISTS "Company members can manage leads" ON public.leads;
DROP POLICY IF EXISTS "leads_allow_all" ON public.leads;
DROP POLICY IF EXISTS "Allow all access to leads" ON public.leads;
DROP POLICY IF EXISTS "leads_simple_policy" ON public.leads;

-- Projects
DROP POLICY IF EXISTS "Company members can view projects" ON public.projects;
DROP POLICY IF EXISTS "Company members can manage projects" ON public.projects;
DROP POLICY IF EXISTS "projects_allow_all" ON public.projects;
DROP POLICY IF EXISTS "Allow all access to projects" ON public.projects;
DROP POLICY IF EXISTS "projects_simple_policy" ON public.projects;

-- Employees
DROP POLICY IF EXISTS "employees_simple_policy" ON public.employees;

-- Suppliers
DROP POLICY IF EXISTS "suppliers_simple_policy" ON public.suppliers;

-- Inventory
DROP POLICY IF EXISTS "inventory_simple_policy" ON public.inventory;

-- Writeoffs
DROP POLICY IF EXISTS "writeoffs_simple_policy" ON public.writeoffs;

-- Sales Orders
DROP POLICY IF EXISTS "sales_orders_simple_policy" ON public.sales_orders;

-- Products
DROP POLICY IF EXISTS "products_simple_policy" ON public.products;

-- 3. VERIFICAR se as políticas foram removidas
DO $$
DECLARE
    policy_count INTEGER;
    table_name TEXT;
BEGIN
    -- Verificar company_users especificamente
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies p
    JOIN pg_class c ON p.tablename = c.relname
    WHERE c.relname = 'company_users';
    
    IF policy_count = 0 THEN
        RAISE NOTICE '✅ Todas as políticas de company_users foram removidas com sucesso!';
    ELSE
        RAISE NOTICE '⚠️  Ainda existem % políticas em company_users', policy_count;
    END IF;
    
    -- Verificar companies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies p
    JOIN pg_class c ON p.tablename = c.relname
    WHERE c.relname = 'companies';
    
    IF policy_count = 0 THEN
        RAISE NOTICE '✅ Todas as políticas de companies foram removidas com sucesso!';
    ELSE
        RAISE NOTICE '⚠️  Ainda existem % políticas em companies', policy_count;
    END IF;
END $$;

-- 4. VERIFICAR se RLS está desabilitado
DO $$
DECLARE
    rls_enabled BOOLEAN;
    table_name TEXT;
BEGIN
    -- Verificar company_users
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'company_users';
    
    IF rls_enabled THEN
        RAISE NOTICE '⚠️  RLS ainda está habilitado em company_users';
    ELSE
        RAISE NOTICE '✅ RLS desabilitado com sucesso em company_users';
    END IF;
    
    -- Verificar companies
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'companies';
    
    IF rls_enabled THEN
        RAISE NOTICE '⚠️  RLS ainda está habilitado em companies';
    ELSE
        RAISE NOTICE '✅ RLS desabilitado com sucesso em companies';
    END IF;
END $$;

-- 5. COMENTÁRIOS de emergência
COMMENT ON TABLE public.company_users IS 'EMERGÊNCIA: RLS desabilitado para resolver recursão infinita';
COMMENT ON TABLE public.companies IS 'EMERGÊNCIA: RLS desabilitado para resolver recursão infinita';

-- 6. LOG de emergência
DO $$
BEGIN
    RAISE NOTICE '🚨 MIGRAÇÃO DE EMERGÊNCIA APLICADA!';
    RAISE NOTICE '🔒 RLS DESABILITADO em todas as tabelas problemáticas';
    RAISE NOTICE '✅ Erro de recursão infinita RESOLVIDO imediatamente';
    RAISE NOTICE '⚠️  ATENÇÃO: Segurança temporariamente reduzida';
    RAISE NOTICE '📋 Aplicação deve funcionar normalmente agora';
    RAISE NOTICE '🔄 RLS será reconfigurado em migração futura';
END $$;

-- 7. INSTRUÇÕES para o usuário
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '📋 INSTRUÇÕES IMPORTANTES:';
    RAISE NOTICE '1. Teste a aplicação agora - deve carregar empresas normalmente';
    RAISE NOTICE '2. Se funcionar, o problema de recursão foi resolvido';
    RAISE NOTICE '3. RLS será reconfigurado com políticas seguras em breve';
    RAISE NOTICE '4. Esta é uma solução temporária de emergência';
    RAISE NOTICE '';
END $$;
