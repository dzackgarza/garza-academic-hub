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

      const tocAside = page.locator('.sidebar__right');
      await expect(tocAside).toBeAttached();
      await expect(tocAside).toBeVisible();

      // TOC should be positioned between header and body
      const headerEl = page.locator('.page__title');
      const firstBody = page
        .locator('.page__content > p, .page__content > h2, .page__content > h3')
        .first();
      const tocBox = await tocAside.boundingBox();
      const headerBox = await headerEl.boundingBox();
      const bodyBox = await firstBody.boundingBox();
      if (tocBox && headerBox && bodyBox) {
        expect(tocBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
        expect(tocBox.y + tocBox.height).toBeLessThanOrEqual(bodyBox.y);
      }
    });

    test(`"${route.path}" shows TOC as sticky sidebar at >=1024px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const tocAside = page.locator('.sidebar__right');
      await expect(tocAside).toBeVisible();

      const position = await tocAside.evaluate(
        (el) => window.getComputedStyle(el).position,
      );
      expect(position).toBe('sticky');
    });
  });
});
