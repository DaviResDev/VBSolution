
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Supplier {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  contact_person?: string;
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  payment_terms?: string;
  notes?: string;
  responsible_id?: string;
  created_at: string;
  updated_at: string;
}

export const useSuppliers = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('responsible_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSuppliers(data || []);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar fornecedores');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const supplierWithUser = {
        ...supplierData,
        responsible_id: user.id,
        status: supplierData.status || 'active'
      };

      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierWithUser])
        .select()
        .single();

      if (error) throw error;
      
      await fetchSuppliers(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar fornecedor');
      throw err;
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchSuppliers(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar fornecedor');
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchSuppliers(); // Recarregar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir fornecedor');
      throw err;
    }
  };

  const getSuppliersByStatus = (status: Supplier['status']) => {
    return suppliers.filter(supplier => supplier.status === status);
  };

  const getSuppliersByState = (state: string) => {
    return suppliers.filter(supplier => supplier.state === state);
  };

  const getSuppliersByCity = (city: string) => {
    return suppliers.filter(supplier => supplier.city === city);
  };

  const searchSuppliers = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(lowerQuery) ||
      (supplier.cnpj && supplier.cnpj.includes(lowerQuery)) ||
      (supplier.email && supplier.email.toLowerCase().includes(lowerQuery)) ||
      (supplier.contact_person && supplier.contact_person.toLowerCase().includes(lowerQuery))
    );
  };

  const getActiveSuppliers = () => {
    return suppliers.filter(supplier => supplier.status === 'active');
  };

  const getTopRatedSuppliers = (limit: number = 5) => {
    return suppliers
      .filter(supplier => supplier.rating && supplier.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  };

  const updateSupplierRating = async (id: string, rating: number) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update({ rating: Math.max(1, Math.min(5, rating)) })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchSuppliers(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar avaliação do fornecedor');
      throw err;
    }
  };

  const suspendSupplier = async (id: string, reason?: string) => {
    try {
      const updates: Partial<Supplier> = { status: 'suspended' };
      if (reason) {
        updates.notes = reason;
      }

      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchSuppliers(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao suspender fornecedor');
      throw err;
    }
  };

  const activateSupplier = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchSuppliers(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao ativar fornecedor');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSuppliers();
    }
  }, [user]);

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliersByStatus,
    getSuppliersByState,
    getSuppliersByCity,
    searchSuppliers,
    getActiveSuppliers,
    getTopRatedSuppliers,
    updateSupplierRating,
    suspendSupplier,
    activateSupplier,
    refetch: fetchSuppliers
  };
};
