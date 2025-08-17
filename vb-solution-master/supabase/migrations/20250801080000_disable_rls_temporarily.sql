-- Desabilitar RLS temporariamente para permitir acesso às configurações
-- Data: 2025-08-01

-- 1. Desabilitar RLS nas tabelas de configurações
ALTER TABLE public.company_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs DISABLE ROW LEVEL SECURITY;

-- 2. Comentário explicativo
COMMENT ON TABLE public.company_settings IS 'Configurações da empresa - RLS desabilitado temporariamente';
COMMENT ON TABLE public.company_areas IS 'Áreas da empresa - RLS desabilitado temporariamente';
COMMENT ON TABLE public.company_roles IS 'Cargos da empresa - RLS desabilitado temporariamente';
COMMENT ON TABLE public.company_users IS 'Usuários da empresa - RLS desabilitado temporariamente';
COMMENT ON TABLE public.email_logs IS 'Logs de e-mails - RLS desabilitado temporariamente';

-- 3. Garantir que as tabelas existam e tenham dados padrão
INSERT INTO public.company_settings (company_name, default_language, default_timezone, default_currency, datetime_format, primary_color, secondary_color, accent_color, enable_2fa, password_policy)
VALUES (
    'Minha Empresa',
    'pt-BR',
    'America/Sao_Paulo',
    'BRL',
    'DD/MM/YYYY HH:mm',
    '#021529',
    '#ffffff',
    '#3b82f6',
    false,
    '{"min_length": 8, "require_numbers": true, "require_uppercase": true, "require_special": true}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 4. Inserir algumas áreas padrão se não existirem
INSERT INTO public.company_areas (name, description, status)
VALUES 
    ('Administração', 'Setor administrativo da empresa', 'active'),
    ('Vendas', 'Setor de vendas e comercial', 'active'),
    ('TI', 'Tecnologia da Informação', 'active'),
    ('RH', 'Recursos Humanos', 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. Inserir alguns cargos padrão se não existirem
INSERT INTO public.company_roles (name, description, permissions, status)
VALUES 
    ('Administrador', 'Acesso total ao sistema', '{"all": true}', 'active'),
    ('Gerente', 'Acesso gerencial limitado', '{"view": true, "edit": true, "delete": false}', 'active'),
    ('Usuário', 'Acesso básico ao sistema', '{"view": true, "edit": false, "delete": false}', 'active')
ON CONFLICT (id) DO NOTHING;
