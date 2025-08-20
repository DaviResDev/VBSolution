import { useAuth } from '@/contexts/AuthContext';
import { useVB } from '@/contexts/VBContext';

export const useUserName = () => {
  const { user, profile, loading } = useAuth();
  const { state } = useVB();
  
  // Debug completo para identificar o problema
  console.log('🔍 useUserName - Debug completo:');
  console.log('🔍 loading:', loading);
  console.log('🔍 user:', user);
  console.log('🔍 profile:', profile);
  console.log('🔍 state.currentUser:', state.currentUser);
  console.log('🔍 user?.user_metadata:', user?.user_metadata);
  console.log('🔍 user?.email:', user?.email);
  
  // Debug adicional para verificar se o nome está sendo salvo
  if (user) {
    console.log('🔍 user.id:', user.id);
    console.log('🔍 user.email:', user.email);
    console.log('🔍 user.user_metadata:', user.user_metadata);
    console.log('🔍 user.user_metadata.full_name:', user.user_metadata?.full_name);
  }
  
  if (profile) {
    console.log('🔍 profile.id:', profile.id);
    console.log('🔍 profile.full_name:', profile.full_name);
    console.log('🔍 profile.email:', profile.email);
  }
  
  // Se ainda está carregando, retornar loading
  if (loading) {
    console.log('⏳ Ainda carregando, aguardando...');
    return {
      userName: 'Carregando...',
      user,
      profile,
      currentUser: state.currentUser,
      loading: true
    };
  }
  
  // Se não há usuário após o carregamento, pode ser um problema de autenticação
  if (!user && !loading) {
    console.log('❌ Nenhum usuário autenticado após carregamento');
    return {
      userName: 'Usuário',
      user: null,
      profile: null,
      currentUser: state.currentUser,
      loading: false
    };
  }
  
  // Função para obter o nome do usuário com prioridade
  const getUserName = () => {
    if (!user) {
      console.log('❌ Nenhum usuário autenticado');
      return 'Usuário';
    }
    
    // SOLUÇÃO DIRETA: Sempre extrair primeiro nome do email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Extrair apenas o primeiro nome (antes do primeiro ponto ou número)
      const firstName = emailName.split(/[0-9.]/)[0];
      const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      console.log('✅ Nome extraído do email:', capitalizedName);
      return capitalizedName;
    }
    
    // Fallback para outros casos
    if (profile?.full_name) {
      console.log('✅ Nome obtido do perfil Supabase:', profile.full_name);
      return profile.full_name;
    }
    
    if (user.user_metadata?.full_name) {
      console.log('✅ Nome obtido dos metadados:', user.user_metadata.full_name);
      return user.user_metadata.full_name;
    }
    
    if (state.currentUser?.name && state.currentUser.name !== 'Usuário') {
      console.log('✅ Nome obtido do contexto VB:', state.currentUser.name);
      return state.currentUser.name;
    }
    
    // Fallback final
    console.log('⚠️ Usando nome padrão: Usuário');
    return 'Usuário';
  };
  
  const userName = getUserName();
  console.log('🔍 useUserName - Nome final retornado:', userName);
  
  // SOLUÇÃO AGGRESSIVA: Se o nome ainda é "Usuário", forçar busca em todos os lugares
  if (userName === 'Usuário') {
    console.log('🚨 Nome ainda é "Usuário" - ATIVAÇÃO DE EMERGÊNCIA!');
    
    // Buscar em TODOS os lugares possíveis
    let emergencyName = null;
    
    // 1. Perfil Supabase
    if (profile?.full_name) {
      emergencyName = profile.full_name;
      console.log('🚨 Nome encontrado no perfil:', emergencyName);
    }
    // 2. Metadados do usuário
    else if (user?.user_metadata?.full_name) {
      emergencyName = user.user_metadata.full_name;
      console.log('🚨 Nome encontrado nos metadados:', emergencyName);
    }
    // 3. Contexto VB
    else if (state.currentUser?.name && state.currentUser.name !== 'Usuário') {
      emergencyName = state.currentUser.name;
      console.log('🚨 Nome encontrado no contexto VB:', emergencyName);
    }
    // 4. Email (último recurso)
    else if (user?.email) {
      const emailName = user.email.split('@')[0];
      emergencyName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      console.log('🚨 Nome extraído do email:', emergencyName);
    }
    
    if (emergencyName) {
      console.log('✅ NOME DE EMERGÊNCIA ATIVADO:', emergencyName);
      
      // Forçar atualização do contexto VB
      if (state.currentUser?.name !== emergencyName) {
        console.log('🔄 Forçando atualização do contexto VB...');
        // Disparar evento para atualizar outros componentes
        window.dispatchEvent(new CustomEvent('forceNameUpdate', {
          detail: { name: emergencyName }
        }));
      }
      
      return {
        userName: emergencyName,
        user,
        profile,
        currentUser: state.currentUser,
        loading: false
      };
    }
  }
  
  return {
    userName,
    user,
    profile,
    currentUser: state.currentUser,
    loading: false
  };
};
