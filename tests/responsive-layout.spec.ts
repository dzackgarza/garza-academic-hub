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
    test(`"${route.path}" profile card is sticky at >=1024px viewport`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1200, height: 600 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const card = page.locator('.academic-profile-card');
      await expect(card).toBeVisible();

      const position = await card.evaluate(
        (el) => window.getComputedStyle(el).position,
      );
      expect(position, 'profile card should be sticky at >=1024px').toBe('sticky');
    });
  });
});
