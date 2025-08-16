
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  fantasy_name: string;
  company_name?: string;
  cnpj?: string;
  reference?: string;
  cep?: string;
  address?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  responsible_id?: string;
  logo_url?: string;
  description?: string;
  sector?: string;
  created_at: string;
  updated_at: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      let companiesData = data || [];
      
      // Se não há empresas, criar empresas de exemplo
      if (companiesData.length === 0) {
        const sampleCompanies = [
          {
            fantasy_name: 'Tech Solutions Ltda',
            company_name: 'Tech Solutions Tecnologia Ltda',
            email: 'contato@techsolutions.com.br',
            phone: '(11) 98765-4321',
            city: 'São Paulo',
            state: 'SP',
            sector: 'Tecnologia'
          },
          {
            fantasy_name: 'Inovação Digital',
            company_name: 'Inovação Digital Serviços Ltda',
            email: 'vendas@inovacaodigital.com.br',
            phone: '(21) 99876-5432',
            city: 'Rio de Janeiro',
            state: 'RJ',
            sector: 'Marketing Digital'
          },
          {
            fantasy_name: 'Consultoria Prime',
            company_name: 'Prime Consultoria Empresarial S.A.',
            email: 'prime@consultoria.com.br',
            phone: '(31) 91234-5678',
            city: 'Belo Horizonte',
            state: 'MG',
            sector: 'Consultoria'
          }
        ];
        
        for (const company of sampleCompanies) {
          const { data: newCompany, error: createError } = await supabase
            .from('companies')
            .insert([company])
            .select()
            .single();
          
          if (!createError && newCompany) {
            companiesData.push(newCompany);
          }
        }
      }
      
      setCompanies(companiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching companies');
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) throw error;
      await fetchCompanies();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating company');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCompanies();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating company');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting company');
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

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
