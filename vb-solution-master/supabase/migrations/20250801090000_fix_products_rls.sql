-- Corrigir políticas RLS para a tabela products
-- Data: 2025-08-01

-- 1. Garantir que a tabela products existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
        CREATE TABLE public.products (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'product',
            sku TEXT,
            description TEXT,
            category TEXT,
            base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
            currency TEXT DEFAULT 'BRL',
            unit TEXT NOT NULL DEFAULT 'unidade',
            stock INTEGER,
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- 2. Garantir que todas as colunas necessárias existem
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER;

-- 3. Desabilitar RLS temporariamente para recriar as políticas
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 4. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Allow all access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;

-- 5. Reabilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 6. Criar nova política que permite todas as operações
CREATE POLICY "products_allow_all" ON public.products
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 7. Inserir dados de exemplo se a tabela estiver vazia
INSERT INTO public.products (name, type, description, category, base_price, unit, stock)
SELECT 
    'Consultoria Estratégica',
    'service',
    'Consultoria em estratégia empresarial',
    'Consultoria',
    5000.00,
    'hora',
    NULL
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

INSERT INTO public.products (name, type, description, category, base_price, unit, stock)
SELECT 
    'Sistema ERP',
    'product',
    'Sistema integrado de gestão empresarial',
    'Software',
    15000.00,
    'licença',
    10
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Sistema ERP');

INSERT INTO public.products (name, type, description, category, base_price, unit, stock)
SELECT 
    'Treinamento Corporativo',
    'service',
    'Treinamento para equipes',
    'Educação',
    2500.00,
    'curso',
    NULL
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Treinamento Corporativo');

-- 8. Comentário explicativo
COMMENT ON TABLE public.products IS 'Tabela de produtos e serviços - RLS corrigido';
COMMENT ON POLICY "products_allow_all" ON public.products IS 'Política que permite todas as operações na tabela products';
