/**
 * Social login buttons for Google and Facebook authentication
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { oauthService, type OAuthResponse } from "@/lib/api/auth/oauth-service";
import { API_CONFIG } from "@/lib/api/config";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface SocialLoginButtonsProps {
  onSuccess?: (response: OAuthResponse) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

export function SocialLoginButtons({
  onSuccess,
  onError,
  disabled = false,
  className = "",
}: SocialLoginButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  // FORCE RENDER FOR DEBUGGING
  console.log("🔍 SocialLoginButtons: Component is rendering!");
  
  // Simple test buttons first
  return (
    <div className={`space-y-3 ${className}`} style={{ border: '2px solid red', padding: '10px' }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        🚨 OAUTH BUTTONS DEBUG MODE - {new Date().toLocaleTimeString()}
      </p>
      
      <button 
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#4285F4', 
          color: 'white', 
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Google button clicked!')}
      >
        🚨 TEST: Continue with Google
      </button>
      
      <button 
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#1877F2', 
          color: 'white', 
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Facebook button clicked!')}
      >
        🚨 TEST: Continue with Facebook
      </button>
    </div>
  );

  // Original implementation (commented out for debugging)
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const response = await oauthService.signInWithGoogle();
      
      // Store tokens
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // Set cookies for middleware
      document.cookie = `${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=${response.access}; Max-Age=3600; path=/`;
      document.cookie = `${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=${response.refresh}; Max-Age=604800; path=/`;
      
      toast.success("Successfully signed in with Google!");
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(errorMessage);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setFacebookLoading(true);
      const response = await oauthService.signInWithFacebook();
      
      // Store tokens
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // Set cookies for middleware
      document.cookie = `${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=${response.access}; Max-Age=3600; path=/`;
      document.cookie = `${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=${response.refresh}; Max-Age=604800; path=/`;
      
      toast.success("Successfully signed in with Facebook!");
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Facebook sign-in failed";
      toast.error(errorMessage);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setFacebookLoading(false);
    }
  };

  const isLoading = googleLoading || facebookLoading;

  // Debug: Always render buttons for testing
  console.log('SocialLoginButtons rendering:', { disabled, isLoading });

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Debug indicator */}
      <div className="text-xs text-gray-500 mb-2">
        OAuth buttons are loaded (Debug: {new Date().toLocaleTimeString()})
      </div>
      
      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={disabled || isLoading}
        className="w-full h-12 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium transition-all duration-200 ease-in-out hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        ) : (
          <svg
            className="mr-3 h-5 w-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {googleLoading ? "Signing in..." : "Continue with Google"}
      </Button>

      {/* Facebook Sign In Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleFacebookLogin}
        disabled={disabled || isLoading}
        className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] border-[#1877F2] text-white font-medium transition-all duration-200 ease-in-out hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {facebookLoading ? (
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        ) : (
          <svg
            className="mr-3 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
        {facebookLoading ? "Signing in..." : "Continue with Facebook"}
      </Button>
    </div>
  );
}

export default SocialLoginButtons;
