// Configurações de performance para otimizar o sistema

// Configurações do React Query para melhor performance
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 1, // Reduzir tentativas de retry
      refetchOnWindowFocus: false, // Não refetch ao focar na janela
      refetchOnMount: false, // Não refetch ao montar componente
      refetchOnReconnect: false, // Não refetch ao reconectar
    },
    mutations: {
      retry: 1, // Reduzir tentativas de retry para mutations
    },
  },
};

// Configurações de debounce para inputs
export const debounceConfig = {
  delay: 300, // 300ms de delay para inputs
};

// Configurações de cache para dados estáticos
export const cacheConfig = {
  userProfile: 10 * 60 * 1000, // 10 minutos
  companyData: 15 * 60 * 1000, // 15 minutos
  activityData: 5 * 60 * 1000, // 5 minutos
  projectData: 10 * 60 * 1000, // 10 minutos
};

// Configurações de loading
export const loadingConfig = {
  minLoadingTime: 200, // Tempo mínimo de loading em ms
  maxLoadingTime: 2000, // Tempo máximo de loading em ms
};

// Configurações de lazy loading
export const lazyLoadingConfig = {
  preloadDistance: 100, // Distância em px para pré-carregar
  preloadDelay: 100, // Delay em ms para pré-carregar
};

// Função para otimizar imagens
export const optimizeImage = (url: string, width: number = 400) => {
  if (!url) return url;
  
  // Se for uma imagem do Supabase, otimizar
  if (url.includes('supabase.co')) {
    return `${url}?width=${width}&quality=80`;
  }
  
  return url;
};

// Função para debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Função para throttle
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Função para memoização simples
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Função para limpar cache
export const clearCache = () => {
  // Limpar cache do localStorage
  const keysToKeep = ['userLogo', 'showGreeting', 'sidebarPreferences'];
  const keysToRemove = Object.keys(localStorage).filter(
    key => !keysToKeep.includes(key)
  );
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Limpar sessionStorage
  sessionStorage.clear();
  
  console.log('Cache limpo com sucesso');
};

// Função para verificar performance
export const checkPerformance = () => {
  const performance = window.performance;
  
  if (performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      console.log('Performance Metrics:', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      });
    }
  }
};

// Função para otimizar scroll
export const optimizeScroll = (callback: () => void, delay: number = 16) => {
  let ticking = false;
  
  const update = () => {
    callback();
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };
  
  return requestTick;
};

// Configurações de performance para o sistema
export const systemPerformanceConfig = {
  // Reduzir re-renders desnecessários
  reduceRenders: true,
  
  // Usar React.memo para componentes pesados
  useMemo: true,
  
  // Usar useCallback para funções passadas como props
  useCallback: true,
  
  // Usar useMemo para cálculos pesados
  useMemoForHeavyCalculations: true,
  
  // Lazy loading para componentes pesados
  lazyLoadHeavyComponents: true,
  
  // Virtualização para listas longas
  virtualizeLongLists: true,
  
  // Debounce para inputs de busca
  debounceSearchInputs: true,
  
  // Cache para dados estáticos
  cacheStaticData: true,
  
  // Otimização de imagens
  optimizeImages: true,
  
  // Preload de rotas próximas
  preloadNearbyRoutes: true,
};
