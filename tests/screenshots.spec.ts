import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// Routes derived from the generated site manifest — avoids hardcoded inventories.
const manifest = JSON.parse(
  readFileSync(resolve(process.cwd(), '.generated', 'site-manifest.json'), 'utf8'),
) as { routes: Array<{ path: string; title: string; type: string }> };

// Only snapshot page-type routes (not individual blog posts).
const ROUTES = manifest.routes
  .filter((r) => r.type === 'page')
  .map((r) => ({
    path: r.path,
    name: r.path === '/' ? 'home' : r.path.replace(/^\//, ''),
  }));

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
