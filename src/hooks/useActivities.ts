import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  type: 'task' | 'meeting' | 'call' | 'email' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  start_time?: string;
  end_time?: string;
  responsible_id?: string;
  user_id: string;
  company_id?: string;
  project_id?: string;
  lead_id?: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityData {
  title: string;
  description?: string;
  type: 'task' | 'meeting' | 'call' | 'email' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  start_time?: string;
  end_time?: string;
  responsible_id?: string;
  user_id?: string;
  company_id?: string;
  project_id?: string;
  lead_id?: string;
  tags?: string[];
  notes?: string;
}

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar atividades do Supabase
  const fetchActivities = async () => {
    console.log('🔍 Iniciando busca de atividades...');
    
    if (!user) {
      console.log('❌ Usuário não autenticado, parando busca');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('👤 Usuário autenticado:', user.id);

      // Buscar atividades do usuário logado
      console.log('📡 Buscando atividades do usuário...');
      
      // Primeiro, vamos tentar buscar todas as atividades para debug
      console.log('🔍 Tentando buscar todas as atividades primeiro...');
      const { data: allData, error: allError } = await supabase
        .from('activities')
        .select('*')
        .limit(5);
      
      if (allError) {
        console.error('❌ Erro ao buscar todas as atividades:', allError);
      } else {
        console.log('✅ Todas as atividades (primeiras 5):', allData);
      }

      // Agora buscar atividades do usuário específico
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar atividades do usuário:', error);
        setError(error.message);
        return;
      }

      console.log('✅ Atividades carregadas do Supabase:', data);
      setActivities(data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Erro inesperado ao buscar atividades:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova atividade
  const createActivity = async (activityData: CreateActivityData): Promise<Activity | null> => {
    console.log('🔍 Iniciando criação de atividade:', activityData);
    
    if (!user) {
      console.error('❌ Usuário não autenticado');
      setError('Usuário não autenticado');
      return null;
    }

    try {
      setError(null);
      console.log('👤 Usuário autenticado:', user.id);

      // Preparar dados para inserção
      const newActivity = {
        title: activityData.title,
        description: activityData.description,
        type: activityData.type,
        status: activityData.status || 'pending',
        priority: activityData.priority,
        due_date: activityData.due_date,
        assigned_to: activityData.responsible_id || user.id,
        user_id: user.id,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Dados da atividade preparados:', newActivity);

      // Inserir no Supabase
      console.log('🚀 Inserindo no Supabase...');
      const { data, error } = await supabase
        .from('activities')
        .insert([newActivity])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar atividade no Supabase:', error);
        setError(error.message);
        return null;
      }

      console.log('✅ Atividade criada no Supabase:', data);
      
      // Atualizar estado local
      setActivities(prev => [data, ...prev]);
      console.log('✅ Estado local atualizado');
      
      return data;
    } catch (err) {
      console.error('❌ Erro inesperado ao criar atividade:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado');
      return null;
    }
  };

  // Atualizar atividade
  const updateActivity = async (id: string, updates: Partial<CreateActivityData>): Promise<Activity | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      setError(null);

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar atividade:', error);
        setError(error.message);
        return null;
      }

      console.log('Atividade atualizada no Supabase:', data);
      
      // Atualizar estado local
      setActivities(prev => 
        prev.map(activity => 
          activity.id === id ? data : activity
        )
      );
      
      return data;
    } catch (err) {
      console.error('Erro inesperado ao atualizar atividade:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado');
      return null;
    }
  };

  // Excluir atividade
  const deleteActivity = async (id: string): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir atividade:', error);
        setError(error.message);
        return false;
      }

      console.log('Atividade excluída do Supabase:', id);
      
      // Atualizar estado local
      setActivities(prev => prev.filter(activity => activity.id !== id));
      
      return true;
    } catch (err) {
      console.error('Erro inesperado ao excluir atividade:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado');
      return false;
    }
  };

  // Carregar atividades na inicialização e quando a autenticação mudar
  useEffect(() => {
    console.log('🔄 useEffect executado - user:', user?.id);
    if (user) {
      fetchActivities();
    } else {
      console.log('👤 Usuário não autenticado, limpando atividades');
      setActivities([]);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities
  };
};
