/**
 * Test utilities for sNDa Frontend
 * Provides custom render functions and mocks for consistent testing
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock messages for testing
const mockMessages = {
  nav: {
    about: 'About',
    community: 'Community',
    contact: 'Contact',
    donate: 'Donate',
    volunteer: 'Volunteer',
    wallOfLove: 'Wall of Love',
  },
  auth: {
    login: 'Login',
    joinUs: 'Join Us',
    logout: 'Logout',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
  },
  coordinator: {
    dashboard: 'Dashboard',
    totalCases: 'Total Cases',
    pendingCases: 'Pending Cases',
    resolvedCases: 'Resolved Cases',
    highUrgency: 'High Urgency',
    filterByStatus: 'Filter by Status',
    filterByUrgency: 'Filter by Urgency',
    searchCases: 'Search cases...',
    noCasesFound: 'No cases found',
  },
  volunteer: {
    hub: 'Volunteer Hub',
    myAssignments: 'My Assignments',
    createStory: 'Create Story',
    shareStory: 'Share Story',
    impact: 'Impact',
  },
  donor: {
    platform: 'Donor Platform',
    donate: 'Donate',
    campaign: 'Campaign',
    recurring: 'Recurring',
    oneTime: 'One Time',
  },
};

// Mock user data for testing
export const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  is_staff: false,
  is_active: true,
  date_joined: '2024-01-01T00:00:00Z',
};

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-user-id',
  username: 'admin',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  is_staff: true,
};

// Mock case data
export const mockCase = {
  id: 'case-123',
  title: 'Support for Test Family',
  description: 'Test case description',
  status: 'OPEN',
  priority: 'MEDIUM',
  urgency_score: 5,
  location: 'Test City',
  is_public: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  primary_subject: 'subject-123',
  assigned_volunteer: null,
};

// Mock API responses
export const mockApiResponses = {
  cases: [mockCase],
  user: mockUser,
  dashboard: {
    total_cases: 10,
    pending_cases: 5,
    resolved_cases: 3,
    high_urgency_cases: 2,
    active_assignments: 1,
    completed_assignments: 2,
    impact_score: 85,
    stories_published: 3,
    longest_streak: 7,
  },
  volunteers: [
    {
      id: 'vol-1',
      user: mockUser,
      skills: ['counseling', 'translation'],
      availability: 'weekends',
      location: 'Test City',
    },
  ],
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string;
  user?: typeof mockUser | null;
  authenticated?: boolean;
}

function AllTheProviders({ 
  children, 
  locale = 'en', 
  user = null, 
  authenticated = false 
}: { 
  children: React.ReactNode;
  locale?: string;
  user?: typeof mockUser | null;
  authenticated?: boolean;
}) {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  );
}

export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { locale, user, authenticated, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders 
        {...props} 
        locale={locale}
        user={user}
        authenticated={authenticated}
      />
    ),
    ...renderOptions,
  });
}

// Mock fetch for API calls
export function mockFetch(responses: Record<string, any>) {
  const originalFetch = global.fetch;
  
  global.fetch = vi.fn((url: string, options?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    
    // Match API endpoints
    for (const [endpoint, response] of Object.entries(responses)) {
      if (urlStr.includes(endpoint)) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(response),
          text: () => Promise.resolve(JSON.stringify(response)),
        } as Response);
      }
    }
    
    // Default 404 response
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ detail: 'Not found' }),
      text: () => Promise.resolve('Not found'),
    } as Response);
  });
  
  return () => {
    global.fetch = originalFetch;
  };
}

// Mock localStorage
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  const mockStorage = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });
  
  return mockStorage;
}

// Mock router
export function mockRouter(pathname = '/en') {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockBack = vi.fn();
  
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      pathname,
    }),
    usePathname: () => pathname,
    useSearchParams: () => new URLSearchParams(),
  }));
  
  return { mockPush, mockReplace, mockBack };
}

// Test data generators
export function generateMockCases(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ...mockCase,
    id: `case-${i + 1}`,
    title: `Test Case ${i + 1}`,
    urgency_score: Math.floor(Math.random() * 10) + 1,
    status: ['OPEN', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'][
      Math.floor(Math.random() * 5)
    ],
  }));
}

export function generateMockVolunteers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `vol-${i + 1}`,
    user: {
      ...mockUser,
      id: `user-${i + 1}`,
      username: `volunteer${i + 1}`,
      email: `volunteer${i + 1}@example.com`,
    },
    skills: ['counseling', 'translation', 'legal'][Math.floor(Math.random() * 3)],
    availability: ['weekdays', 'weekends', 'flexible'][Math.floor(Math.random() * 3)],
    location: `City ${i + 1}`,
  }));
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };