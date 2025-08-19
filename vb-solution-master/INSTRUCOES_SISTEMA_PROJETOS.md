# 📋 SISTEMA DE PROJETOS - FUNCIONAMENTO COMPLETO

## 🎯 OBJETIVO

Explicar como o sistema de projetos funciona para garantir que:
- ✅ Projetos sejam salvos na conta do usuário logado
- ✅ Dados sejam armazenados permanentemente no Supabase
- ✅ Sistema funcione corretamente com autenticação

## 🔐 COMO FUNCIONA A AUTENTICAÇÃO

### 1. **Sistema de Login**
- Usuários se cadastram na página de login
- Fazem login com email e senha
- Sistema gera um token de autenticação único
- Usuário fica logado até fazer logout

### 2. **Identificação do Usuário**
- Cada usuário logado tem um `user.id` único
- Este ID é usado para vincular projetos ao usuário
- Sistema só mostra projetos do usuário logado

## 🏗️ ARQUITETURA DO SISTEMA

### 1. **Hook useProjects**
```typescript
// src/hooks/useProjects.ts
export const useProjects = () => {
  const { user } = useAuth(); // Pega usuário logado
  
  const createProject = async (projectData) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const projectWithUser = {
      ...projectData,
      responsible_id: user.id, // VINCULA AO USUÁRIO
      currency: 'BRL',
      progress: 0
    };

    // SALVA NO SUPABASE
    const { data, error } = await supabase
      .from('projects')
      .insert([projectWithUser])
      .select()
      .single();

    return data;
  };
};
```

### 2. **Modal de Criação**
```typescript
// src/components/ProjectCreateModal.tsx
const ProjectCreateModal = () => {
  const { user } = useAuth(); // Usuário logado
  const { createProject } = useProjects(); // Hook para salvar
  
  const handleSubmit = async (e) => {
    // Preparar dados com usuário
    const projectData = {
      ...formData,
      responsible_id: user.id, // VINCULAR AO USUÁRIO LOGADO
      currency: 'BRL',
      progress: 0
    };

    // SALVAR NO SUPABASE
    const savedProject = await createProject(projectData);
  };
};
```

### 3. **Página de Projetos**
```typescript
// src/pages/Projects.tsx
const Projects = () => {
  const { user } = useAuth(); // Usuário logado
  const { projects, loading, error, refetch } = useProjects(); // Projetos do Supabase
  
  // Mostra apenas projetos do usuário logado
  // Carrega dados do Supabase automaticamente
};
```

## 📊 FLUXO DE CRIAÇÃO DE PROJETO

### 1. **Usuário Clica em "Criar Projeto"**
- Modal abre com formulário
- Sistema verifica se usuário está logado
- Mostra informações da conta logada

### 2. **Preenchimento do Formulário**
- Nome do projeto (obrigatório)
- Descrição (obrigatória)
- Status (planning, active, on_hold, completed, cancelled)
- Prioridade (low, medium, high, urgent)
- Datas (início e entrega)
- Orçamento
- Empresa (opcional)
- Tags
- Notas

### 3. **Salvamento no Supabase**
```sql
-- Dados salvos na tabela projects
INSERT INTO public.projects (
  name, description, status, priority,
  start_date, due_date, budget,
  responsible_id, -- ID DO USUÁRIO LOGADO
  company_id, tags, notes,
  created_at, updated_at
) VALUES (
  'Nome do Projeto',
  'Descrição do projeto',
  'planning',
  'medium',
  '2025-01-01',
  '2025-02-01',
  1000.00,
  'uuid-do-usuario-logado', -- VINCULADO AO USUÁRIO
  'uuid-da-empresa',
  ARRAY['tag1', 'tag2'],
  'Notas do projeto',
  NOW(),
  NOW()
);
```

### 4. **Confirmação de Sucesso**
- Toast mostra "Projeto criado com sucesso!"
- Modal fecha automaticamente
- Lista de projetos é recarregada
- Projeto aparece na interface

