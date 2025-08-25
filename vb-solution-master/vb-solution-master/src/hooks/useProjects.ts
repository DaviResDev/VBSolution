import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  budget?: number;
  currency?: string;
  responsible_id?: string;
  company_id?: string;
  client_id?: string;
  tags?: string[];
  progress?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('responsible_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProjects(data || []);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar projetos');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const projectWithUser = {
        ...projectData,
        responsible_id: user.id,
        currency: projectData.currency || 'BRL',
        progress: projectData.progress || 0
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectWithUser])
        .select()
        .single();

      if (error) throw error;
      
      await fetchProjects(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchProjects(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar projeto');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProjects(); // Recarregar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir projeto');
      throw err;
    }
  };

  const getProjectsByStatus = (status: Project['status']) => {
    return projects.filter(project => project.status === status);
  };

  const getProjectsByPriority = (priority: Project['priority']) => {
    return projects.filter(project => project.priority === priority);
  };

  const getActiveProjects = () => {
    return projects.filter(project => project.status === 'active');
  };

  const getOverdueProjects = () => {
    const now = new Date();
    return projects.filter(project => 
      project.due_date && 
      project.status !== 'completed' && 
      new Date(project.due_date) < now
    );
  };

  const getProjectsByCompany = (companyId: string) => {
    return projects.filter(project => project.company_id === companyId);
  };

  const updateProjectProgress = async (id: string, progress: number) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ progress: Math.max(0, Math.min(100, progress)) })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchProjects(); // Recarregar dados
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar progresso do projeto');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getProjectsByPriority,
    getActiveProjects,
    getOverdueProjects,
    getProjectsByCompany,
    updateProjectProgress,
    refetch: fetchProjects
  };
};
