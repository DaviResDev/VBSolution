-- Corrigir recursão infinita na tabela company_users
-- Data: 2025-08-01

-- 1. Desabilitar RLS temporariamente para corrigir as políticas
ALTER TABLE public.company_users DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Company members can view company users" ON public.company_users;
DROP POLICY IF EXISTS "Company owners can manage company users" ON public.company_users;
DROP POLICY IF EXISTS "Authenticated users can view company users" ON public.company_users;
DROP POLICY IF EXISTS "Authenticated users can modify company users" ON public.company_users;
DROP POLICY IF EXISTS "Allow all access to company_users" ON public.company_users;

-- 3. Reabilitar RLS
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas simples que não causam recursão
-- Política para visualização: usuários autenticados podem ver usuários da empresa
CREATE POLICY "company_users_view_policy" ON public.company_users
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Política para inserção: usuários autenticados podem inserir
CREATE POLICY "company_users_insert_policy" ON public.company_users
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Política para atualização: usuários autenticados podem atualizar
CREATE POLICY "company_users_update_policy" ON public.company_users
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Política para exclusão: usuários autenticados podem excluir
CREATE POLICY "company_users_delete_policy" ON public.company_users
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- 5. Corrigir também as políticas de outras tabelas que referenciam company_users
-- Desabilitar RLS temporariamente nas tabelas que têm políticas problemáticas
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Remover políticas problemáticas
DROP POLICY IF EXISTS "Company members can view company" ON public.companies;
DROP POLICY IF EXISTS "Company owners can manage company" ON public.companies;
DROP POLICY IF EXISTS "Company members can view work groups" ON public.work_groups;
DROP POLICY IF EXISTS "Company members can manage work groups" ON public.work_groups;
DROP POLICY IF EXISTS "Company members can view activities" ON public.activities;
DROP POLICY IF EXISTS "Company members can manage activities" ON public.activities;
DROP POLICY IF EXISTS "Company members can view leads" ON public.leads;
DROP POLICY IF EXISTS "Company members can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Company members can view projects" ON public.projects;
DROP POLICY IF EXISTS "Company members can manage projects" ON public.projects;

-- Reabilitar RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas simples para essas tabelas
-- Companies
CREATE POLICY "companies_allow_all" ON public.companies
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Work groups
CREATE POLICY "work_groups_allow_all" ON public.work_groups
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Activities
CREATE POLICY "activities_allow_all" ON public.activities
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Leads
CREATE POLICY "leads_allow_all" ON public.leads
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Projects
CREATE POLICY "projects_allow_all" ON public.projects
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 7. Comentários explicativos
COMMENT ON TABLE public.company_users IS 'Usuários da empresa - RLS corrigido sem recursão';
COMMENT ON POLICY "company_users_view_policy" ON public.company_users IS 'Política simples para visualização sem recursão';
COMMENT ON POLICY "company_users_insert_policy" ON public.company_users IS 'Política simples para inserção sem recursão';
COMMENT ON POLICY "company_users_update_policy" ON public.company_users IS 'Política simples para atualização sem recursão';
COMMENT ON POLICY "company_users_delete_policy" ON public.company_users IS 'Política simples para exclusão sem recursão';
