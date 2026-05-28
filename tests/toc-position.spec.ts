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

// Only test blog posts that have headings (Pandoc generates TOC only when headings exist)
const blogPosts = manifest.routes
  .filter((r) => r.path.startsWith('/blog/'))
  .filter((r) => {
    const srcPath = path.join(contentDir, r.path + '.md');
    if (!existsSync(srcPath)) return false;
    const content = readFileSync(srcPath, 'utf8');
    return /^##\s/m.test(content);
  })
  .slice(0, 2);

test.describe('TOC position on blog posts', () => {
  blogPosts.forEach((route) => {
    test(`"${route.path}" TOC is below title+tags, above body`, async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 900 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const header = page.locator('.post-header');
      const toc = page.locator('nav.toc-card');
      const firstBody = page.locator('.post-content > h2, .post-content > p').first();

      await expect(header).toBeVisible();
      await expect(toc).toBeVisible();
      await expect(firstBody).toBeVisible();

      const headerBox = await header.boundingBox();
      const tocBox = await toc.boundingBox();
      const bodyBox = await firstBody.boundingBox();

      expect(headerBox).toBeTruthy();
      expect(tocBox).toBeTruthy();
      expect(bodyBox).toBeTruthy();

      if (headerBox && tocBox && bodyBox) {
        // TOC must start after header ends
        expect(
          tocBox.y,
          'TOC should start at or after header bottom',
        ).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 5);

        // Body must start after TOC ends
        expect(
          bodyBox.y,
          'first body heading should be at or below TOC bottom',
        ).toBeGreaterThanOrEqual(tocBox.y + tocBox.height - 5);
      }
    });
  });
});
