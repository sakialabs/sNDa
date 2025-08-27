/**
 * Authentication E2E Tests
 * End-to-end testing of login/logout flows
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Mock login API
    await page.route('**/api/token/', async route => {
      await route.fulfill({
        json: {
          access: 'mock-access-token',
          refresh: 'mock-refresh-token'
        }
      });
    });

    await page.route('**/api/users/me/', async route => {
      await route.fulfill({
        json: {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User'
        }
      });
    });

    // Click login button
    await page.click('[data-login]');
    
    // Fill login form
    await page.fill('[name="identifier"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/en/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Mock failed login
    await page.route('**/api/token/', async route => {
      await route.fulfill({
        status: 401,
        json: { detail: 'Invalid credentials' }
      });
    });

    await page.click('[data-login]');
    await page.fill('[name="identifier"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('snda_access_token', 'mock-token');
      localStorage.setItem('snda_user', JSON.stringify({
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com'
      }));
    });

    await page.goto('/en/dashboard');
    
    // Click user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click logout
    await page.click('text=Log out');
    
    // Should redirect to home
    await expect(page).toHaveURL('/en');
    
    // Should clear localStorage
    const token = await page.evaluate(() => localStorage.getItem('snda_access_token'));
    expect(token).toBeNull();
  });
});