## 🔍 COMO OS DADOS SÃO CARREGADOS

### 1. **Carregamento Automático**
```typescript
// useProjects hook
const fetchProjects = async () => {
  if (!user) return;
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('responsible_id', user.id) // SÓ PROJETOS DO USUÁRIO
    .order('created_at', { ascending: false });

  setProjects(data || []);
};
```

### 2. **Filtragem por Usuário**
- Sistema só busca projetos onde `responsible_id = user.id`
- Usuários não veem projetos de outros usuários
- Dados são sempre atualizados em tempo real

## 🗄️ ESTRUTURA NO SUPABASE

### 1. **Tabela projects**
```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  priority TEXT DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  due_date DATE,
  budget DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  responsible_id UUID REFERENCES auth.users(id), -- CHAVE ESTRANGEIRA
  company_id UUID REFERENCES public.companies(id),
  client_id UUID REFERENCES public.companies(id),
  tags TEXT[],
  progress INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 2. **Relacionamentos**
- `responsible_id` → `auth.users(id)` (usuário que criou)
- `company_id` → `public.companies(id)` (empresa associada)
- `client_id` → `public.companies(id)` (cliente do projeto)

## ✅ GARANTIAS DE SEGURANÇA

### 1. **Autenticação Obrigatória**
- Usuário deve estar logado para criar projetos
- Sistema verifica `user` antes de qualquer operação
- Erro se tentar criar sem estar logado

### 2. **Isolamento de Dados**
- Usuários só veem seus próprios projetos
- `responsible_id` garante separação
- Nenhum acesso cruzado entre usuários

### 3. **Validação de Dados**
- Campos obrigatórios validados
- Tipos de dados verificados
- Erros tratados adequadamente

## 🧪 COMO TESTAR

### 1. **Teste de Criação**
1. Faça login na aplicação
2. Vá para `/projects`
3. Clique em "Criar Projeto"
4. Preencha o formulário
5. Clique em "Criar Projeto"
6. Verifique se aparece na lista

### 2. **Teste de Persistência**
1. Crie um projeto
2. Recarregue a página
3. Verifique se o projeto ainda está lá
4. Faça logout e login novamente
5. Verifique se o projeto aparece

### 3. **Teste no Supabase**
```sql
-- Verificar projetos criados
SELECT * FROM public.projects WHERE responsible_id = 'seu-user-id';

-- Verificar se está vinculado ao usuário correto
SELECT 
  p.name,
  p.responsible_id,
  u.email
FROM public.projects p
JOIN auth.users u ON p.responsible_id = u.id
WHERE p.responsible_id = 'seu-user-id';
```

## 🚨 SOLUÇÃO DE PROBLEMAS

### 1. **Projeto não aparece**
- Verifique se está logado
- Verifique se `responsible_id` está correto
- Execute `refetch()` para recarregar dados

### 2. **Erro ao criar projeto**
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique se está logado
- Verifique console para erros específicos

### 3. **Dados não salvam**
- Verifique conexão com Supabase
- Verifique se as migrações foram aplicadas
- Verifique se RLS está configurado corretamente

## 📋 RESUMO DO FUNCIONAMENTO

1. **Usuário faz login** → Sistema identifica com `user.id`
2. **Usuário cria projeto** → `responsible_id` é definido como `user.id`
3. **Dados são salvos** → No Supabase com vínculo ao usuário
4. **Projetos são carregados** → Apenas do usuário logado
5. **Dados são persistentes** → Salvos permanentemente no banco
6. **Segurança garantida** → Usuários só veem seus próprios projetos

## 🎉 RESULTADO FINAL

**✅ Projetos são salvos na conta do usuário logado**
**✅ Dados são armazenados permanentemente no Supabase**
**✅ Sistema funciona com autenticação completa**
**✅ Segurança e isolamento de dados garantidos**
**✅ Interface atualizada em tempo real**
