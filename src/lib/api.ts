const API_URL = 'https://api.telas7.shop';

export interface Product {
  id: number;
  merchant_id: number;
  name: string;
  description: string;
  file_path?: string;
  image_url?: string;
  image?: string;
  price: number;
  price_formatted?: string;
  status: string;
  type: string;
  delivery_type?: string;
  delivery_info?: string;
  access_duration?: string;
  slug?: string;
  custom_slug?: string;
  use_custom_slug?: boolean;
  demo_url?: string;
  demo_url_formatted?: string;
  custom_callback_url?: string | null;
  use_custom_callback?: boolean;
  merchant_name?: string;
  merchant_email?: string;
  created_at: string;
  created_at_formatted?: string;
  updated_at?: string;
  updated_at_formatted?: string;
}

// Parâmetros de busca de produtos
export interface ProductSearchParams {
  id?: number;
  slug?: string;
  merchant_id?: number;
  search?: string;
  name?: string;
  type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
  order_by?: 'id' | 'name' | 'price' | 'created_at' | 'updated_at';
  order_dir?: 'ASC' | 'DESC';
}

// Resposta de paginação
export interface ProductPagination {
  count: number;
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Resposta completa de listagem de produtos
export interface ProductListResponse {
  products: Product[];
  pagination: ProductPagination;
  filters: Record<string, unknown>;
  order: {
    by: string;
    direction: string;
  };
}

export interface PaymentData {
  transaction_id: string;
  purchase_code: string;
  qr_code: string;
  qr_code_base64: string;
  value: number;
  value_cents: number;
  status: string;
  webhook_url?: string;
  product: {
    id: number;
    name: string;
    type: string;
  };
}

export interface PaymentStatus {
  transaction_id: string;
  purchase_code: string;
  license_key: string;
  payment_status: 'pending' | 'paid' | 'cancelled' | 'expired' | 'refunded';
  status: string;
  qr_code: string | null;
  qr_code_base64: string | null;
  qr_code_expires_at?: string;
  qr_code_expired?: boolean;
  product: {
    id: number;
    name: string;
    type: string;
    image?: string;
  };
  price_paid: number;
  payment_method: string;
  download_count: number;
  max_downloads: number;
  can_download: boolean;
  access_expires_at: string | null;
  created_at: string;
  updated_at: string;
  last_api_check?: string;
}

export interface Purchase {
  id: number;
  purchase_code: string;
  license_key: string;
  transaction_id: string;
  product: {
    id: number;
    name: string;
    type: string;
    image?: string;
  };
  download?: {
    type: string;
    url: string;
    filename: string;
  };
  price_paid: number;
  payment_method: string;
  payment_status: string;
  status: string;
  download_count: number;
  max_downloads: number;
  can_download: boolean;
  access_expires_at?: string;
  last_download_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseUser {
  id: number;
  name: string;
  email: string;
}

export interface PurchasesResponse {
  purchases: Purchase[];
  count: number;
  user?: PurchaseUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
  timestamp?: string;
}

// Buscar produtos com filtros avançados
export async function getProducts(params?: ProductSearchParams): Promise<ProductListResponse> {
  const query = params ? new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';
  
  const res = await fetch(`${API_URL}/api/products.php${query ? `?${query}` : ''}`);
  const data: ApiResponse<ProductListResponse> = await res.json();
  
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// Alias simples para compatibilidade
export async function getProductsList(params?: ProductSearchParams): Promise<{ products: Product[]; count: number }> {
  const response = await getProducts(params);
  return {
    products: response.products,
    count: response.pagination.total
  };
}

// Buscar produto por ID ou slug
export async function getProduct(idOrSlug: string | number): Promise<Product | null> {
  const param = typeof idOrSlug === 'number' ? `id=${idOrSlug}` : `slug=${idOrSlug}`;
  const res = await fetch(`${API_URL}/api/products.php?${param}`);
  const data = await res.json();
  
  if (!data.success) return null;
  
  // API retorna produto direto em data (não em data.products) para busca por ID/slug
  return data.data.id ? data.data : null;
}

// Gerar UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Criar pagamento PIX
export async function createPayment(productId: number, email: string, transactionId?: string): Promise<PaymentData> {
  const txId = transactionId || generateUUID();
  
  const res = await fetch(`${API_URL}/api/create-payment.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      product_id: productId, 
      user_email: email,
      transaction_id: txId
    })
  });
  
  const data: ApiResponse<PaymentData> = await res.json();
  
  if (!data.success) {
    const errorMsg = data.errors 
      ? Object.values(data.errors).join(', ')
      : data.message;
    throw new Error(errorMsg);
  }
  
  return data.data;
}

// Verificar status do pagamento
export async function checkPayment(transactionId: string): Promise<PaymentStatus> {
  const res = await fetch(`${API_URL}/api/check-payment.php?transaction_id=${transactionId}`);
  const data: ApiResponse<PaymentStatus> = await res.json();
  
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// Buscar compras do usuário
export async function getUserPurchases(email: string): Promise<PurchasesResponse> {
  const res = await fetch(`${API_URL}/api/user-purchases.php?email=${encodeURIComponent(email)}`);
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.error || data.message || 'Erro ao buscar compras');
  }
  return data.data;
}

// Gerar URL de download
export function getDownloadUrl(purchaseCode: string): string {
  return `${API_URL}/api/download.php?purchase_code=${encodeURIComponent(purchaseCode)}`;
}

// Formatar preço
export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Mapear tipo de produto para label
export function getProductTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ebook: 'E-book',
    curso: 'Curso',
    software: 'Software',
    assinatura: 'Assinatura',
    outro: 'Outro'
  };
  return labels[type] || type;
}
