import { API_CONFIG } from '../config';
import type { AuthResponse, User } from '../types';

class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    this.setUser(data.user);
    
    return data;
  }

  static async logout(): Promise<void> {
    try {
      const accessToken = this.getToken();
      if (accessToken) {
        await fetch(`${API_CONFIG.BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } finally {
      this.clearAuth();
    }
  }

  static setToken(token: string): void {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  static setUser(user: User): void {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const user = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  static clearAuth(): void {
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
  }
}

export default AuthService;