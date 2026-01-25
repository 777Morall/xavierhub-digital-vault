import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Merchant,
  getAdminToken,
  getStoredMerchant,
  adminVerify,
  adminLogout,
  removeAdminToken,
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
    const token = getAdminToken();
    
    if (!token) {
      setMerchant(null);
      setIsLoading(false);
      return;
    }

    try {
      const result = await adminVerify();
      if (result.success) {
        const storedMerchant = getStoredMerchant();
        setMerchant(storedMerchant);
      } else {
        removeAdminToken();
        setMerchant(null);
      }
    } catch {
      removeAdminToken();
      setMerchant(null);
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
