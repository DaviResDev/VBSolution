-- Corrigir políticas RLS para todas as tabelas principais
-- Data: 2025-08-01

-- 1. Garantir que a tabela products existe e tem a estrutura correta
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

-- 3. Configurar RLS para products
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;
DROP POLICY IF EXISTS "products_allow_all" ON public.products;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_allow_all" ON public.products
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Inserir dados de exemplo se a tabela estiver vazia
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

-- 5. Configurar RLS para outras tabelas importantes
-- Suppliers
ALTER TABLE public.suppliers DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to suppliers" ON public.suppliers;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_allow_all" ON public.suppliers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Inventory
ALTER TABLE public.inventory DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to inventory" ON public.inventory;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_allow_all" ON public.inventory
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Writeoffs
ALTER TABLE public.writeoffs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to writeoffs" ON public.writeoffs;
ALTER TABLE public.writeoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "writeoffs_allow_all" ON public.writeoffs
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Sales Orders
ALTER TABLE public.sales_orders DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to sales_orders" ON public.sales_orders;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_orders_allow_all" ON public.sales_orders
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 6. Comentários finais
COMMENT ON TABLE public.products IS 'Tabela de produtos e serviços - RLS configurado corretamente';
COMMENT ON POLICY "products_allow_all" ON public.products IS 'Política que permite todas as operações para usuários autenticados';
COMMENT ON TABLE public.suppliers IS 'Tabela de fornecedores - RLS configurado corretamente';
COMMENT ON TABLE public.inventory IS 'Tabela de inventário - RLS configurado corretamente';
COMMENT ON TABLE public.writeoffs IS 'Tabela de baixas - RLS configurado corretamente';
COMMENT ON TABLE public.sales_orders IS 'Tabela de pedidos de venda - RLS configurado corretamente';
