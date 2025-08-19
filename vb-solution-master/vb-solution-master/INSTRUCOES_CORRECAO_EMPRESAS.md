# Instruções para Corrigir Erro ao Carregar Empresas

## Problema Identificado

A página de empresas está exibindo o erro: **"Erro ao carregar empresas: Erro ao buscar empresas"**

## Causa do Problema

O erro pode ser causado por:
1. **Tabela `companies` não existe** no Supabase
2. **Políticas RLS incorretas** na tabela
3. **Problemas de permissão** do usuário
4. **Estrutura da tabela incompleta**

## Solução Implementada

### 1. **Migração Criada**
- **Arquivo**: `supabase/migrations/20250801120000_create_companies_table.sql`
- **Função**: Garantir que a tabela `companies` existe com estrutura correta

### 2. **Hook Melhorado**
- **Arquivo**: `src/hooks/useCompanies.ts`
- **Melhorias**: Logs de debug, teste de conectividade, melhor tratamento de erro

## Como Aplicar a Correção

### Passo 1: Aplicar a Migração no Supabase

1. Acesse o [painel do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue para **SQL Editor**
4. Execute a migração:

```sql
-- Copie e cole o conteúdo de: 20250801120000_create_companies_table.sql
```

### Passo 2: Verificar a Estrutura da Tabela

Após aplicar a migração, verifique se a tabela foi criada:

```sql
-- Verificar se a tabela existe
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'companies';

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies';

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'companies';
```

### Passo 3: Testar a Conexão

No SQL Editor, teste se consegue acessar a tabela:

```sql
-- Teste básico
SELECT COUNT(*) FROM companies;

-- Teste com dados de exemplo
SELECT * FROM companies LIMIT 5;
```

## Verificação da Correção

### 1. **Console do Navegador**
Abra o console (F12) e verifique os logs:
- ✅ `🔍 Iniciando busca de empresas...`
- ✅ `👤 Usuário atual: ID: [uuid]`
- ✅ `📡 Fazendo consulta ao Supabase...`
- ✅ `✅ Tabela companies acessível`
- ✅ `✅ Consulta bem-sucedida, empresas encontradas: X`

### 2. **Página de Empresas**
- ✅ Não deve mais exibir erro
- ✅ Deve mostrar empresas de exemplo (se aplicado)
- ✅ Deve permitir criar novas empresas

### 3. **Funcionalidades**
- ✅ Listagem de empresas
- ✅ Criação de nova empresa
- ✅ Edição de empresa existente
- ✅ Exclusão de empresa

## Troubleshooting

### Problema: "Tabela companies não existe"
**Solução**: Aplicar a migração `20250801120000_create_companies_table.sql`

### Problema: "Permissão negada"
**Solução**: Verificar se as políticas RLS estão configuradas corretamente

### Problema: "Usuário não autenticado"
**Solução**: Verificar se o usuário está logado e se o AuthContext está funcionando

### Problema: "Erro de conexão com Supabase"
**Solução**: Verificar se as credenciais do Supabase estão corretas

## Estrutura da Tabela Companies

### Campos Obrigatórios
- `id` - UUID (chave primária)
- `name` - TEXT (nome da empresa)
- `responsible_id` - UUID (referência ao usuário)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Campos Opcionais
- `cnpj` - TEXT
- `email` - TEXT
- `phone` - TEXT
- `address` - TEXT
- `city` - TEXT
- `state` - TEXT
- `logo_url` - TEXT
- `description` - TEXT
- `sector` - TEXT
- `status` - TEXT (padrão: 'active')

## Dados de Exemplo

A migração insere automaticamente 3 empresas de exemplo:
1. **Tech Solutions Ltda** - São Paulo, SP
2. **Inovação Digital** - Rio de Janeiro, RJ
3. **Consultoria Prime** - Belo Horizonte, MG

## Próximos Passos

1. **Aplicar a migração** no painel do Supabase
2. **Verificar se a tabela foi criada** corretamente
3. **Testar a página** de empresas
4. **Verificar logs** no console do navegador
5. **Testar funcionalidades** de CRUD

---

**Data**: 2025-08-01  
**Versão**: 1.0  
**Status**: Pronto para aplicação
