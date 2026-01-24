const API_URL = 'https://api.xavierhub.com';

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
  delivery_type: string;
  delivery_info?: string;
  access_duration?: string;
  slug: string;
  demo_url?: string;
  merchant_name?: string;
  merchant_email?: string;
  created_at: string;
  created_at_formatted?: string;
  updated_at?: string;
}

export interface PaymentData {
  transaction_id: string;
  purchase_code: string;
  qr_code: string;
  qr_code_base64: string;
  value: number;
  status: string;
  product: {
    id: number;
    name: string;
    type: string;
  };
}

export interface PaymentStatus {
  transaction_id: string;
  purchase_code: string;
  payment_status: 'pending' | 'paid' | 'cancelled' | 'expired' | 'refunded';
  status: string;
  product: {
    id: number;
    name: string;
    type: string;
  };
  price_paid: number;
  created_at: string;
  can_download: boolean;
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
  };
  price_paid: number;
  payment_status: string;
  status: string;
  download_count: number;
  max_downloads: number;
  can_download: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
  timestamp: string;
}

// Buscar produtos
export async function getProducts(params?: {
  id?: number;
  slug?: string;
  merchant_id?: number;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<{ products: Product[]; count: number }> {
  const query = params ? new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';
  
  const res = await fetch(`${API_URL}/api/products.php${query ? `?${query}` : ''}`);
  const data: ApiResponse<{ products: Product[]; count: number }> = await res.json();
  
  if (!data.success) throw new Error(data.message);
  return data.data;
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

// Criar pagamento PIX
export async function createPayment(productId: number, email: string): Promise<PaymentData> {
  const res = await fetch(`${API_URL}/api/create-payment.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, user_email: email })
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
export async function getUserPurchases(email: string): Promise<{ purchases: Purchase[]; count: number }> {
  const res = await fetch(`${API_URL}/api/user-purchases.php?email=${encodeURIComponent(email)}`);
  const data: ApiResponse<{ purchases: Purchase[]; count: number }> = await res.json();
  
  if (!data.success) throw new Error(data.message);
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
