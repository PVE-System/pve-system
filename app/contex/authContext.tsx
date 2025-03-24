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
  id: string;
  token: string;
  role: string; // Adicionando a role do usuário
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');
    const role = Cookies.get('role'); // Captura a role do usuário

    if (token && userId && role) {
      setUser({ id: userId, token, role });
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    Cookies.set('token', user.token, { path: '/' });
    Cookies.set('userId', user.id, { path: '/' });
    Cookies.set('role', user.role, { path: '/' }); // Salva a role do usuário no cookie

    setUser(user);
    setLoading(false);
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
        // Remove os cookies
        Cookies.remove('token');
        Cookies.remove('userId');
        Cookies.remove('role');

        // Atualiza o estado do usuário
        setUser(null);

        // Redireciona para a página de login
        router.replace('/'); // Usamos replace para evitar adicionar uma nova entrada ao histórico
      } else {
        console.error('Erro ao fazer logout:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
