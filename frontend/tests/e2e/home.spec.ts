import { test, expect } from '@playwright/test';

// Smoke: root should redirect to /en and render home
(test as any).describe.configure({ mode: 'serial' });

test('redirects / to /en', async ({ page }) => {
  const res = await page.goto('/');
  // Next.js redirects to /en
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveURL(/\/en\/?$/);
});

test('localized home renders key sections', async ({ page }) => {
  await page.goto('/en');
  // Check presence of some nav links from header (about/community)
  await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /community/i })).toBeVisible();
});
