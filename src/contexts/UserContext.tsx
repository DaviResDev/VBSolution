import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem('userName');
    return saved || 'Davi';
  });

  const [userEmail, setUserEmail] = useState(() => {
    const saved = localStorage.getItem('userEmail');
    return saved || 'davi@exemplo.com';
  });

  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem('userAvatar');
    return saved || '';
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('userEmail', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('userAvatar', userAvatar);
  }, [userAvatar]);

  const value: UserContextType = {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    userAvatar,
    setUserAvatar,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
