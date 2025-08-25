// Script para testar a tabela projects no Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando as credenciais do client.ts)
const SUPABASE_URL = "https://zqlwthtkjhmjydkeghfh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbHd0aHRramhtanlka2VnaGZoIiwicj9sZSI6ImFub24iLCJpYXQiOjE3NTUzOTUxMTksImV4cCI6MjA3MDk3MTExOX0.iDAzEjWRHjETngE-elo2zVdgaRmsIWoKDY12OT_O4NY";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testProjectsTable() {
  console.log('🔍 Testando conexão com a tabela projects...');
  
  try {
    // Teste 1: Verificar se a tabela existe
    console.log('\n1️⃣ Testando se a tabela projects existe...');
    const { data: tableTest, error: tableError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela projects:', tableError);
      return false;
    }
    
    console.log('✅ Tabela projects acessível:', tableTest);
    
    // Teste 2: Tentar inserir um projeto de teste
    console.log('\n2️⃣ Testando inserção de projeto...');
    const testProject = {
      name: 'Projeto Teste - ' + new Date().toISOString(),
      description: 'Projeto para testar o sistema',
      status: 'pending',
      priority: 'medium',
      responsible_id: 'test-user-' + Date.now(),
      currency: 'BRL',
      progress: 0
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('projects')
      .insert([testProject])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir projeto:', insertError);
      return false;
    }
    
    console.log('✅ Projeto inserido com sucesso:', insertData);
    
    // Teste 3: Buscar o projeto inserido
    console.log('\n3️⃣ Testando busca de projeto...');
    const { data: searchData, error: searchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', insertData.id);
    
    if (searchError) {
      console.error('❌ Erro ao buscar projeto:', searchError);
      return false;
    }
    
    console.log('✅ Projeto encontrado:', searchData);
    
    // Teste 4: Deletar o projeto de teste
    console.log('\n4️⃣ Limpando projeto de teste...');
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar projeto:', deleteError);
      return false;
    }
    
    console.log('✅ Projeto de teste removido');
    
    console.log('\n🎉 Todos os testes passaram! A tabela projects está funcionando corretamente.');
    return true;
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return false;
  }
}

// Executar o teste
testProjectsTable()
  .then(success => {
    if (success) {
      console.log('\n✅ SUCESSO: A tabela projects está funcionando perfeitamente!');
      process.exit(0);
    } else {
      console.log('\n❌ FALHA: Há problemas com a tabela projects');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 ERRO CRÍTICO:', error);
    process.exit(1);
  });
