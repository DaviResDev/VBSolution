# Instruções para Limpeza Completa de Dados Mockados

## Objetivo

Remover todos os dados fictícios do sistema e implementar persistência real no Supabase, garantindo que:
- ✅ Todos os dados sejam salvos no banco de dados
- ✅ Cada registro seja associado ao usuário logado
- ✅ Os dados persistam entre sessões
- ✅ O sistema funcione apenas com dados reais

## Hooks Personalizados Criados

### 1. **useCompanies** - Gerenciamento de Empresas
- **Arquivo**: `src/hooks/useCompanies.ts`
- **Funcionalidades**:
  - Busca empresas do usuário logado
  - CRUD completo com persistência
  - Filtros por status, cidade, estado
  - Busca por nome, CNPJ, email

### 2. **useActivities** - Gerenciamento de Atividades
- **Arquivo**: `src/hooks/useActivities.ts`
- **Funcionalidades**:
  - Busca atividades do usuário logado
  - CRUD completo com persistência
  - Filtros por status, prioridade, tipo
  - Atividades vencidas
  - Exclusão múltipla

### 3. **useProjects** - Gerenciamento de Projetos
- **Arquivo**: `src/hooks/useProjects.ts`
- **Funcionalidades**:
  - Busca projetos do usuário logado
  - CRUD completo com persistência
  - Filtros por status, prioridade
  - Atualização de progresso
  - Projetos por empresa

### 4. **useLeads** - Gerenciamento de Leads
- **Arquivo**: `src/hooks/useLeads.ts`
- **Funcionalidades**:
  - Busca leads do usuário logado
  - CRUD completo com persistência
  - Filtros por status, origem, valor
  - Leads precisando de follow-up
  - Atribuição de leads

### 5. **useInventory** - Gerenciamento de Inventário
- **Arquivo**: `src/hooks/useInventory.ts`
- **Funcionalidades**:
  - Busca itens do usuário logado
  - CRUD completo com persistência
  - Movimentações de estoque
  - Filtros por categoria, status, localização
  - Itens com estoque baixo

### 6. **useSuppliers** - Gerenciamento de Fornecedores
- **Arquivo**: `src/hooks/useSuppliers.ts`
- **Funcionalidades**:
  - Busca fornecedores do usuário logado
  - CRUD completo com persistência
  - Sistema de avaliação
  - Filtros por status, estado, cidade
  - Suspensão/ativação

### 7. **useWorkGroups** - Gerenciamento de Grupos de Trabalho
- **Arquivo**: `src/hooks/useWorkGroups.ts`
- **Funcionalidades**:
  - Busca grupos do usuário logado
  - CRUD completo com persistência
  - Sistema de membros e papéis
  - Permissões hierárquicas
  - Filtros por tipo e status

### 8. **useEmployees** - Gerenciamento de Funcionários
- **Arquivo**: `src/hooks/useEmployees.ts`
- **Funcionalidades**:
  - Busca funcionários do usuário logado
  - CRUD completo com persistência
  - Estrutura organizacional
  - Filtros por departamento, status, posição
  - Hierarquia de gestão

## Como Implementar

### Passo 1: Substituir Hooks Existentes

Em cada página, substitua os hooks antigos pelos novos:

```tsx
// ANTES (com dados mock)
import { useCompanies } from '@/hooks/useCompanies';

// DEPOIS (com persistência real)
import { useCompanies } from '@/hooks/useCompanies';
```

### Passo 2: Atualizar Componentes

Os novos hooks já retornam os dados no formato correto, então a maioria dos componentes funcionará sem alterações.

### Passo 3: Verificar Associação de Usuário

Todos os novos hooks automaticamente:
- ✅ Filtram dados por `user.id`
- ✅ Associam novos registros ao usuário logado
- ✅ Recarregam dados após operações CRUD

## Estrutura das Tabelas no Supabase

### Tabelas Principais
1. **companies** - Empresas
2. **activities** - Atividades
3. **projects** - Projetos
4. **leads** - Leads
5. **inventory** - Inventário
6. **suppliers** - Fornecedores
7. **work_groups** - Grupos de trabalho
8. **employees** - Funcionários

### Campos Comuns
Todas as tabelas incluem:
- `id` - UUID único
- `responsible_id` - ID do usuário responsável
- `created_at` - Data de criação
- `updated_at` - Data de atualização

## Benefícios da Implementação

### ✅ **Persistência Real**
- Dados salvos no banco Supabase
- Persistência entre sessões
- Backup automático

### ✅ **Segurança por Usuário**
- Cada usuário vê apenas seus dados
- Isolamento completo entre usuários
- Políticas RLS configuradas

### ✅ **Performance**
- Dados carregados sob demanda
- Cache automático do Supabase
- Consultas otimizadas

### ✅ **Escalabilidade**
- Suporte a milhares de registros
- Paginação automática
- Filtros eficientes

## Verificação da Implementação

### 1. **Teste de Criação**
- Crie um novo registro
- Faça logout e login novamente
- Verifique se o registro ainda existe

### 2. **Teste de Edição**
- Edite um registro existente
- Recarregue a página
- Verifique se as mudanças persistiram

### 3. **Teste de Exclusão**
- Exclua um registro
- Recarregue a página
- Verifique se foi removido permanentemente

### 4. **Teste de Filtros**
- Use os filtros de busca
- Verifique se retornam dados corretos
- Teste filtros combinados

## Troubleshooting

### Problema: Dados não aparecem
**Solução**: Verificar se o usuário está autenticado e se as políticas RLS estão corretas

### Problema: Erro ao criar registros
**Solução**: Verificar se todas as colunas obrigatórias estão sendo preenchidas

### Problema: Dados não persistem
**Solução**: Verificar se as operações de insert/update estão sendo executadas corretamente

### Problema: Performance lenta
**Solução**: Verificar se os índices estão criados nas tabelas do Supabase

## Próximos Passos

1. **Aplicar os novos hooks** em todas as páginas
2. **Testar funcionalidades** de CRUD
3. **Verificar filtros** e buscas
4. **Testar persistência** entre sessões
5. **Otimizar consultas** se necessário

---

**Data**: 2025-08-01  
**Versão**: 1.0  
**Status**: Hooks criados e prontos para implementação
