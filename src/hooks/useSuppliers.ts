
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Supplier {
  id: string;
  name: string;
  company_name?: string;
  cnpj?: string;
  phone?: string;
  cep?: string;
  address?: string;
  city?: string;
  state?: string;
  activity?: string;
  comments?: string;
  responsible_id?: string;
  photo_url?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      // Use type assertion to bypass the type checking issue
      const { data, error } = await (supabase as any)
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSuppliers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) throw error;
      await fetchSuppliers();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating supplier');
      throw err;
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSuppliers();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating supplier');
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting supplier');
      throw err;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers
  };
};
