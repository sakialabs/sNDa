export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  ENDPOINTS: {
    LOGIN: '/api/token/',
    REFRESH: '/api/token/refresh/',
  },
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'snda_access_token',
    REFRESH_TOKEN: 'snda_refresh_token',
    USER: 'snda_user'
  }
} as const;