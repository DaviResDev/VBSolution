import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Wifi, Database, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: string;
  type?: 'connection' | 'data' | 'auth' | 'general';
  onRetry?: () => void;
  onGoHome?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  type = 'general', 
  onRetry, 
  onGoHome 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'connection':
        return <Wifi className="h-6 w-6" />;
      case 'data':
        return <Database className="h-6 w-6" />;
      case 'auth':
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'connection':
        return 'Problema de Conexão';
      case 'data':
        return 'Erro de Dados';
      case 'auth':
        return 'Erro de Autenticação';
      default:
        return 'Algo deu errado';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'connection':
        return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      case 'data':
        return 'Houve um problema ao carregar os dados. Tente novamente.';
      case 'auth':
        return 'Sua sessão expirou ou houve um problema de autenticação.';
      default:
        return 'Encontramos um erro inesperado. Por favor, tente novamente.';
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-red-600 dark:text-red-400">
            {getIcon()}
          </div>
          <CardTitle className="text-red-600 dark:text-red-400">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {getDescription()}
          </p>
          
          {error && (
            <details className="text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <summary className="cursor-pointer font-medium">
                Detalhes do erro
              </summary>
              <p className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                {error}
              </p>
            </details>
          )}

          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            )}
            
            {onGoHome && (
              <Button onClick={onGoHome} variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Ir para início
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;
