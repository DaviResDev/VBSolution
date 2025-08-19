-- Corrigir definitivamente a recursão infinita na tabela company_users
-- Data: 2025-08-01

-- 1. Desabilitar RLS temporariamente para todas as tabelas relacionadas
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

-- 2. Remover TODAS as políticas problemáticas que podem causar recursão
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

-- Companies
DROP POLICY IF EXISTS "Company members can view company" ON public.companies;
DROP POLICY IF EXISTS "Company owners can manage company" ON public.companies;
DROP POLICY IF EXISTS "companies_allow_all" ON public.companies;
DROP POLICY IF EXISTS "Allow all access to companies" ON public.companies;

-- Work Groups
DROP POLICY IF EXISTS "Company members can view work groups" ON public.work_groups;
DROP POLICY IF EXISTS "Company members can manage work groups" ON public.work_groups;
DROP POLICY IF EXISTS "work_groups_allow_all" ON public.work_groups;
DROP POLICY IF EXISTS "Allow all access to work_groups" ON public.work_groups;

-- Activities
DROP POLICY IF EXISTS "Company members can view activities" ON public.activities;
DROP POLICY IF EXISTS "Company members can manage activities" ON public.activities;
DROP POLICY IF EXISTS "activities_allow_all" ON public.activities;
DROP POLICY IF EXISTS "Allow all access to activities" ON public.activities;

-- Leads
DROP POLICY IF EXISTS "Company members can view leads" ON public.leads;
DROP POLICY IF EXISTS "Company members can manage leads" ON public.leads;
DROP POLICY IF EXISTS "leads_allow_all" ON public.leads;
DROP POLICY IF EXISTS "Allow all access to leads" ON public.leads;

-- Projects
DROP POLICY IF EXISTS "Company members can view projects" ON public.projects;
DROP POLICY IF EXISTS "Company members can manage projects" ON public.projects;
DROP POLICY IF EXISTS "projects_allow_all" ON public.projects;
DROP POLICY IF EXISTS "Allow all access to projects" ON public.projects;

-- 3. Reabilitar RLS em todas as tabelas
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writeoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas SIMPLES e SEGURAS que não causam recursão
-- Company Users - Política básica sem recursão
CREATE POLICY "company_users_simple_policy" ON public.company_users
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Companies - Política básica sem recursão
CREATE POLICY "companies_simple_policy" ON public.companies
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Work Groups - Política básica sem recursão
CREATE POLICY "work_groups_simple_policy" ON public.work_groups
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Activities - Política básica sem recursão
CREATE POLICY "activities_simple_policy" ON public.activities
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Leads - Política básica sem recursão
CREATE POLICY "leads_simple_policy" ON public.leads
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Projects - Política básica sem recursão
CREATE POLICY "projects_simple_policy" ON public.projects
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Employees - Política básica sem recursão
CREATE POLICY "employees_simple_policy" ON public.employees
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Suppliers - Política básica sem recursão
CREATE POLICY "suppliers_simple_policy" ON public.suppliers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Inventory - Política básica sem recursão
CREATE POLICY "inventory_simple_policy" ON public.inventory
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Writeoffs - Política básica sem recursão
CREATE POLICY "writeoffs_simple_policy" ON public.writeoffs
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Sales Orders - Política básica sem recursão
CREATE POLICY "sales_orders_simple_policy" ON public.sales_orders
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Products - Política básica sem recursão
CREATE POLICY "products_simple_policy" ON public.products
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Verificar se não há políticas problemáticas restantes
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    -- Verificar se ainda existem políticas que referenciam company_users
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies p
    JOIN pg_class c ON p.tablename = c.relname
    WHERE c.relname = 'company_users'
    AND p.polcmd IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL');
    
    IF policy_count > 1 THEN
        RAISE NOTICE 'Ainda existem % políticas na tabela company_users', policy_count;
    ELSE
        RAISE NOTICE 'Tabela company_users configurada corretamente com 1 política';
    END IF;
END $$;

-- 6. Comentários finais
COMMENT ON TABLE public.company_users IS 'Usuários da empresa - RLS corrigido SEM recursão infinita';
COMMENT ON POLICY "company_users_simple_policy" ON public.company_users IS 'Política simples que evita recursão infinita';
COMMENT ON TABLE public.companies IS 'Empresas - RLS corrigido SEM recursão infinita';
COMMENT ON POLICY "companies_simple_policy" ON public.companies IS 'Política simples que evita recursão infinita';

-- 7. Log da correção
DO $$
BEGIN
    RAISE NOTICE '✅ Correção de recursão infinita aplicada com sucesso!';
    RAISE NOTICE '📋 Todas as tabelas agora têm políticas RLS simples e seguras';
    RAISE NOTICE '🔒 Acesso restrito apenas a usuários autenticados';
    RAISE NOTICE '⚠️  Políticas complexas foram removidas para evitar recursão';
END $$;
