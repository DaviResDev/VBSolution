import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  quantity: number;
  min_quantity?: number;
  max_quantity?: number;
  unit: string;
  unit_price: number;
  currency?: string;
  supplier_id?: string;
  location?: string;
  status: 'active' | 'inactive' | 'discontinued';
  image_url?: string;
  barcode?: string;
  tags?: string[];
  notes?: string;
  responsible_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason?: string;
  reference_id?: string;
  reference_type?: string;
  location_from?: string;
  location_to?: string;
  created_by: string;
  created_at: string;
}

export const useInventory = () => {
  const { user } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: items, error: itemsError } = await supabase
        .from('inventory')
        .select('*')
        .eq('responsible_id', user.id)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      const { data: movementsData, error: movementsError } = await supabase
        .from('inventory_movements')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (movementsError) throw movementsError;
      
      setInventoryItems(items || []);
      setMovements(movementsData || []);
    } catch (err) {
      console.error('Erro ao buscar inventário:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar inventário');
      setInventoryItems([]);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  const createInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const itemWithUser = {
        ...itemData,
        responsible_id: user.id,
        currency: itemData.currency || 'BRL',
        status: itemData.status || 'active'
      };

      const { data, error } = await supabase
        .from('inventory')
        .insert([itemWithUser])
        .select()
        .single();

      if (error) throw error;
      
      await fetchInventory(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar item do inventário');
      throw err;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchInventory(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar item do inventário');
      throw err;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchInventory(); // Recarregar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir item do inventário');
      throw err;
    }
  };

  const addInventoryMovement = async (movementData: Omit<InventoryMovement, 'id' | 'created_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const movementWithUser = {
        ...movementData,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('inventory_movements')
        .insert([movementWithUser])
        .select()
        .single();

      if (error) throw error;

      // Atualizar quantidade do item
      const item = inventoryItems.find(i => i.id === movementData.item_id);
      if (item) {
        let newQuantity = item.quantity;
        switch (movementData.movement_type) {
          case 'in':
            newQuantity += movementData.quantity;
            break;
          case 'out':
            newQuantity -= movementData.quantity;
            break;
          case 'adjustment':
            newQuantity = movementData.quantity;
            break;
        }

        await updateInventoryItem(movementData.item_id, { quantity: Math.max(0, newQuantity) });
      }
      
      await fetchInventory(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar movimentação');
      throw err;
    }
  };

  const getItemsByCategory = (category: string) => {
    return inventoryItems.filter(item => item.category === category);
  };

  const getItemsByStatus = (status: InventoryItem['status']) => {
    return inventoryItems.filter(item => item.status === status);
  };

  const getLowStockItems = () => {
    return inventoryItems.filter(item => 
      item.min_quantity && item.quantity <= item.min_quantity
    );
  };

  const getOutOfStockItems = () => {
    return inventoryItems.filter(item => item.quantity === 0);
  };

  const getItemsByLocation = (location: string) => {
    return inventoryItems.filter(item => item.location === location);
  };

  const searchItems = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return inventoryItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.sku && item.sku.toLowerCase().includes(lowerQuery)) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  };

  const getTotalValue = () => {
    return inventoryItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  };

  const getMovementsByItem = (itemId: string) => {
    return movements.filter(movement => movement.item_id === itemId);
  };

  const getMovementsByType = (type: InventoryMovement['movement_type']) => {
    return movements.filter(movement => movement.movement_type === type);
  };

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  return {
    inventoryItems,
    movements,
    loading,
    error,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addInventoryMovement,
    getItemsByCategory,
    getItemsByStatus,
    getLowStockItems,
    getOutOfStockItems,
    getItemsByLocation,
    searchItems,
    getTotalValue,
    getMovementsByItem,
    getMovementsByType,
    refetch: fetchInventory
  };
};
