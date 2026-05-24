import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const SCREENSHOT_DIR =
  process.env.SCREENSHOT_DIR ||
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'test-results',
    'screenshots',
  );

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/teaching', name: 'teaching' },
  { path: '/activities', name: 'activities' },
  { path: '/blog', name: 'blog' },
  { path: '/writing', name: 'writing' },
  { path: '/gallery', name: 'gallery' },
];

test.describe('Visual Verification Screenshots', () => {
  ROUTES.forEach((route) => {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/verify_${route.name}.png`,
        fullPage: false,
      });
    });
  });
});
