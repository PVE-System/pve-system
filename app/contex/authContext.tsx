'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  id: string; // Adicione o campo id
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void; // Atualize para aceitar um objeto User
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId'); // Obtém o id do usuário do cookie
    console.log('AuthProvider useEffect Token:', token);
    console.log('AuthProvider useEffect User ID:', userId);
    if (token && userId) {
      setUser({ id: userId, token });
    }
  }, []);

  const login = (user: User) => {
    Cookies.set('token', user.token, { path: '/' });
    Cookies.set('userId', user.id, { path: '/' }); // Salva o id do usuário no cookie
    setUser(user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Cookies.remove('token');
        Cookies.remove('userId'); // Remove o id do usuário dos cookies
        setUser(null);
        router.push('/');
      } else {
        console.error('Erro ao fazer logout:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
