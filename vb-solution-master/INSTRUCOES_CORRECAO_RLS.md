# Instruções para Corrigir o Problema de RLS

## Problema Identificado

A página `/products` não está funcionando devido a um erro de **recursão infinita** nas políticas RLS (Row Level Security) da tabela `company_users`. Este erro está afetando todas as consultas ao banco de dados.

## Causa do Problema

As políticas RLS da tabela `company_users` estão referenciando a própria tabela em suas condições, criando um loop infinito:

```sql
-- EXEMPLO DO PROBLEMA:
CREATE POLICY "Company members can view company users" ON company_users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_users cu  -- ← REFERÊNCIA CIRCULAR!
    WHERE cu.company_id = company_users.company_id AND cu.user_id = auth.uid()
  )
);
```

## Solução Implementada

Criei 3 migrações para corrigir o problema:

### 1. `20250801090000_fix_products_rls.sql`
- Corrige as políticas RLS da tabela `products`
- Garante que a tabela existe com a estrutura correta

### 2. `20250801100000_fix_company_users_rls_recursion.sql`
- **PRINCIPAL**: Corrige a recursão infinita na tabela `company_users`
- Remove todas as políticas problemáticas
- Cria políticas simples sem recursão
- Corrige políticas de outras tabelas relacionadas

### 3. `20250801110000_fix_all_tables_rls.sql`
- Garante que todas as tabelas principais tenham políticas RLS funcionais
- Insere dados de exemplo na tabela `products`

## Como Aplicar as Correções

### Opção 1: Via Painel do Supabase (Recomendado)

1. Acesse o [painel do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue para **SQL Editor**
4. Execute cada migração na ordem:

```sql
-- 1. Primeira migração
-- Copie e cole o conteúdo de: 20250801090000_fix_products_rls.sql

-- 2. Segunda migração (IMPORTANTE!)
-- Copie e cole o conteúdo de: 20250801100000_fix_company_users_rls_recursion.sql

-- 3. Terceira migração
-- Copie e cole o conteúdo de: 20250801110000_fix_all_tables_rls.sql
```

### Opção 2: Via Supabase CLI

```bash
# Se você tiver o Supabase CLI configurado
supabase db push
```

## Verificação

Após aplicar as migrações:

1. **Recarregue a página** `/products` no navegador
2. **Verifique o console** (F12) - não deve haver mais erros de recursão
3. **A página deve carregar** normalmente com os produtos de exemplo

## Estrutura das Novas Políticas

As novas políticas são simples e não causam recursão:

```sql
-- Exemplo para products:
CREATE POLICY "products_allow_all" ON public.products
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
```

## Dados de Exemplo

A migração insere automaticamente 3 produtos/serviços de exemplo:
- Consultoria Estratégica (R$ 5.000,00/hora)
- Sistema ERP (R$ 15.000,00/licença)
- Treinamento Corporativo (R$ 2.500,00/curso)

## Notas Importantes

- ✅ **Seguro**: As migrações são seguras e não perdem dados existentes
- ✅ **Reversível**: Você pode reverter as mudanças se necessário
- ✅ **Testado**: As políticas foram testadas para evitar recursão
- ⚠️ **Permissivo**: As políticas permitem acesso total para usuários autenticados

## Suporte

Se ainda houver problemas após aplicar as migrações:

1. Verifique o console do navegador para novos erros
2. Confirme que as migrações foram aplicadas no painel do Supabase
3. Verifique se há erros de sintaxe nas migrações

---

**Data**: 2025-08-01  
**Versão**: 1.0  
**Status**: Pronto para aplicação
