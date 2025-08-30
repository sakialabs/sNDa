/**
 * OAuth service for handling Google and Facebook authentication
 */

import { API_CONFIG } from '../config';

export interface OAuthConfig {
  google: {
    client_id: string;
    redirect_uri: string;
  };
  facebook: {
    app_id: string;
    redirect_uri: string;
  };
}

export interface OAuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar?: string;
    provider?: string;
    is_coordinator: boolean;
    is_volunteer: boolean;
  };
}

interface GoogleOAuthResponse {
  code?: string;
  error?: string;
  error_description?: string;
}

interface FacebookLoginResponse {
  authResponse?: {
    accessToken: string;
    code?: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  };
  status: string;
}

interface SocialAccount {
  id: number;
  provider: string;
  uid: string;
  last_login: string;
  date_joined: string;
}

class OAuthService {
  private oauthConfig: OAuthConfig | null = null;

  /**
   * Get OAuth configuration from backend
   */
  async getOAuthConfig(): Promise<OAuthConfig> {
    if (this.oauthConfig) {
      return this.oauthConfig;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/config/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch OAuth configuration`);
      }
      
      this.oauthConfig = await response.json();
      return this.oauthConfig!;
    } catch (error) {
      console.warn('Backend OAuth config unavailable, using fallback configuration:', error);
      
      // Fallback configuration when backend is not available
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
      
      this.oauthConfig = {
        google: {
          client_id: googleClientId,
          redirect_uri: `${window.location.origin}/auth/google/callback`
        },
        facebook: {
          app_id: facebookAppId,
          redirect_uri: `${window.location.origin}/auth/facebook/callback`
        }
      };
      
      // If neither backend nor environment variables are available, return empty config
      // but don't throw error - let the UI handle it gracefully
      if (!googleClientId && !facebookAppId) {
        console.info('OAuth providers not configured. Please set up backend or environment variables to enable social authentication.');
      }
      
      return this.oauthConfig;
    }
  }

  /**
   * Initialize Google OAuth
   */
  async initializeGoogleOAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialize Facebook SDK
   */
  async initializeFacebookSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined') {
        // Load Facebook SDK
        if (!window.FB) {
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/sdk.js';
          script.async = true;
          script.defer = true;
          script.onload = async () => {
            try {
              const config = await this.getOAuthConfig();
              window.FB.init({
                appId: config.facebook.app_id,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          script.onerror = () => reject(new Error('Failed to load Facebook SDK'));
          document.head.appendChild(script);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<OAuthResponse> {
    try {
      const config = await this.getOAuthConfig();
      
      // Check if Google OAuth is configured
      if (!config.google.client_id) {
        throw new Error('Google OAuth is not configured. Please set up your Google Client ID in the backend or environment variables.');
      }
      
      await this.initializeGoogleOAuth();

      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.google) {
          window.google.accounts.oauth2.initCodeClient({
            client_id: config.google.client_id,
            scope: 'openid email profile',
            ux_mode: 'popup',
            callback: async (response: GoogleOAuthResponse) => {
              try {
                if (response.error) {
                  throw new Error(`Google OAuth error: ${response.error}`);
                }

                // Send authorization code to backend
                const authResponse = await fetch(
                  `${API_CONFIG.BASE_URL}/api/auth/google/callback/`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      code: response.code,
                    }),
                  }
                );

                if (!authResponse.ok) {
                  const error = await authResponse.json();
                  throw new Error(error.detail || 'Google authentication failed');
                }

                const authData: OAuthResponse = await authResponse.json();
                resolve(authData);
              } catch (error) {
                reject(error);
              }
            },
          }).requestCode();
        } else {
          reject(new Error('Google OAuth not initialized'));
        }
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<OAuthResponse> {
    try {
      const config = await this.getOAuthConfig();
      
      // Check if Facebook OAuth is configured
      if (!config.facebook.app_id) {
        throw new Error('Facebook OAuth is not configured. Please set up your Facebook App ID in the backend or environment variables.');
      }
      
      await this.initializeFacebookSDK();

      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.FB) {
          window.FB.login(async (response: FacebookLoginResponse) => {
            try {
              if (response.authResponse) {
                // Send authorization code to backend
                const authResponse = await fetch(
                  `${API_CONFIG.BASE_URL}/api/auth/facebook/callback/`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      code: response.authResponse.code || response.authResponse.accessToken,
                    }),
                  }
                );

                if (!authResponse.ok) {
                  const error = await authResponse.json();
                  throw new Error(error.error || 'Facebook authentication failed');
                }

                const authData: OAuthResponse = await authResponse.json();
                resolve(authData);
              } else {
                reject(new Error('Facebook login cancelled'));
              }
            } catch (error) {
              reject(error);
            }
          }, { scope: 'email,public_profile' });
        } else {
          reject(new Error('Facebook SDK not initialized'));
        }
      });
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      throw error;
    }
  }

  /**
   * Get user's connected social accounts
   */
  async getUserSocialAccounts(): Promise<SocialAccount[]> {
    try {
      const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/social-accounts/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch social accounts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching social accounts:', error);
      throw error;
    }
  }

  /**
   * Disconnect a social account
   */
  async disconnectSocialAccount(provider: string): Promise<void> {
    try {
      const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/disconnect/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ provider }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to disconnect social account');
      }
    } catch (error) {
      console.error('Error disconnecting social account:', error);
      throw error;
    }
  }
}

export const oauthService = new OAuthService();

// Type declarations for global objects
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: string;
            callback: (response: GoogleOAuthResponse) => void;
          }) => {
            requestCode: () => void;
          };
        };
      };
    };
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options: { scope: string }
      ) => void;
    };
  }
}

