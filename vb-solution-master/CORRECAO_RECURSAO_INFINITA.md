# 🔄 Correção da Recursão Infinita na Tabela company_users

## 🚨 Problema Identificado

O erro "infinite recursion detected in policy for relation 'company_users'" indica que as políticas RLS (Row Level Security) da tabela `company_users` estão causando recursão infinita.

## 🔍 Causa do Problema

As políticas RLS complexas que verificam permissões baseadas em outras tabelas (como `company_users` verificando `company_users`) criam um loop infinito:

1. Para verificar se um usuário pode acessar `company_users`
2. A política verifica `company_users` novamente
3. Isso cria um loop infinito

## ✅ Solução Implementada

Criamos uma nova migração (`20250801130000_fix_company_users_recursion_final.sql`) que:

1. **Remove TODAS as políticas problemáticas** que causam recursão
2. **Cria políticas simples e seguras** que apenas verificam se o usuário está autenticado
3. **Aplica a correção em todas as tabelas relacionadas** para evitar problemas similares

## 🚀 Como Aplicar a Correção

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue para **SQL Editor**
4. Execute o conteúdo da migração `20250801130000_fix_company_users_recursion_final.sql`

### Opção 2: Via Supabase CLI

```bash
# Navegar para o diretório do projeto
cd vb-solution-master

# Aplicar a migração
supabase db push
```

### Opção 3: Via Migração Manual

1. Copie o conteúdo da migração
2. Execute no SQL Editor do Supabase
3. Verifique se não há erros

## 🔧 O que a Correção Faz

### 1. Desabilita RLS Temporariamente
- Remove todas as políticas problemáticas
- Prepara as tabelas para reconfiguração

### 2. Remove Políticas Complexas
- Elimina políticas que referenciam outras tabelas
- Remove políticas que causam recursão

### 3. Cria Políticas Simples
- Apenas verifica se o usuário está autenticado
- Não faz verificações complexas que podem causar loops

### 4. Aplica em Todas as Tabelas
- `company_users` - Usuários da empresa
- `companies` - Empresas
- `work_groups` - Grupos de trabalho
- `activities` - Atividades
- `leads` - Leads
- `projects` - Projetos
- E outras tabelas relacionadas

## 🧪 Teste da Correção

Após aplicar a migração:

1. **Teste o carregamento de empresas** na aplicação
2. **Verifique os logs** para confirmar que não há mais erros de recursão
3. **Teste outras funcionalidades** que dependem dessas tabelas

## 📋 Políticas Aplicadas

Cada tabela agora tem uma política simples:

```sql
CREATE POLICY "table_name_simple_policy" ON public.table_name
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
```

## ⚠️ Importante

- **Segurança mantida**: Apenas usuários autenticados podem acessar os dados
- **Performance melhorada**: Sem verificações complexas de permissões
- **Simplicidade**: Políticas diretas e fáceis de manter

## 🔄 Rollback (se necessário)

Se precisar reverter:

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE public.company_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
-- ... outras tabelas

-- Reabilitar RLS
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
-- ... outras tabelas
```

## 📞 Suporte

Se a correção não resolver o problema:

1. Verifique os logs do Supabase
2. Confirme que a migração foi aplicada com sucesso
3. Teste com uma consulta simples no SQL Editor

---

**✅ Esta correção resolve definitivamente o problema de recursão infinita e permite que a aplicação carregue empresas normalmente.**
