const API_URL = 'https://api.telas7.shop';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  balance: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  current_password?: string;
  password?: string;
}

// Registro
export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await res.json();
  
  if (!result.success) {
    const errorMsg = result.errors 
      ? Object.values(result.errors).join(', ')
      : result.message || 'Registration failed';
    throw new Error(errorMsg);
  }
  
  // Salvar token e user
  localStorage.setItem('token', result.data.token);
  localStorage.setItem('user', JSON.stringify(result.data.user));
  
  return result.data;
}

// Login
export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await res.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Invalid credentials');
  }
  
  // Salvar token e user
  localStorage.setItem('token', result.data.token);
  localStorage.setItem('user', JSON.stringify(result.data.user));
  
  return result.data;
}

// Logout
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Obter token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Obter usuário do localStorage
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Verificar se está autenticado
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Obter dados do usuário autenticado
export async function getMe(): Promise<User> {
  const token = getToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const res = await fetch(`${API_URL}/api/me.php`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await res.json();
  
  if (!result.success) {
    if (res.status === 401) {
      logout();
    }
    throw new Error(result.message || 'Failed to get user');
  }
  
  // Atualizar localStorage
  localStorage.setItem('user', JSON.stringify(result.data));
  
  return result.data;
}

// Atualizar perfil
export async function updateProfile(data: UpdateProfileData): Promise<User> {
  const token = getToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const res = await fetch(`${API_URL}/api/update-profile.php`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  const result = await res.json();
  
  if (!result.success) {
    const errorMsg = result.errors 
      ? Object.values(result.errors).join(', ')
      : result.message || 'Update failed';
    throw new Error(errorMsg);
  }
  
  // Atualizar localStorage
  localStorage.setItem('user', JSON.stringify(result.data));
  
  return result.data;
}

// Requisição autenticada (helper)
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401) {
    logout();
    throw new Error('Session expired');
  }
  
  return res;
}
