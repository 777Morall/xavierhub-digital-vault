// Enterprise Admin API Client
const ENTERPRISE_API_URL = 'https://api.xavierhub.com/enterprise';

// Types
export interface AdminUser {
  merchant_id: number;
  email: string;
  is_admin: number;
  exp?: number;
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

// New dashboard types
export interface VendaPorPeriodo {
  data: string;
  quantidade: number;
  total: string;
  ticket_medio: string;
}

export interface VendasPeriodoResponse {
  success: boolean;
  periodo: string;
  vendas: VendaPorPeriodo[];
}

export interface ProdutoRanking {
  id: number;
  name: string;
  price: string;
  type: string;
  total_vendas: number;
  receita_total: string;
  ticket_medio: string;
  vendas_pagas: number;
  vendas_pendentes: number;
}

export interface RankingProdutosResponse {
  success: boolean;
  ranking: ProdutoRanking[];
}

export interface TopUsuario {
  id: number;
  username: string;
  email: string;
  cadastro_em: string;
  total_compras: number;
  total_gasto: string;
  ultima_compra: string;
}

export interface TopUsuariosResponse {
  success: boolean;
  top_usuarios: TopUsuario[];
}

export interface VendaPorDia {
  dia: number;
  vendas: number;
  receita: string;
}

export interface MetodoPagamento {
  payment_method: string;
  quantidade: number;
  total: string;
}

export interface RelatorioFinanceiroResponse {
  success: boolean;
  periodo: {
    mes: string;
    ano: string;
  };
  resumo: {
    total_transacoes: number;
    receita_confirmada: string;
    receita_pendente: string;
    ticket_medio: string;
    vendas_pagas: number;
    vendas_pendentes: number;
    vendas_canceladas: number;
  };
  vendas_por_dia: VendaPorDia[];
  por_metodo_pagamento: MetodoPagamento[];
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  balance: number;
  status: string;
  created_at: string;
  updated_at?: string;
  total_compras?: number;
  total_gasto?: number;
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
  slug?: string;
  total_vendas?: number;
  receita_total?: number;
  image_url?: string;
  created_at?: string;
}

export interface CompraData {
  id: number;
  user_id: number;
  product_id: number;
  transaction_id?: string;
  purchase_code: string;
  license_key: string;
  price_paid: number;
  payment_method?: string;
  payment_status: string;
  status?: string;
  download_count?: number;
  max_downloads?: number;
  created_at: string;
  updated_at?: string;
  username: string;
  user_email?: string;
  email?: string;
  product_name: string;
  domain?: string;
  domain_verified?: number;
  notes?: string;
  qr_code?: string;
  qr_code_base64?: string;
  product?: {
    name: string;
    type: string;
  };
  user?: {
    username: string;
    email: string;
  };
}

export interface PaginationData {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  users?: T[];
  products?: T[];
  compras?: T[];
  pagination: PaginationData;
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
    credentials: 'include',
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
  const res = await fetch(`${ENTERPRISE_API_URL}/auth.php?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  
  const data = await res.json();
  
  if (data.success && data.token) {
    setAdminToken(data.token);
    setStoredMerchant(data.merchant);
  }
  
  return data;
}

export async function adminVerify(): Promise<{ success: boolean; user: AdminUser; error?: string }> {
  return enterpriseFetch('/auth.php?action=verify');
}

export async function adminLogout(): Promise<void> {
  try {
    await enterpriseFetch('/auth.php?action=logout', { method: 'POST' });
  } finally {
    removeAdminToken();
  }
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardResponse> {
  return enterpriseFetch('/dashboard.php?action=stats');
}

export async function getVendasPorPeriodo(periodo: number = 30): Promise<VendasPeriodoResponse> {
  return enterpriseFetch(`/dashboard.php?action=vendas&periodo=${periodo}`);
}

export async function getRankingProdutos(limite: number = 10): Promise<RankingProdutosResponse> {
  return enterpriseFetch(`/dashboard.php?action=ranking_produtos&limite=${limite}`);
}

export async function getTopUsuarios(limite: number = 10): Promise<TopUsuariosResponse> {
  return enterpriseFetch(`/dashboard.php?action=top_usuarios&limite=${limite}`);
}

export async function getRelatorioFinanceiro(mes?: string, ano?: string): Promise<RelatorioFinanceiroResponse> {
  const params = new URLSearchParams({ action: 'relatorio_financeiro' });
  if (mes) params.set('mes', mes);
  if (ano) params.set('ano', ano);
  return enterpriseFetch(`/dashboard.php?${params.toString()}`);
}

// Users
export async function getUsers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<UserData>> {
  const queryParams = new URLSearchParams({ action: 'list' });
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });
  }
  
  return enterpriseFetch(`/users.php?${queryParams.toString()}`);
}

export async function getUserById(id: number): Promise<{
  success: boolean;
  user: UserData;
}> {
  return enterpriseFetch(`/users.php?action=get&id=${id}`);
}

export async function updateUser(id: number, data: Partial<UserData>): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch('/users.php?action=update', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteUser(id: number): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/users.php?action=delete&id=${id}`, { method: 'DELETE' });
}

// Products
export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<ProductData>> {
  const queryParams = new URLSearchParams({ action: 'list' });
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });
  }
  
  return enterpriseFetch(`/products.php?${queryParams.toString()}`);
}

export async function getProductById(id: number): Promise<{ success: boolean; product: ProductData }> {
  return enterpriseFetch(`/products.php?action=get&id=${id}`);
}

export async function createProduct(data: Partial<ProductData>): Promise<{ success: boolean; message: string; product_id: number }> {
  return enterpriseFetch('/products.php?action=create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<ProductData>): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch('/products.php?action=update', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch(`/products.php?action=delete&id=${id}`, { method: 'DELETE' });
}

// Compras
export async function getCompras(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  user_id?: number;
}): Promise<PaginatedResponse<CompraData>> {
  const queryParams = new URLSearchParams({ action: 'list' });
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, String(value));
    });
  }
  
  return enterpriseFetch(`/compras.php?${queryParams.toString()}`);
}

export async function getCompraById(id: number): Promise<{ success: boolean; compra: CompraData }> {
  return enterpriseFetch(`/compras.php?action=get&id=${id}`);
}

export async function updateCompra(id: number, data: Partial<CompraData>): Promise<{ success: boolean; message: string }> {
  return enterpriseFetch('/compras.php?action=update', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

// Transactions (alias for compras with different view)
export async function getTransactions(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<CompraData>> {
  return getCompras(params);
}

export async function getTransactionById(id: number): Promise<{ success: boolean; compra: CompraData }> {
  return getCompraById(id);
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

// Helper to extract data from paginated response (handles different field names)
export function extractPaginatedData<T>(response: PaginatedResponse<T>): T[] {
  return response.data || response.users || response.products || response.compras || [];
}
