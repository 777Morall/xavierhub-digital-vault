import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminAuthProvider, RequireAdminAuth } from '@/hooks/useAdminAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <div className="min-h-screen bg-background flex">
          <AdminSidebar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}
