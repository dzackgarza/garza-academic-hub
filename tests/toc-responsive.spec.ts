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

test.describe('TOC responsive visibility', () => {
  blogPosts.forEach((route) => {
    test(`"${route.path}" shows TOC inline below 1024px`, async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const tocAside = page.locator('.post-sidebar');
      await expect(tocAside).toBeAttached();
      await expect(tocAside).toBeVisible();

      // TOC must appear above the article body at narrow widths (legacy behavior)
      const articleBody = page.locator('.post-content');
      const tocBox = await tocAside.boundingBox();
      const articleBox = await articleBody.boundingBox();
      if (tocBox && articleBox) {
        expect(
          tocBox.y,
          'TOC should be positioned above article body at narrow widths',
        ).toBeLessThan(articleBox.y);
      }
    });

    test(`"${route.path}" shows TOC as sticky sidebar at >=1024px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const tocAside = page.locator('.post-sidebar');
      await expect(tocAside).toBeVisible();

      const position = await tocAside.evaluate(
        (el) => window.getComputedStyle(el).position,
      );
      expect(position).toBe('sticky');
    });
  });
});
