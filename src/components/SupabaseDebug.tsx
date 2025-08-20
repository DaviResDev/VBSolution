import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SupabaseDebug = () => {
  const { user } = useAuth();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSupabaseData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('🔍 Verificando dados no Supabase para usuário:', user.id);
      
      // Verificar dados do usuário na tabela auth.users
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      console.log('🔍 Auth User:', authUser);
      console.log('🔍 Auth Error:', authError);
      
      // Verificar perfil na tabela user_profiles
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      console.log('🔍 Profile (user_profiles):', profile);
      console.log('🔍 Profile Error:', profileError);
      
      // Verificar perfil na tabela profiles (antiga)
      const { data: oldProfile, error: oldProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      console.log('🔍 Old Profile (profiles):', oldProfile);
      console.log('🔍 Old Profile Error:', oldProfileError);
      
      // Verificar todas as tabelas disponíveis
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      console.log('🔍 Tabelas disponíveis:', tables);
      console.log('🔍 Tables Error:', tablesError);
      
      setDebugData({
        authUser,
        authError,
        profile,
        profileError,
        oldProfile,
        oldProfileError,
        tables,
        tablesError,
        userMetadata: user.user_metadata,
        userEmail: user.email
      });
      
    } catch (error) {
      console.error('❌ Erro ao verificar dados:', error);
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Debug Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum usuário autenticado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Debug Supabase - Dados do Banco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkSupabaseData} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Verificando...' : 'Verificar Dados no Supabase'}
        </Button>
        
        {debugData && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded text-xs">
              <h4 className="font-bold mb-2">Usuário Autenticado:</h4>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Metadados:</strong> {JSON.stringify(user.user_metadata, null, 2)}</p>
            </div>
            
            {debugData.authUser && (
              <div className="p-3 bg-blue-100 rounded text-xs">
                <h4 className="font-bold mb-2">Auth User (getUser):</h4>
                <pre className="whitespace-pre-wrap">{JSON.stringify(debugData.authUser, null, 2)}</pre>
              </div>
            )}
            
            {debugData.profile && (
              <div className="p-3 bg-green-100 rounded text-xs">
                <h4 className="font-bold mb-2">Perfil (user_profiles):</h4>
                <pre className="whitespace-pre-wrap">{JSON.stringify(debugData.profile, null, 2)}</pre>
              </div>
            )}
            
            {debugData.oldProfile && (
              <div className="p-3 bg-yellow-100 rounded text-xs">
                <h4 className="font-bold mb-2">Perfil (profiles):</h4>
                <pre className="whitespace-pre-wrap">{JSON.stringify(debugData.oldProfile, null, 2)}</pre>
              </div>
            )}
            
            {debugData.tables && (
              <div className="p-3 bg-purple-100 rounded text-xs">
                <h4 className="font-bold mb-2">Tabelas Disponíveis:</h4>
                <ul>
                  {debugData.tables.map((table: any, index: number) => (
                    <li key={index}>{table.table_name}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {debugData.error && (
              <div className="p-3 bg-red-100 rounded text-xs">
                <h4 className="font-bold mb-2">Erro:</h4>
                <p>{debugData.error}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
