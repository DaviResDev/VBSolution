
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  responsible_id?: string;
  logo_url?: string;
  description?: string;
  sector?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export const useCompanies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    console.log('🔍 Iniciando busca de empresas...');
    console.log('👤 Usuário atual:', user ? `ID: ${user.id}` : 'Não autenticado');
    
    if (!user) {
      console.log('❌ Usuário não autenticado, abortando busca');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Fazendo consulta ao Supabase...');
      console.log('🔗 URL do Supabase:', supabase.supabaseUrl);
      
      // Primeiro, testar se a tabela existe e é acessível
      const { data: testData, error: testError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('❌ Erro ao testar acesso à tabela companies:', testError);
        throw new Error(`Problema de acesso à tabela companies: ${testError.message}`);
      }
      
      console.log('✅ Tabela companies acessível');
      
      // Agora fazer a consulta real
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('responsible_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na consulta Supabase:', error);
        throw error;
      }
      
      console.log('✅ Consulta bem-sucedida, empresas encontradas:', data?.length || 0);
      console.log('🏢 Dados das empresas:', data);
      
      setCompanies(data || []);
    } catch (err) {
      console.error('💥 Erro ao buscar empresas:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar empresas';
      setError(errorMessage);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      console.log('🏗️ Criando empresa:', companyData);
      
      const companyWithUser = {
        ...companyData,
        responsible_id: user.id
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([companyWithUser])
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Empresa criada com sucesso:', data);
      await fetchCompanies(); // Recarregar dados
      return data;
    } catch (err) {
      console.error('❌ Erro ao criar empresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      console.log('🔄 Atualizando empresa:', { id, updates });
      
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Empresa atualizada com sucesso:', data);
      await fetchCompanies(); // Recarregar dados
      return data;
    } catch (err) {
      console.error('❌ Erro ao atualizar empresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar empresa');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      console.log('🗑️ Excluindo empresa:', id);
      
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Empresa excluída com sucesso');
      await fetchCompanies(); // Recarregar dados
    } catch (err) {
      console.error('❌ Erro ao excluir empresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir empresa');
      throw err;
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect executado, usuário:', user ? 'Autenticado' : 'Não autenticado');
    if (user) {
      fetchCompanies();
    } else {
      setLoading(false);
      setCompanies([]);
      setError(null);
    }
  }, [user]);

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  };
};
