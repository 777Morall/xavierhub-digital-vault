import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Merchant,
  getStoredMerchant,
  adminVerify,
  adminLogout,
  clearSession,
  hasSession,
} from '@/lib/enterprise-api';

interface AdminAuthContextType {
  merchant: Merchant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAuth = async () => {
    try {
      const result = await adminVerify();
      if (result.authenticated) {
        // Get the updated merchant from cache
        const storedMerchant = getStoredMerchant();
        setMerchant(storedMerchant);
      } else {
        clearSession();
        setMerchant(null);
      }
    } catch (error) {
      console.warn('Session verification failed:', error);
      // Don't clear session on network errors - let user retry
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const logout = async () => {
    try {
      await adminLogout();
    } finally {
      setMerchant(null);
      navigate('/enterprise/owner/login');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        merchant,
        isAuthenticated: !!merchant,
        isLoading,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Protected route component
export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/enterprise/owner/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
