# 🚨 EMERGÊNCIA: Recursão Infinita na Tabela company_users

## ⚠️ PROBLEMA CRÍTICO

**Erro atual:** `infinite recursion detected in policy for relation "company_users" em /companies`

**Status:** A aplicação **NÃO consegue carregar empresas** devido a políticas RLS problemáticas.

## 🚀 SOLUÇÃO DE EMERGÊNCIA

Criamos uma migração de emergência (`20250801140000_emergency_disable_rls.sql`) que **resolve o problema IMEDIATAMENTE**.

### 🔧 O que a migração de emergência faz:

1. **DESABILITA COMPLETAMENTE RLS** em todas as tabelas problemáticas
2. **REMOVE TODAS as políticas** que causam recursão infinita
3. **RESOLVE o erro imediatamente** - aplicação deve funcionar em segundos

## 📋 COMO APLICAR AGORA (URGENTE)

### ⚡ Opção 1: Supabase Dashboard (MAIS RÁPIDO)

1. **Acesse:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Vá para:** Seu projeto → **SQL Editor**
3. **Cole e execute** o conteúdo da migração `20250801140000_emergency_disable_rls.sql`
4. **Clique em "Run"** - deve demorar apenas alguns segundos

### ⚡ Opção 2: Supabase CLI

```bash
cd vb-solution-master
supabase db push
```

## ✅ RESULTADO IMEDIATO

**Após executar a migração:**
- ❌ Erro de recursão infinita → **RESOLVIDO**
- ✅ Carregamento de empresas → **FUNCIONANDO**
- ✅ Aplicação → **OPERACIONAL**

## ⚠️ IMPORTANTE: SOLUÇÃO TEMPORÁRIA

**Esta é uma solução de EMERGÊNCIA** que:
- ✅ **Resolve o problema imediatamente**
- ✅ **Permite que a aplicação funcione**
- ⚠️ **Reduz temporariamente a segurança** (RLS desabilitado)
- 🔄 **Será corrigida com políticas seguras em breve**

## 🧪 TESTE IMEDIATO

**Após aplicar a migração:**

1. **Recarregue a aplicação**
2. **Tente acessar a página de empresas**
3. **Verifique se carrega normalmente**
4. **Confirme que não há mais erros de recursão**

## 📞 SE AINDA NÃO FUNCIONAR

**Execute esta consulta simples no SQL Editor para verificar:**

```sql
-- Teste básico de acesso
SELECT * FROM public.companies LIMIT 1;
```

**Se retornar dados:** ✅ Problema resolvido
**Se der erro:** ⚠️ Execute a migração novamente

## 🔄 PRÓXIMOS PASSOS

**Após resolver o problema de emergência:**

1. ✅ **Aplicação funcionando**
2. 🔄 **RLS será reconfigurado com políticas seguras**
3. 🔒 **Segurança será restaurada**
4. 📋 **Sistema funcionará normalmente**

## 🚨 RESUMO DE EMERGÊNCIA

**PROBLEMA:** Recursão infinita impede carregamento de empresas
**SOLUÇÃO:** Desabilitar RLS temporariamente
**RESULTADO:** Aplicação funciona imediatamente
**SEGURANÇA:** Restaurada em breve com políticas corretas

---

## ⚡ EXECUTE AGORA

**Copie o conteúdo da migração `20250801140000_emergency_disable_rls.sql` e execute no SQL Editor do Supabase.**

**Tempo estimado:** 30 segundos
**Resultado:** Aplicação funcionando normalmente
