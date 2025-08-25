# Instruções para Testar o Sistema de Login/Cadastro

## 🚀 Como Testar

### 1. Configuração Inicial
1. **Execute o projeto**: `npm run dev`
2. **Acesse**: http://localhost:5173/login

### 2. Teste de Cadastro
1. Clique na aba "Cadastrar"
2. Preencha os campos:
   - Nome Completo: Seu nome
   - Email: seu@email.com
   - Empresa: Nome da sua empresa
   - Senha: senha123
3. Clique em "Criar Conta"
4. Verifique se aparece mensagem de sucesso

### 3. Teste de Login
1. Após o cadastro, clique na aba "Entrar"
2. Use as credenciais:
   - Email: seu@email.com
   - Senha: senha123
3. Clique em "Entrar"
4. Deve redirecionar para o dashboard

### 4. Teste de Funcionalidades
1. **Verificar proteção de rotas**:
   - Tente acessar http://localhost:5173/ diretamente
   - Deve redirecionar para login se não estiver logado

2. **Verificar informações do usuário**:
   - No topbar, clique no avatar do usuário
   - Deve mostrar seu nome e email
   - Deve ter opção de "Sair"

3. **Teste de logout**:
   - Clique em "Sair"
   - Deve redirecionar para login
   - Tente acessar uma rota protegida
   - Deve redirecionar para login

### 5. Teste de Responsividade
1. **Desktop**: Verifique se o layout está correto
2. **Mobile**: Redimensione a janela ou use DevTools
3. **Verifique** se os botões e campos estão funcionando

## 🔧 Configuração do Supabase

### 1. Executar Migração SQL
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `zqlwthtkjhmjydkeghfh`
3. Vá para SQL Editor
4. Execute o arquivo: `supabase/migrations/20250101000000_create_profiles_table.sql`

### 2. Verificar Configurações
1. **Authentication > Settings**:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/login`

2. **Database > Tables**:
   - Verificar se a tabela `profiles` foi criada
   - Verificar se RLS está habilitado

## 📱 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- [x] Tela de login/cadastro
- [x] Validação de campos
- [x] Integração com Supabase Auth
- [x] Redirecionamento automático

### ✅ Proteção de Rotas
- [x] Todas as rotas principais protegidas
- [x] Redirecionamento para login
- [x] Componente ProtectedRoute

### ✅ Gerenciamento de Usuário
- [x] Perfil armazenado no Supabase
- [x] Informações exibidas no topbar
- [x] Funcionalidade de logout

### ✅ Design e UX
- [x] Interface moderna e responsiva
- [x] Logo do sistema integrada
- [x] Paleta de cores consistente
- [x] Animações e transições

## 🐛 Solução de Problemas

### Erro de Conexão com Supabase
- Verifique se as credenciais estão corretas
- Verifique se o projeto está ativo
- Verifique se as políticas RLS estão configuradas

### Erro de Redirecionamento
- Verifique as URLs configuradas no Supabase
- Verifique se o ProtectedRoute está funcionando

### Erro de Tabela
- Execute a migração SQL novamente
- Verifique se a tabela `profiles` existe
- Verifique se os triggers estão funcionando

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Verifique os logs do Supabase
3. Verifique se todas as dependências estão instaladas
4. Execute `npm install` se necessário
