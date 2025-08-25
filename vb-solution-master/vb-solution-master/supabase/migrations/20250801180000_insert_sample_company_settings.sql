-- Inserir dados de exemplo na tabela company_settings
-- Data: 2025-08-01

-- 1. Inserir configurações de exemplo para uma empresa
INSERT INTO public.company_settings (
    company_name,
    default_language,
    default_timezone,
    default_currency,
    datetime_format,
    logo_url,
    primary_color,
    secondary_color,
    accent_color,
    enable_2fa,
    password_policy
) VALUES (
    'VB Solution',
    'pt-BR',
    'America/Sao_Paulo',
    'BRL',
    'DD/MM/YYYY HH:mm',
    'https://i.imgur.com/LPwd1n0.png', -- Logo de exemplo
    '#021529',
    '#ffffff',
    '#3b82f6',
    false,
    '{"min_length": 8, "require_numbers": true, "require_uppercase": true, "require_special": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- 2. Inserir áreas de exemplo
INSERT INTO public.company_areas (
    name,
    description,
    status
) VALUES 
    ('Administração', 'Setor administrativo da empresa', 'active'),
    ('Vendas', 'Setor de vendas e comercial', 'active'),
    ('TI', 'Tecnologia da Informação', 'active'),
    ('Marketing', 'Setor de marketing e comunicação', 'active'),
    ('Financeiro', 'Setor financeiro e contábil', 'active')
ON CONFLICT DO NOTHING;

-- 3. Inserir cargos de exemplo
INSERT INTO public.company_roles (
    name,
    description,
    permissions,
    status
) VALUES 
    ('Administrador', 'Acesso total ao sistema', '{"all": true}'::jsonb, 'active'),
    ('Gerente', 'Acesso gerencial limitado', '{"view": true, "edit": true, "delete": false}'::jsonb, 'active'),
    ('Vendedor', 'Acesso às funcionalidades de vendas', '{"view": true, "edit": true, "delete": false}'::jsonb, 'active'),
    ('Usuário', 'Acesso básico ao sistema', '{"view": true, "edit": false, "delete": false}'::jsonb, 'active')
ON CONFLICT DO NOTHING;

-- 4. Verificar se os dados foram inseridos
SELECT 
    'company_settings' as tabela,
    COUNT(*) as total_registros
FROM public.company_settings
UNION ALL
SELECT 
    'company_areas' as tabela,
    COUNT(*) as total_registros
FROM public.company_areas
UNION ALL
SELECT 
    'company_roles' as tabela,
    COUNT(*) as total_registros
FROM public.company_roles;
