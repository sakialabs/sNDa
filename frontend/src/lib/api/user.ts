import { API_CONFIG } from './config';

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'An error occurred'
    }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}