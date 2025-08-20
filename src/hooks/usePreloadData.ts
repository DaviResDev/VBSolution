import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Cache global para pré-carregamento
const preloadCache = new Map<string, { data: any; timestamp: number }>();

interface PreloadOptions {
  cacheTime?: number;
  priority?: 'high' | 'medium' | 'low';
}

// Hook para pré-carregar dados importantes
export function usePreloadData() {
  const preloadRef = useRef<{
    userProfile: boolean;
    notifications: boolean;
    messages: boolean;
    recentActivities: boolean;
    companies: boolean;
  }>({
    userProfile: false,
    notifications: false,
    messages: false,
    recentActivities: false,
    companies: false,
  });

  // Pré-carregar perfil do usuário
  const preloadUserProfile = async (userId: string, options: PreloadOptions = {}) => {
    const cacheKey = `user_profile_${userId}`;
    const { cacheTime = 5 * 60 * 1000 } = options;

    // Verificar cache
    if (preloadCache.has(cacheKey)) {
      const cached = preloadCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        preloadCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        return data;
      }
    } catch (err) {
      console.warn('Erro ao pré-carregar perfil:', err);
    }

    return null;
  };

  // Pré-carregar notificações
  const preloadNotifications = async (userId: string, options: PreloadOptions = {}) => {
    const cacheKey = `notifications_${userId}`;
    const { cacheTime = 2 * 60 * 1000 } = options;

    if (preloadCache.has(cacheKey)) {
      const cached = preloadCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        preloadCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        return data;
      }
    } catch (err) {
      console.warn('Erro ao pré-carregar notificações:', err);
    }

    return [];
  };

  // Pré-carregar mensagens
  const preloadMessages = async (userId: string, options: PreloadOptions = {}) => {
    const cacheKey = `messages_${userId}`;
    const { cacheTime = 2 * 60 * 1000 } = options;

    if (preloadCache.has(cacheKey)) {
      const cached = preloadCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        preloadCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        return data;
      }
    } catch (err) {
      console.warn('Erro ao pré-carregar mensagens:', err);
    }

    return [];
  };

  // Pré-carregar atividades recentes
  const preloadRecentActivities = async (options: PreloadOptions = {}) => {
    const cacheKey = 'recent_activities';
    const { cacheTime = 3 * 60 * 1000 } = options;

    if (preloadCache.has(cacheKey)) {
      const cached = preloadCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        preloadCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        return data;
      }
    } catch (err) {
      console.warn('Erro ao pré-carregar atividades:', err);
    }

    return [];
  };

  // Pré-carregar empresas
  const preloadCompanies = async (options: PreloadOptions = {}) => {
    const cacheKey = 'companies';
    const { cacheTime = 10 * 60 * 1000 } = options;

    if (preloadCache.has(cacheKey)) {
      const cached = preloadCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        preloadCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        return data;
      }
    } catch (err) {
      console.warn('Erro ao pré-carregar empresas:', err);
    }

    return [];
  };

  // Pré-carregar todos os dados importantes
  const preloadAllData = async (userId: string) => {
    if (!userId) return;

    const promises = [
      preloadUserProfile(userId, { priority: 'high' }),
      preloadNotifications(userId, { priority: 'high' }),
      preloadMessages(userId, { priority: 'high' }),
      preloadRecentActivities({ priority: 'medium' }),
      preloadCompanies({ priority: 'low' })
    ];

    try {
      await Promise.allSettled(promises);
      console.log('✅ Pré-carregamento de dados concluído');
    } catch (error) {
      console.warn('⚠️ Erro durante pré-carregamento:', error);
    }
  };

  // Limpar cache expirado
  const cleanupExpiredCache = () => {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutos

    for (const [key, value] of preloadCache.entries()) {
      if (now - value.timestamp > maxAge) {
        preloadCache.delete(key);
      }
    }
  };

  // Limpar cache específico
  const clearCache = (key?: string) => {
    if (key) {
      preloadCache.delete(key);
    } else {
      preloadCache.clear();
    }
  };

  // Limpar cache periodicamente
  useEffect(() => {
    const interval = setInterval(cleanupExpiredCache, 5 * 60 * 1000); // A cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  return {
    preloadUserProfile,
    preloadNotifications,
    preloadMessages,
    preloadRecentActivities,
    preloadCompanies,
    preloadAllData,
    clearCache,
    cleanupExpiredCache,
    cache: preloadCache
  };
}

// Hook para pré-carregar dados baseado na rota
export function useRoutePreload() {
  const { preloadAllData } = usePreloadData();

  useEffect(() => {
    // Pré-carregar dados quando a rota mudar
    const handleRouteChange = () => {
      // Aguardar um pouco para não bloquear a navegação
      setTimeout(() => {
        const user = supabase.auth.getUser();
        if (user) {
          preloadAllData(user.then(u => u.data.user?.id).catch(() => null));
        }
      }, 100);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [preloadAllData]);

  return { preloadAllData };
}

// Hook para pré-carregar dados em background
export function useBackgroundPreload() {
  const { preloadAllData } = usePreloadData();

  useEffect(() => {
    // Pré-carregar dados quando a página estiver ociosa
    let timeoutId: NodeJS.Timeout;

    const handleIdle = () => {
      timeoutId = setTimeout(async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.id) {
            preloadAllData(user.id);
          }
        } catch (error) {
          console.warn('Erro ao pré-carregar dados em background:', error);
        }
      }, 2000); // Aguardar 2 segundos de ociosidade
    };

    // Detectar quando a página está ociosa
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleIdle();
      } else {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Pré-carregar quando a página se tornar visível
    if (!document.hidden) {
      handleIdle();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, [preloadAllData]);

  return { preloadAllData };
}
