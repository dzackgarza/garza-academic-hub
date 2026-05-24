import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/teaching', name: 'teaching' },
  { path: '/activities', name: 'activities' },
  { path: '/blog', name: 'blog' },
  { path: '/writing', name: 'writing' },
  { path: '/gallery', name: 'gallery' },
];

test.describe('Visual Regression Tests', () => {
  ROUTES.forEach((route) => {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  });
});
