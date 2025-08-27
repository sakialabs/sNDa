/**
 * Authentication Context Tests
 * Comprehensive testing of auth flows, token management, and user state
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { mockUser, mockLocalStorage, mockFetch } from '../../utils/test-utils';
import { API_CONFIG } from '@/lib/api/config';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AuthContext', () => {
  let mockStorage: ReturnType<typeof mockLocalStorage>;
  let restoreFetch: () => void;

  beforeEach(() => {
    mockStorage = mockLocalStorage();
    vi.clearAllMocks();
  });

  afterEach(() => {
    restoreFetch?.();
    mockStorage.clear();
  });

  const renderAuthHook = () => {
    return renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
  };

  describe('Initial State', () => {
    it('should initialize with no user and loading state', () => {
      const { result } = renderAuthHook();

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(true);
    });

    it('should restore user from valid token', async () => {
      // Mock valid token
      const validToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjo5OTk5OTk5OTk5fQ.test';
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, validToken);

      restoreFetch = mockFetch({
        '/api/users/me/': mockUser,
      });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clear expired token', async () => {
      // Mock expired token
      const expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjoxfQ.test';
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, expiredToken);

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockStorage.removeItem).toHaveBeenCalledWith(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    });
  });

  describe('Login Flow', () => {
    it('should login successfully with valid credentials', async () => {
      const loginResponse = {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      };

      restoreFetch = mockFetch({
        '/api/token/': loginResponse,
        '/api/users/me/': mockUser,
      });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
        loginResponse.access
      );
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
        loginResponse.refresh
      );
      expect(mockPush).toHaveBeenCalledWith('/en/dashboard');
    });

    it('should handle login failure', async () => {
      restoreFetch = mockFetch({});
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Invalid credentials' }),
      });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login('testuser', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle user profile fetch failure after login', async () => {
      const loginResponse = {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      };

      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(loginResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ detail: 'Server error' }),
        });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login('testuser', 'password123');
        })
      ).rejects.toThrow('Server error');
    });
  });

  describe('Logout Flow', () => {
    it('should logout and clear all stored data', async () => {
      // Setup authenticated state
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, 'token');
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, 'refresh');
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(mockUser));

      const { result } = renderAuthHook();

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockStorage.removeItem).toHaveBeenCalledWith(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockStorage.removeItem).toHaveBeenCalledWith(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      expect(mockStorage.removeItem).toHaveBeenCalledWith(API_CONFIG.STORAGE_KEYS.USER);
      expect(mockPush).toHaveBeenCalledWith('/en');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed tokens', async () => {
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, 'invalid-token');

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle network errors during initialization', async () => {
      const validToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyIiwiZXhwIjo5OTk5OTk5OTk5fQ.test';
      mockStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, validToken);

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Token Management', () => {
    it('should set cookies for middleware access', async () => {
      const loginResponse = {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      };

      restoreFetch = mockFetch({
        '/api/token/': loginResponse,
        '/api/users/me/': mockUser,
      });

      // Mock document.cookie
      const mockCookieSetter = vi.fn();
      Object.defineProperty(document, 'cookie', {
        set: mockCookieSetter,
        configurable: true,
      });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(mockCookieSetter).toHaveBeenCalledWith(
        expect.stringContaining(`${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=${loginResponse.access}`)
      );
      expect(mockCookieSetter).toHaveBeenCalledWith(
        expect.stringContaining(`${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=${loginResponse.refresh}`)
      );
    });

    it('should clear cookies on logout', () => {
      const mockCookieSetter = vi.fn();
      Object.defineProperty(document, 'cookie', {
        set: mockCookieSetter,
        configurable: true,
      });

      const { result } = renderAuthHook();

      act(() => {
        result.current.logout();
      });

      expect(mockCookieSetter).toHaveBeenCalledWith(
        expect.stringContaining(`${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=; Max-Age=0`)
      );
      expect(mockCookieSetter).toHaveBeenCalledWith(
        expect.stringContaining(`${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=; Max-Age=0`)
      );
    });
  });

  describe('Hook Usage', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});