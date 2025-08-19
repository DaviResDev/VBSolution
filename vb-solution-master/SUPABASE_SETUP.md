# Configuração do Supabase

## Credenciais do Projeto
- **Project ID**: zqlwthtkjhmjydkeghfh
- **Project URL**: https://zqlwthtkjhmjydkeghfh.supabase.co
- **Anon Public Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbHd0aHRramhtanlka2VnaGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzOTUxMTksImV4cCI6MjA3MDk3MTExOX0.iDAzEjWRHjETngE-elo2zVdgaRmsIWoKDY12OT_O4NY

## Configuração das Tabelas

### 1. Executar a Migração SQL
Execute o arquivo `supabase/migrations/20250101000000_create_profiles_table.sql` no SQL Editor do Supabase.

### 2. Verificar Configurações de Autenticação
- Vá para Authentication > Settings
- Configure as URLs permitidas para redirecionamento
- Adicione: `http://localhost:5173`, `http://localhost:3000` (para desenvolvimento)

### 3. Configurar RLS (Row Level Security)
- As políticas já estão definidas na migração
- Verifique se RLS está habilitado na tabela `profiles`

## Funcionalidades Implementadas

### ✅ Sistema de Login/Cadastro
- Tela de login com design moderno
- Cadastro de novos usuários
- Autenticação via Supabase Auth
- Redirecionamento automático

### ✅ Proteção de Rotas
- Todas as rotas principais protegidas
- Redirecionamento para login se não autenticado
- Componente ProtectedRoute implementado

### ✅ Gerenciamento de Usuário
- Perfil do usuário armazenado no Supabase
- Informações exibidas no topbar
- Funcionalidade de logout

### ✅ Integração com Sistema Existente
- Mantém toda a funcionalidade existente
- Apenas adiciona autenticação
- Não altera a lógica de negócio

## Como Usar

1. **Desenvolvimento**: Execute `npm run dev`
2. **Acesse**: http://localhost:5173/login
3. **Cadastre-se** ou faça login
4. **Acesse** o sistema normalmente

## Estrutura de Arquivos

- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/hooks/useAuth.ts` - Hook para operações de auth
- `src/hooks/useUserData.ts` - Hook para dados do usuário
- `src/components/ProtectedRoute.tsx` - Proteção de rotas
- `src/pages/Login.tsx` - Tela de login/cadastro
- `supabase/migrations/` - Migrações SQL

## Próximos Passos

1. Executar a migração SQL no Supabase
2. Testar o sistema de login/cadastro
3. Verificar se todas as funcionalidades estão funcionando
4. Personalizar conforme necessário
