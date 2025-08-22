import { API_CONFIG } from './config';
import type { ReferralInput } from './types';

export const referralsApi = {
  submit: async (data: ReferralInput) => {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/referrals/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit referral');
    }

    return response.json();
  }
};