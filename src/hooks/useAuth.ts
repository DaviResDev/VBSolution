import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const auth = useAuthContext();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema.",
      });

      return { data };
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });

      return { data };
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o cadastro.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });

      return { success: true };
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar o email.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    ...auth,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
} 