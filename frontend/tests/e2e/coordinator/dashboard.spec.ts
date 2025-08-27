/**
 * Coordinator Dashboard E2E Tests
 * End-to-end testing of coordinator dashboard functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Coordinator Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/cases/', async route => {
      await route.fulfill({
        json: [
          {
            id: 'case-1',
            title: 'Support for Family A',
            status: 'OPEN',
            urgency_score: 8,
            location: 'City A',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 'case-2', 
            title: 'Help for Family B',
            status: 'TRIAGED',
            urgency_score: 5,
            location: 'City B',
            created_at: '2024-01-16T10:00:00Z'
          }
        ]
      });
    });

    await page.route('**/api/dashboard/', async route => {
      await route.fulfill({
        json: {
          total_cases: 25,
          pending_cases: 12,
          resolved_cases: 8,
          high_urgency_cases: 5
        }
      });
    });

    // Navigate to coordinator dashboard
    await page.goto('/en/coordinator');
  });

  test('should display overview cards with correct data', async ({ page }) => {
    await expect(page.getByText('Total Cases')).toBeVisible();
    await expect(page.getByText('25')).toBeVisible();
    await expect(page.getByText('Pending Cases')).toBeVisible();
    await expect(page.getByText('12')).toBeVisible();
  });

  test('should filter cases by status', async ({ page }) => {
    await page.selectOption('[data-testid="status-filter"]', 'OPEN');
    await expect(page.getByText('Support for Family A')).toBeVisible();
    await expect(page.getByText('Help for Family B')).not.toBeVisible();
  });

  test('should search cases', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Family A');
    await expect(page.getByText('Support for Family A')).toBeVisible();
    await expect(page.getByText('Help for Family B')).not.toBeVisible();
  });
});