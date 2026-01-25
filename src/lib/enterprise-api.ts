// Enterprise Admin API Client
const ENTERPRISE_API_URL = 'https://api.xavierhub.com/enterprise';

// Types
export interface AdminUser {
  merchant_id: number;
  email: string;
  is_admin: number;
}

export interface Merchant {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  merchant: Merchant;
  error?: string;
}

export interface DashboardStats {
  total_vendas: number;
  receita_total: number;
  total_usuarios: number;
  total_produtos: number;
  vendas_pendentes: number;
  receita_mes: number;
  vendas_mes: number;
}

export interface VendaDiaria {
  data: string;
  vendas: number;
  receita: number;
}

export interface ProdutoMaisVendido {
  id: number;
  name: string;
  vendas: number;
  receita: number;
}

export interface UltimaTransacao {
  id: number;
  purchase_code: string;
  price_paid: number;
  payment_status: string;
  created_at: string;
  product_name: string;
  username: string;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  graficos: {
    vendas_diarias: VendaDiaria[];
    produtos_mais_vendidos: ProdutoMaisVendido[];
  };
  ultimas_transacoes: UltimaTransacao[];
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  balance: number;
  status: string;
  created_at: string;
  total_compras: number;
  total_gasto: number;
}

export interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  type: string;
  delivery_type: string;
  delivery_info?: string;
  access_duration?: string;
  total_vendas: number;
  receita_total: number;
  image_url?: string;
  created_at?: string;
}

export interface CompraData {
  id: number;
  user_id: number;
  product_id: number;
  purchase_code: string;
  license_key: string;
  price_paid: number;
  payment_status: string;
  status: string;
  created_at: string;
  username: string;
  email: string;
  product_name: string;
  domain?: string;
  domain_verified?: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Token management
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function removeAdminToken(): void {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_merchant');
}

export function getStoredMerchant(): Merchant | null {
  if (typeof window === 'undefined') return null;
  const merchant = localStorage.getItem('admin_merchant');
  return merchant ? JSON.parse(merchant) : null;
}

export function setStoredMerchant(merchant: Merchant): void {
  localStorage.setItem('admin_merchant', JSON.stringify(merchant));
}

// Authenticated fetch helper
async function enterpriseFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${ENTERPRISE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await res.json();
  
  if (res.status === 401) {
    removeAdminToken();
    window.location.href = '/enterprise/owner/login';
    throw new Error('Session expired');
  }
  
  return data;
}

// Auth endpoints
export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${ENTERPRISE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await res.json();
  
  if (data.success && data.token) {
    setAdminToken(data.token);
    setStoredMerchant(data.merchant);
  }
  
  return data;
}

export async function adminVerify(): Promise<{ success: boolean; user: AdminUser }> {
  return enterpriseFetch('/auth/verify');
}

export async function adminLogout(): Promise<void> {
  try {
    await enterpriseFetch('/auth/logout', { method: 'POST' });
  } finally {
    removeAdminToken();
  }
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardResponse> {
  return enterpriseFetch('/dashboard/stats');
}

// Users
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<UserData>> {
  const query = params ? new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';
  
  return enterpriseFetch(`/users${query ? `?${query}` : ''}`);
}

export async function getUserById(id: number): Promise<{
  success: boolean;
  data: UserData;
  compras: CompraData[];
}> {
  return enterpriseFetch(`/users/${id}`);
}

export async function updateUser(id: number, data: Partial<UserData>): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/users/${id}`, { method: 'DELETE' });
}

// Products
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<ProductData>> {
  const query = params ? new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';
  
  return enterpriseFetch(`/products${query ? `?${query}` : ''}`);
}

export async function getProductById(id: number): Promise<{ success: boolean; data: ProductData }> {
  return enterpriseFetch(`/products/${id}`);
}

export async function createProduct(data: Partial<ProductData>): Promise<{ success: boolean; message: string; id: number }> {
  return enterpriseFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<ProductData>): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/products/${id}`, { method: 'DELETE' });
}

// Compras
export async function getCompras(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<CompraData>> {
  const query = params ? new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';
  
  return enterpriseFetch(`/compras${query ? `?${query}` : ''}`);
}

export async function getCompraById(id: number): Promise<{ success: boolean; data: CompraData }> {
  return enterpriseFetch(`/compras/${id}`);
}

export async function updateCompra(id: number, data: Partial<CompraData>): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/compras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getComprasStats(): Promise<{
  success: boolean;
  stats: {
    por_status: { payment_status: string; total: number; valor_total: number }[];
    vendas_diarias: VendaDiaria[];
    metodos_pagamento: { method: string; total: number }[];
  };
}> {
  return enterpriseFetch('/compras/stats');
}

// Transactions
export async function getTransactions(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<CompraData>> {
  const query = params ? new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';
  
  return enterpriseFetch(`/transactions${query ? `?${query}` : ''}`);
}

export async function getTransactionById(id: number): Promise<{ success: boolean; data: CompraData }> {
  return enterpriseFetch(`/transactions/${id}`);
}

// Format helpers
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    expired: 'bg-red-500/20 text-red-400 border-red-500/30',
    cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[status] || colors.pending;
}
