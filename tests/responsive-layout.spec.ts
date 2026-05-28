import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';
const testDir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.resolve(testDir, '../.generated/site-manifest.json'), 'utf8'),
) as { routes: Array<{ path: string }> };

const blogPosts = manifest.routes
  .filter((r) => r.path.startsWith('/blog/'))
  .slice(0, 2);

test.describe('Responsive layout: sidebar sticky', () => {
  blogPosts.forEach((route) => {
    test(`"${route.path}" sidebar is sticky at >=1024px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 600 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const card = page.locator('.academic-profile-card');
      await expect(card).toBeVisible();

      const position = await card.evaluate(
        (el) => window.getComputedStyle(el).position,
      );
      expect(position, 'sidebar should be sticky at >=1024px').toBe('sticky');
    });
  });
});

test.describe('Responsive layout: sidebar floats alongside content', () => {
  blogPosts.forEach((route) => {
    test(`"${route.path}" sidebar and page content side by side at >=1024px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const sidebar = page.locator('.academic-profile-card');
      const content = page.locator('.post-content, .academic-page-content');

      const sb = await sidebar.boundingBox();
      const cb = await content.boundingBox();

      expect(sb).toBeTruthy();
      expect(cb).toBeTruthy();

      if (sb && cb) {
        expect(
          sb.x + sb.width,
          'sidebar should end before content starts (side by side)',
        ).toBeLessThanOrEqual(cb.x + 20);
      }
    });
  });
});
