import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/enterprise/owner/dashboard' },
  { title: 'Usuários', icon: Users, path: '/enterprise/owner/users' },
  { title: 'Produtos', icon: Package, path: '/enterprise/owner/products' },
  { title: 'Compras', icon: ShoppingCart, path: '/enterprise/owner/compras' },
  { title: 'Transações', icon: CreditCard, path: '/enterprise/owner/transactions' },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { merchant, logout } = useAdminAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/enterprise/owner/dashboard') {
      return location.pathname === path || location.pathname === '/enterprise/owner';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="XavierHub" className="h-8 w-8 rounded-lg" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground">XavierHub</span>
              <span className="text-xs text-muted-foreground">Enterprise</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/enterprise/owner/dashboard'}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              'hover:bg-primary/10 hover:text-primary',
              isActive(item.path)
                ? 'bg-primary/20 text-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-border/50">
        {merchant && !collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-foreground truncate">{merchant.name}</p>
            <p className="text-xs text-muted-foreground truncate">{merchant.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={cn(
            'w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 h-full bg-card border-r border-border flex-col transition-all duration-300 z-40',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
        
        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </aside>

      {/* Spacer for main content */}
      <div className={cn('hidden lg:block shrink-0 transition-all duration-300', collapsed ? 'w-16' : 'w-64')} />
    </>
  );
}
