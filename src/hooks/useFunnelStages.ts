
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FunnelStage {
  id: string;
  name: string;
  order_position: number;
  color: string;
  created_at: string;
}

export const useFunnelStages = () => {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnel_stages' as any)
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      
      let stagesData = data || [];
      
      // Se não há etapas, criar etapas padrão
      if (stagesData.length === 0) {
        const defaultStages = [
          { name: 'Contato Inicial', color: '#3b82f6', order_position: 1 },
          { name: 'Qualificação', color: '#8b5cf6', order_position: 2 },
          { name: 'Proposta', color: '#f59e0b', order_position: 3 },
          { name: 'Fechamento', color: '#10b981', order_position: 4 }
        ];
        
        for (const stage of defaultStages) {
          const { data: newStage, error: createError } = await supabase
            .from('funnel_stages' as any)
            .insert([stage])
            .select()
            .single();
          
          if (!createError && newStage) {
            stagesData.push(newStage);
          }
        }
      }
      
      setStages(stagesData);
    } catch (err) {
      console.error('Error fetching stages:', err);
      setError(err instanceof Error ? err.message : 'Error fetching stages');
    } finally {
      setLoading(false);
    }
  };

  const createStage = async (stageData: Omit<FunnelStage, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('funnel_stages' as any)
        .insert([stageData])
        .select()
        .single();

      if (error) throw error;
      await fetchStages();
      return data;
    } catch (err) {
      console.error('Error creating stage:', err);
      setError(err instanceof Error ? err.message : 'Error creating stage');
      throw err;
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  return {
    stages,
    loading,
    error,
    createStage,
    refetch: fetchStages
  };
};
