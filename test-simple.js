// Teste simples de conexão com Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = "https://zqlwthtkjhmjydkeghfh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbHd0aHRramhtanlka2VnaGZoIiwicj9sZSI6ImFub24iLCJpYXQiOjE3NTUzOTUxMTksImV4cCI6MjA3MDk3MTExOX0.iDAzEjWRHjETngE-elo2zVdgaRmsIWoKDY12OT_O4NY";

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', SUPABASE_URL);
console.log('Chave:', SUPABASE_KEY ? 'Presente' : 'Ausente');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    console.log('\n1️⃣ Testando conexão básica...');
    
    // Teste simples: verificar se consegue acessar a tabela
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro:', error.message);
      console.error('Detalhes:', error);
      return false;
    }
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('Dados:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return false;
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 SUCESSO: Supabase está funcionando!');
    } else {
      console.log('\n❌ FALHA: Problemas com Supabase');
    }
    process.exit(success ? 0 : 1);
  });
