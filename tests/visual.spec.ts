import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'http://localhost:8080';
const testDir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.resolve(testDir, '../.generated/site-manifest.json'), 'utf8'),
) as { routes: Array<{ path: string; title: string }> };

const routes = manifest.routes;

test.describe('Site Integrity and Hydration Tests', () => {
  routes.forEach((route) => {
    test(`Route "${route.path}" should render without console/runtime errors and hydrations should succeed`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];

      // Listen to unhandled exceptions
      page.on('pageerror', (exception) => {
        consoleErrors.push(
          `[PAGE ERROR] ${exception.message}\nStack:\n${exception.stack}`,
        );
      });

      // Listen to console errors
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(`[CONSOLE ERROR] ${message.text()}`);
        }
      });

      // Go to page
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // 1. Assert that no runtime browser errors occurred
      expect(consoleErrors).toEqual([]);

      // 2. Assert that the page shell was successfully injected and contains the compiled article wrapper
      const pageWrapper = page.locator('.academic-page-content, .post-content');
      await expect(pageWrapper).toBeVisible();

      // 3. Assert actual page content renders (not just shell)
      await expect(pageWrapper).toContainText(route.title);

      // 4. Assert template-owned site chrome is present before any island behavior.
      await expect(page.locator('.academic-site-nav')).toBeVisible();
      await expect(page.locator('.academic-site-footer')).toContainText(
        'D. Zack Garza',
      );
      await expect(page.locator('.academic-site-nav')).toContainText('Teaching');

      if (route.path === '/') {
        await expect(page.locator('.academic-profile-card')).toContainText(
          'Mathematics, University of Georgia',
        );
      }

      // 5. For the home page, specifically assert content-declared slots were compiled into static cards.
      if (route.path === '/') {
        const cards = page.locator('.academic-card');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });
});
