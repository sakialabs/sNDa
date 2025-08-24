"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { API_CONFIG } from "@/lib/api/config";
import { toast } from "sonner";
import type { User } from "@/lib/types";
import { useLocale } from "next-intl";

// Type for the decoded JWT payload
interface DecodedToken {
  exp: number;
  user_id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  async function readErrorMessage(response: Response): Promise<string> {
    try {
      const data = await response.json();
      // DRF typically returns { detail: string }
      if (data && typeof data === "object" && "detail" in data) {
        return (data as { detail?: string }).detail || "";
      }
      return JSON.stringify(data);
    } catch (_err) {
      try {
        const text = await response.text();
        return text || response.statusText;
      } catch {
        return response.statusText;
      }
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
    // Remove non-HttpOnly cookies set for middleware checks
    document.cookie = `${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=; Max-Age=0; path=/`;
    document.cookie = `${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=; Max-Age=0; path=/`;
    setUser(null);
    router.push(`/${locale}`);
  }, [router, locale]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);

      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.exp * 1000 > Date.now()) {
            // Token is valid, fetch fresh user data
            const response = await fetch(
              `${API_CONFIG.BASE_URL}/api/users/me/`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (!response.ok) {
              throw new Error(await readErrorMessage(response));
            }
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem(
              API_CONFIG.STORAGE_KEYS.USER,
              JSON.stringify(userData)
            );
          } else {
            logout(); // Token is expired
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (identifier: string, password: string) => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      }
    );

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new Error(message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, data.access);
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, data.refresh);
    // Also set simple cookies so Next middleware can read them on navigation
    // Non-HttpOnly and short-lived; for development routing only
    document.cookie = `${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=${data.access}; Max-Age=3600; path=/`;
    document.cookie = `${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=${data.refresh}; Max-Age=604800; path=/`;

    // After getting tokens, fetch user details
    const userResponse = await fetch(`${API_CONFIG.BASE_URL}/api/users/me/`, {
      headers: { Authorization: `Bearer ${data.access}` },
    });
    if (!userResponse.ok) {
      const message = await readErrorMessage(userResponse);
      throw new Error(message || "Failed to load user profile");
    }
    const userData = await userResponse.json();
    setUser(userData);
    localStorage.setItem(
      API_CONFIG.STORAGE_KEYS.USER,
      JSON.stringify(userData)
    );

    router.push(`/${locale}/dashboard`);
    toast.success("Logged in successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
