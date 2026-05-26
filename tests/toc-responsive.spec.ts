import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';
const testDir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.resolve(testDir, '../.generated/site-manifest.json'), 'utf8'),
) as { routes: Array<{ path: string }> };

const contentDir = path.resolve(testDir, '../content');

const blogPosts = manifest.routes
  .filter((r) => r.path.startsWith('/blog/'))
  .filter((r) => {
    const srcPath = path.join(contentDir, r.path + '.md');
    if (!existsSync(srcPath)) return false;
    const content = readFileSync(srcPath, 'utf8');
    return /^##\s/m.test(content);
  })
  .slice(0, 2);

test.describe('TOC responsive visibility', () => {
  blogPosts.forEach((route) => {
    test(`"${route.path}" TOC is visible between header and body at 800px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 800, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const toc = page.locator('nav.toc-card');
      await expect(toc).toBeVisible();

      const headerEl = page.locator('.post-header');
      const firstBody = page.locator('.post-content > h2, .post-content > p').first();
      const tocBox = await toc.boundingBox();
      const headerBox = await headerEl.boundingBox();
      const bodyBox = await firstBody.boundingBox();
      expect(tocBox).toBeTruthy();
      expect(headerBox).toBeTruthy();
      expect(bodyBox).toBeTruthy();
      if (tocBox && headerBox && bodyBox) {
        expect(tocBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 5);
        expect(tocBox.y + tocBox.height).toBeLessThanOrEqual(bodyBox.y + 5);
      }
    });

    test(`"${route.path}" TOC is visible between header and body at 1200px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const toc = page.locator('nav.toc-card');
      await expect(toc).toBeVisible();

      const headerEl = page.locator('.post-header');
      const firstBody = page.locator('.post-content > h2, .post-content > p').first();
      const tocBox = await toc.boundingBox();
      const headerBox = await headerEl.boundingBox();
      const bodyBox = await firstBody.boundingBox();
      expect(tocBox).toBeTruthy();
      expect(headerBox).toBeTruthy();
      expect(bodyBox).toBeTruthy();
      if (tocBox && headerBox && bodyBox) {
        expect(tocBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 5);
        expect(tocBox.y + tocBox.height).toBeLessThanOrEqual(bodyBox.y + 5);
      }
    });
  });
});
