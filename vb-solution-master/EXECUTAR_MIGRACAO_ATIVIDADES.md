# Executar Migração das Atividades

## Problema Identificado
A tabela de atividades no Supabase não tinha todas as colunas necessárias que o hook `useActivities` estava tentando usar, causando o erro "Atividade não encontrada" ao clicar em uma tarefa.

## Solução
Criamos duas migrações SQL para corrigir a estrutura da tabela e inserir dados de teste.

## Passos para Executar

### 1. Executar a Migração de Estrutura
Execute a migração `20250801180000_add_responsible_id_to_activities.sql` no Supabase:

```sql
-- Esta migração adiciona as colunas faltantes:
-- - responsible_id (responsável pela atividade)
-- - notes (notas adicionais)
-- - tags (categorização)
-- - start_time (horário de início)
-- - end_time (horário de término)
-- - lead_id (associação com leads)
-- - project_id (associação com projetos)
```

### 2. Executar a Migração de Dados de Teste
Execute a migração `20250801170000_insert_test_activities.sql` no Supabase:

```sql
-- Esta migração insere 5 atividades de teste para desenvolvimento
-- Só executa se não houver atividades existentes
```

### 3. Verificar a Estrutura
Após executar as migrações, verifique se a tabela tem todas as colunas:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'activities' 
ORDER BY ordinal_position;
```

### 4. Verificar os Dados
Confirme se as atividades foram inseridas:

```sql
SELECT 
    COUNT(*) as total_activities,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as activities_with_user
FROM public.activities;
```

## Como Executar no Supabase

### Opção 1: SQL Editor
1. Acesse o painel do Supabase
2. Vá para "SQL Editor"
3. Cole e execute cada migração separadamente
4. Execute primeiro a migração de estrutura, depois a de dados

### Opção 2: Migrations
1. Acesse o painel do Supabase
2. Vá para "Database" > "Migrations"
3. Faça upload dos arquivos SQL
4. Execute as migrações na ordem correta

## Resultado Esperado

Após executar as migrações:

1. ✅ A tabela `activities` terá todas as colunas necessárias
2. ✅ 5 atividades de teste serão inseridas
3. ✅ O hook `useActivities` funcionará corretamente
4. ✅ Clicar em uma tarefa abrirá os detalhes completos
5. ✅ Não mais aparecerá "Atividade não encontrada"

## Teste da Funcionalidade

1. **Reinicie a aplicação** após executar as migrações
2. **Navegue para `/activities`**
3. **Clique em uma tarefa** (deve abrir os detalhes)
4. **Verifique se todas as informações são exibidas** corretamente

## Estrutura Final da Tabela

A tabela `activities` terá as seguintes colunas:

- `id` (UUID, Primary Key)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `type` (TEXT, NOT NULL)
- `status` (TEXT, DEFAULT 'pending')
- `priority` (TEXT, DEFAULT 'medium')
- `user_id` (UUID, REFERENCES auth.users)
- `company_id` (UUID, REFERENCES companies)
- `responsible_id` (UUID, REFERENCES auth.users) ← **NOVA**
- `due_date` (TIMESTAMP WITH TIME ZONE)
- `start_time` (TIMESTAMP WITH TIME ZONE) ← **NOVA**
- `end_time` (TIMESTAMP WITH TIME ZONE) ← **NOVA**
- `lead_id` (UUID, REFERENCES leads) ← **NOVA**
- `project_id` (UUID, REFERENCES projects) ← **NOVA**
- `tags` (TEXT[]) ← **NOVA**
- `notes` (TEXT) ← **NOVA**
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

## Troubleshooting

### Erro: "column does not exist"
- Verifique se executou a migração de estrutura primeiro
- Confirme se não há erros de sintaxe SQL

### Erro: "foreign key constraint"
- Verifique se as tabelas referenciadas existem
- Confirme se os tipos de dados estão corretos

### Nenhuma atividade aparece
- Verifique se executou a migração de dados de teste
- Confirme se há usuários na tabela `auth.users`

## Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Confirme a ordem de execução das migrações
3. Teste cada migração separadamente
4. Verifique se não há conflitos com migrações anteriores
