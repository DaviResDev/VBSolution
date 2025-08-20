import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce, throttle } from '@/lib/performance';

interface UseOptimizedDataOptions<T> {
  initialData?: T;
  cacheKey?: string;
  cacheTime?: number;
  debounceDelay?: number;
  throttleDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setData: (data: T) => void;
  clearCache: () => void;
}

export function useOptimizedData<T>(
  fetchFunction: () => Promise<T>,
  options: UseOptimizedDataOptions<T> = {}
): UseOptimizedDataReturn<T> {
  const {
    initialData = null,
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 5 minutos padrão
    debounceDelay = 300,
    throttleDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Função para buscar dados com cache
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar cache primeiro
      if (cacheKey && cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        const now = Date.now();
        
        if (now - cached.timestamp < cacheTime) {
          setData(cached.data);
          setLoading(false);
          onSuccess?.(cached.data);
          return;
        }
      }

      // Cancelar requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Criar novo AbortController
      abortControllerRef.current = new AbortController();

      const result = await fetchFunction();
      
      // Verificar se foi cancelado
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setData(result);
      
      // Salvar no cache
      if (cacheKey) {
        cacheRef.current.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      onSuccess?.(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Ignorar erros de cancelamento
      }
      
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, cacheTime, onSuccess, onError]);

  // Função para refetch com debounce
  const debouncedRefetch = useCallback(
    debounce(fetchData, debounceDelay),
    [fetchData, debounceDelay]
  );

  // Função para refetch com throttle
  const throttledRefetch = useCallback(
    throttle(fetchData, throttleDelay),
    [fetchData, throttleDelay]
  );

  // Função para limpar cache
  const clearCache = useCallback(() => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
  }, [cacheKey]);

  // Função para refetch imediato
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Carregar dados iniciais
  useEffect(() => {
    if (!data && !loading) {
      fetchData();
    }
  }, [data, loading, fetchData]);

  // Limpar AbortController ao desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Função para atualizar dados manualmente
  const updateData = useCallback((newData: T) => {
    setData(newData);
    
    // Atualizar cache se existir
    if (cacheKey) {
      cacheRef.current.set(cacheKey, {
        data: newData,
        timestamp: Date.now(),
      });
    }
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    refetch,
    setData: updateData,
    clearCache,
    // Funções adicionais para diferentes tipos de refetch
    refetchDebounced: debouncedRefetch,
    refetchThrottled: throttledRefetch,
  };
}

// Hook para dados que precisam ser atualizados em intervalos
export function usePollingData<T>(
  fetchFunction: () => Promise<T>,
  interval: number = 30000, // 30 segundos padrão
  options: UseOptimizedDataOptions<T> = {}
) {
  const {
    initialData = null,
    cacheKey,
    cacheTime = 1 * 60 * 1000, // 1 minuto para dados em polling
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError | null] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, onSuccess, onError]);

  // Iniciar polling
  useEffect(() => {
    if (interval > 0) {
      // Carregar dados imediatamente
      fetchData();
      
      // Configurar intervalo
      intervalRef.current = setInterval(fetchData, interval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [fetchData, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!intervalRef.current && interval > 0) {
      fetchData();
      intervalRef.current = setInterval(fetchData, interval);
    }
  }, [fetchData, interval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    stopPolling,
    startPolling,
    isPolling: !!intervalRef.current,
  };
}

// Hook para dados que dependem de outros dados
export function useDependentData<T, D>(
  fetchFunction: (dependency: D) => Promise<T>,
  dependency: D,
  options: UseOptimizedDataOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dependencyRef = useRef<D>(dependency);

  const fetchData = useCallback(async () => {
    if (!dependency) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(dependency);
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, dependency, options]);

  // Atualizar dados quando a dependência mudar
  useEffect(() => {
    if (dependency !== dependencyRef.current) {
      dependencyRef.current = dependency;
      setData(null); // Limpar dados antigos
      fetchData();
    }
  }, [dependency, fetchData]);

  // Carregar dados iniciais
  useEffect(() => {
    if (dependency && !data && !loading) {
      fetchData();
    }
  }, [dependency, data, loading, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
}
