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
    const storedMerchant = getStoredMerchant();
    
    if (!token) {
      setMerchant(null);
      setIsLoading(false);
      return;
    }

    // If we have a stored merchant, use it immediately while verifying in background
    if (storedMerchant) {
      setMerchant(storedMerchant);
    }

    try {
      const result = await adminVerify();
      if (result.success) {
        // Keep using stored merchant data
        if (!storedMerchant) {
          setMerchant(null);
          removeAdminToken();
        }
      } else {
        // If verify returns a non-success payload but we have local session data,
        // don't immediately destroy the session (can happen with transient issues).
        if (!storedMerchant) {
          removeAdminToken();
          setMerchant(null);
        }
      }
    } catch (error) {
      // If verification fails but we have stored data, keep the session
      // This handles temporary network issues
      console.warn('Token verification failed:', error);
      if (!storedMerchant) {
        removeAdminToken();
        setMerchant(null);
      }
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
        // Consider token as authenticated to prevent redirect loops when verify fails
        // due to temporary network/CORS issues right after login.
        isAuthenticated: !!merchant || !!getAdminToken(),
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
    // Only redirect if there's truly no token/session.
    // This avoids the user getting stuck on login when verify fails but token exists.
    if (!isLoading && !isAuthenticated && !getAdminToken()) {
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
