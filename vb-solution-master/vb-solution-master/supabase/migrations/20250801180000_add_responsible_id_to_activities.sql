-- Adicionar colunas missing à tabela activities
-- Data: 2025-08-01
-- Objetivo: Adicionar campos necessários para funcionalidade completa

-- 1. Verificar se a tabela activities existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activities') THEN
        RAISE EXCEPTION 'Tabela activities não existe!';
    END IF;
    
    RAISE NOTICE '✅ Tabela activities encontrada!';
END $$;

-- 2. Adicionar coluna responsible_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'responsible_id'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN responsible_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        RAISE NOTICE '✅ Coluna responsible_id adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna responsible_id já existe na tabela activities';
    END IF;
END $$;

-- 3. Adicionar coluna notes se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN notes TEXT;
        RAISE NOTICE '✅ Coluna notes adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna notes já existe na tabela activities';
    END IF;
END $$;

-- 4. Adicionar coluna tags se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'tags'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN tags TEXT[];
        RAISE NOTICE '✅ Coluna tags adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna tags já existe na tabela activities';
    END IF;
END $$;

-- 5. Adicionar coluna start_time se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'start_time'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN start_time TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Coluna start_time adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna start_time já existe na tabela activities';
    END IF;
END $$;

-- 6. Adicionar coluna end_time se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'end_time'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN end_time TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Coluna end_time adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna end_time já existe na tabela activities';
    END IF;
END $$;

-- 7. Adicionar coluna lead_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'lead_id'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL;
        RAISE NOTICE '✅ Coluna lead_id adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna lead_id já existe na tabela activities';
    END IF;
END $$;

-- 8. Adicionar coluna project_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'project_id'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;
        RAISE NOTICE '✅ Coluna project_id adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'ℹ️  Coluna project_id já existe na tabela activities';
    END IF;
END $$;

-- 9. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_activities_responsible_id ON public.activities(responsible_id);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_project_id ON public.activities(project_id);

-- 10. Atualizar atividades existentes para usar o campo assigned_to como responsible_id
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.activities 
    SET responsible_id = assigned_to 
    WHERE responsible_id IS NULL AND assigned_to IS NOT NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE '✅ Atividades existentes atualizadas: % atividades tiveram responsible_id definido', updated_count;
END $$;

-- 11. Verificar a estrutura atual da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'activities' 
ORDER BY ordinal_position;

-- 12. Verificar se as atividades têm responsible_id
SELECT 
    COUNT(*) as total_activities,
    COUNT(CASE WHEN responsible_id IS NOT NULL THEN 1 END) as activities_with_responsible,
    COUNT(CASE WHEN responsible_id IS NULL THEN 1 END) as activities_without_responsible
FROM public.activities;

-- 13. Adicionar comentários explicativos
COMMENT ON COLUMN public.activities.responsible_id IS 'ID do usuário responsável pela execução da atividade';
COMMENT ON COLUMN public.activities.notes IS 'Notas adicionais sobre a atividade';
COMMENT ON COLUMN public.activities.tags IS 'Tags para categorização da atividade';
COMMENT ON COLUMN public.activities.start_time IS 'Horário de início da atividade';
COMMENT ON COLUMN public.activities.end_time IS 'Horário de término da atividade';
COMMENT ON COLUMN public.activities.lead_id IS 'ID do lead associado à atividade';
COMMENT ON COLUMN public.activities.project_id IS 'ID do projeto associado à atividade';
