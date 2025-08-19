import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEmailService } from './useEmailService';

export interface CompanySettings {
  id?: string;
  company_id?: string;
  company_name: string;
  default_language: string;
  default_timezone: string;
  default_currency: string;
  datetime_format: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  enable_2fa: boolean;
  password_policy: {
    min_length: number;
    require_numbers: boolean;
    require_uppercase: boolean;
    require_special: boolean;
  };
}

export interface CompanyArea {
  id: string;
  name: string;
  description?: string;
  status: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  status: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  birth_date?: string;
  phone?: string;
  role_id?: string;
  area_id?: string;
  status: string;
  last_login?: string;
  last_login_ip?: string;
  invite_token?: string;
  invite_expires_at?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  password: string;
  birth_date?: string;
  phone?: string;
  role_id?: string;
  area_id?: string;
}

export function useCompanySettings() {
  const emailService = useEmailService();
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: '',
    default_language: 'pt-BR',
    default_timezone: 'America/Sao_Paulo',
    default_currency: 'BRL',
    datetime_format: 'DD/MM/YYYY HH:mm',
    primary_color: '#021529',
    secondary_color: '#ffffff',
    accent_color: '#3b82f6',
    enable_2fa: false,
    password_policy: {
      min_length: 8,
      require_numbers: true,
      require_uppercase: true,
      require_special: true,
    },
  });

  const [areas, setAreas] = useState<CompanyArea[]>([]);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para hash de senha (simples - em produção usar bcrypt)
  const hashPassword = (password: string): string => {
    return btoa(password); // Base64 encoding (simples para demo)
  };

  // Função para verificar senha
  const verifyPassword = (password: string, hash: string): boolean => {
    return hashPassword(password) === hash;
  };

  // Salvar configurações da empresa
  const saveCompanySettings = useCallback(async (newSettings: Partial<CompanySettings>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Garantir que todos os campos obrigatórios estejam presentes
      const settingsToSave = {
        company_name: newSettings.company_name || '',
        default_language: newSettings.default_language || 'pt-BR',
        default_timezone: newSettings.default_timezone || 'America/Sao_Paulo',
        default_currency: newSettings.default_currency || 'BRL',
        datetime_format: newSettings.datetime_format || 'DD/MM/YYYY HH:mm',
        primary_color: newSettings.primary_color || '#021529',
        secondary_color: newSettings.secondary_color || '#ffffff',
        accent_color: newSettings.accent_color || '#3b82f6',
        enable_2fa: newSettings.enable_2fa || false,
        password_policy: newSettings.password_policy || {
          min_length: 8,
          require_numbers: true,
          require_uppercase: true,
          require_special: true,
        },
        ...newSettings, // Sobrescrever com os valores fornecidos
        updated_at: new Date().toISOString(),
      };

      console.log('Salvando configurações:', settingsToSave);

      const { data, error } = await supabase
        .from('company_settings')
        .upsert(settingsToSave, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      if (data) {
        console.log('Configurações salvas com sucesso:', data);
        setSettings(prev => ({ 
          ...prev, 
          ...data,
          password_policy: (data.password_policy as CompanySettings['password_policy']) || prev.password_policy,
        }));
        return { success: true, data };
      } else {
        throw new Error('Nenhum dado retornado ao salvar configurações');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao salvar configurações';
      console.error('Erro ao salvar configurações:', err);
      setError(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar configurações da empresa
  const loadCompanySettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando configurações da empresa...');
      
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Nenhum registro encontrado, criar configurações padrão
          console.log('Nenhuma configuração encontrada, criando configurações padrão...');
          const defaultSettings = {
            company_name: 'Minha Empresa',
            default_language: 'pt-BR',
            default_timezone: 'America/Sao_Paulo',
            default_currency: 'BRL',
            datetime_format: 'DD/MM/YYYY HH:mm',
            primary_color: '#021529',
            secondary_color: '#ffffff',
            accent_color: '#3b82f6',
            enable_2fa: false,
            password_policy: {
              min_length: 8,
              require_numbers: true,
              require_uppercase: true,
              require_special: true,
            },
          };
          
          const result = await saveCompanySettings(defaultSettings);
          if (result.success) {
            console.log('Configurações padrão criadas com sucesso');
          } else {
            console.error('Falha ao criar configurações padrão:', result.error);
          }
        } else {
          console.error('Erro ao carregar configurações:', error);
          throw error;
        }
      } else if (data) {
        console.log('Configurações carregadas:', data);
        setSettings(prev => ({
          ...prev,
          ...data,
          password_policy: (data.password_policy as CompanySettings['password_policy']) || prev.password_policy,
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configurações';
      console.error('Erro ao carregar configurações:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [saveCompanySettings]);

  // Carregar áreas da empresa
  const loadAreas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('company_areas')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setAreas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar áreas');
    }
  }, []);

  // Adicionar área
  const addArea = useCallback(async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('company_areas')
        .insert({
          name,
          description,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar estado local
      setAreas(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar área');
      return { success: false, error: err };
    }
  }, []);

  // Editar área
  const editArea = useCallback(async (id: string, updates: Partial<CompanyArea>) => {
    try {
      const { data, error } = await supabase
        .from('company_areas')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar estado local
      setAreas(prev => prev.map(area => area.id === id ? data : area));
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar área');
      return { success: false, error: err };
    }
  }, []);

  // Excluir área
  const deleteArea = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_areas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar estado local
      setAreas(prev => prev.filter(area => area.id !== id));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir área');
      return { success: false, error: err };
    }
  }, []);

  // Carregar cargos
  const loadRoles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('company_roles')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      
      const rolesWithPermissions = (data || []).map(role => ({
        ...role,
        permissions: (role.permissions as Record<string, boolean>) || {},
      }));
      
      setRoles(rolesWithPermissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cargos');
    }
  }, []);

  // Adicionar cargo
  const addRole = useCallback(async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('company_roles')
        .insert({
          name,
          description,
          status: 'active',
          permissions: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      const newRole = {
        ...data,
        permissions: (data.permissions as Record<string, boolean>) || {},
      };
      
      // Atualizar estado local
      setRoles(prev => [...prev, newRole]);
      return { success: true, data: newRole };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cargo');
      return { success: false, error: err };
    }
  }, []);

  // Editar cargo
  const editRole = useCallback(async (id: string, updates: Partial<CompanyRole>) => {
    try {
      const { data, error } = await supabase
        .from('company_roles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedRole = {
        ...data,
        permissions: (data.permissions as Record<string, boolean>) || {},
      };
      
      // Atualizar estado local
      setRoles(prev => prev.map(role => role.id === id ? updatedRole : role));
      return { success: true, data: updatedRole };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar cargo');
      return { success: false, error: err };
    }
  }, []);

  // Excluir cargo
  const deleteRole = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar estado local
      setRoles(prev => prev.filter(role => role.id !== id));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir cargo');
      return { success: false, error: err };
    }
  }, []);

  // Salvar permissões do cargo
  const saveRolePermissions = useCallback(async (roleId: string, permissions: Record<string, boolean>) => {
    try {
      const { error } = await supabase
        .from('company_roles')
        .update({ 
          permissions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', roleId);

      if (error) throw error;

      // Atualizar estado local
      setRoles(prev => prev.map(role => 
        role.id === roleId ? { ...role, permissions } : role
      ));

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar permissões');
      return { success: false, error: err };
    }
  }, []);

  // Carregar usuários
  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          *,
          company_roles(name),
          company_areas(name)
        `)
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    }
  }, []);

  // Adicionar usuário
  const addUser = useCallback(async (userData: CreateUserData) => {
    try {
      // Gerar token de convite
      const inviteToken = emailService.generateInviteToken();
      
      // Criar usuário com status pendente
      const { data, error } = await supabase
        .from('company_users')
        .insert({
          ...userData,
          password_hash: hashPassword(userData.password),
          status: 'pending',
          invite_token: inviteToken,
          invite_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar e-mail de convite
      const roleName = roles.find(r => r.id === userData.role_id)?.name;
      const areaName = areas.find(a => a.id === userData.area_id)?.name;
      
      const inviteUrl = emailService.generateInviteUrl(userData.email, inviteToken);
      
      const emailResult = await emailService.sendInviteEmail({
        email: userData.email,
        fullName: userData.full_name,
        companyName: settings.company_name || 'Nossa Empresa',
        inviteUrl,
        roleName,
        areaName,
      });

      if (!emailResult.success) {
        console.warn('Usuário criado mas falha ao enviar e-mail:', emailResult.error);
      }

      // Atualizar estado local
      setUsers(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar usuário');
      return { success: false, error: err };
    }
  }, [emailService, roles, areas, settings.company_name]);

  // Editar usuário
  const editUser = useCallback(async (id: string, updates: Partial<CompanyUser>) => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar estado local
      setUsers(prev => prev.map(user => user.id === id ? data : user));
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar usuário');
      return { success: false, error: err };
    }
  }, []);

  // Excluir usuário
  const deleteUser = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar estado local
      setUsers(prev => prev.filter(user => user.id !== id));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
      return { success: false, error: err };
    }
  }, []);

  // Alterar status do usuário
  const updateUserStatus = useCallback(async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar estado local
      setUsers(prev => prev.map(user => user.id === id ? data : user));
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status do usuário');
      return { success: false, error: err };
    }
  }, []);

  // Redefinir senha do usuário
  const resetUserPassword = useCallback(async (id: string, newPassword: string) => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .update({ 
          password_hash: hashPassword(newPassword),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar estado local
      setUsers(prev => prev.map(user => user.id === id ? data : user));
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
      return { success: false, error: err };
    }
  }, []);

  // Atualizar logo da empresa
  const updateLogo = useCallback(async (logoUrl: string) => {
    try {
      const result = await saveCompanySettings({ logo_url: logoUrl });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar logo');
      return { success: false, error: err };
    }
  }, [saveCompanySettings]);

  // Remover logo da empresa
  const removeLogo = useCallback(async () => {
    try {
      const result = await saveCompanySettings({ logo_url: null });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover logo');
      return { success: false, error: err };
    }
  }, [saveCompanySettings]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadCompanySettings(),
        loadAreas(),
        loadRoles(),
        loadUsers(),
      ]);
    };

    loadInitialData();
  }, [loadCompanySettings, loadAreas, loadRoles, loadUsers]);

  return {
    settings,
    areas,
    roles,
    users,
    loading,
    error,
    saveCompanySettings,
    addArea,
    editArea,
    deleteArea,
    addRole,
    editRole,
    deleteRole,
    saveRolePermissions,
    addUser,
    editUser,
    deleteUser,
    updateUserStatus,
    resetUserPassword,
    updateLogo,
    removeLogo,
    verifyPassword,
    loadCompanySettings,
    loadAreas,
    loadRoles,
    loadUsers,
  };
}
