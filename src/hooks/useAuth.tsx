import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, getStoredUser, getMe, isAuthenticated as checkAuth, logout as authLogout } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (checkAuth()) {
        const userData = await getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Primeiro carrega do localStorage
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Depois valida com o servidor
        if (checkAuth()) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
