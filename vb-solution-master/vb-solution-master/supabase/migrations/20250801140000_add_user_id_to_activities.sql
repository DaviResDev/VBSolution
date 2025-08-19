-- Adicionar coluna user_id à tabela activities para vincular tarefas ao usuário logado
-- Data: 2025-08-01

-- 1. Adicionar coluna user_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Criar índice para melhor performance nas consultas por usuário
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);

-- 3. Atualizar políticas RLS para incluir filtro por user_id
DROP POLICY IF EXISTS "activities_simple_policy" ON public.activities;

-- Política para usuários verem apenas suas próprias atividades
CREATE POLICY "activities_user_policy" ON public.activities
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 4. Adicionar comentário explicativo
COMMENT ON COLUMN public.activities.user_id IS 'ID do usuário proprietário da atividade';
