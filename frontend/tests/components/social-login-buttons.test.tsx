/**
 * OAuth Components Integration Tests
 * Tests for social login buttons and OAuth service
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SocialLoginButtons } from '@/components/social-login-buttons';
import { oauthService } from '@/lib/api/auth/oauth-service';

// Mock the OAuth service
vi.mock('@/lib/api/auth/oauth-service', () => ({
  oauthService: {
    signInWithGoogle: vi.fn(),
    signInWithFacebook: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
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

describe('SocialLoginButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders Google and Facebook login buttons', () => {
    render(<SocialLoginButtons />);
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
  });

  it('calls Google OAuth service when Google button is clicked', async () => {
    const mockGoogleResponse = {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
        is_coordinator: false,
        is_volunteer: true,
      },
    };

    vi.mocked(oauthService.signInWithGoogle).mockResolvedValue(mockGoogleResponse);

    render(<SocialLoginButtons />);
    
    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(oauthService.signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('calls Facebook OAuth service when Facebook button is clicked', async () => {
    const mockFacebookResponse = {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 2,
        username: 'fbuser',
        email: 'fbuser@example.com',
        first_name: 'Facebook',
        last_name: 'User',
        full_name: 'Facebook User',
        is_coordinator: false,
        is_volunteer: true,
      },
    };

    vi.mocked(oauthService.signInWithFacebook).mockResolvedValue(mockFacebookResponse);

    render(<SocialLoginButtons />);
    
    const facebookButton = screen.getByText('Continue with Facebook');
    fireEvent.click(facebookButton);

    await waitFor(() => {
      expect(oauthService.signInWithFacebook).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when OAuth is in progress', async () => {
    vi.mocked(oauthService.signInWithGoogle).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<SocialLoginButtons />);
    
    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('handles OAuth errors gracefully', async () => {
    vi.mocked(oauthService.signInWithGoogle).mockRejectedValue(
      new Error('OAuth authentication failed')
    );

    const onError = vi.fn();
    render(<SocialLoginButtons onError={onError} />);
    
    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('disables buttons when disabled prop is true', () => {
    render(<SocialLoginButtons disabled={true} />);
    
    const googleButton = screen.getByText('Continue with Google');
    const facebookButton = screen.getByText('Continue with Facebook');

    expect(googleButton).toBeDisabled();
    expect(facebookButton).toBeDisabled();
  });
});
