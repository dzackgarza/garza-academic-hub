import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';
const testDir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.resolve(testDir, '../.generated/site-manifest.json'), 'utf8'),
) as { routes: Array<{ path: string; type: string }> };

const blogRoutes = manifest.routes.filter((r) => r.type === 'post');

test.describe('tikzcd SVG centering', () => {
  for (const route of blogRoutes) {
    test(`tikzcd SVGs are horizontally centered on ${route.path}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(2000);

      const containers = page.locator('span.tikzcd');
      const count = await containers.count();

      // Not every post has tikzcd; skip those without.
      if (count === 0) {
        return;
      }

      const postContent = page.locator('.post-content');
      const contentBox = await postContent.boundingBox();
      expect(contentBox).not.toBeNull();
      const contentCenterX = contentBox!.x + contentBox!.width / 2;

      for (let i = 0; i < count; i++) {
        const container = containers.nth(i);
        const svg = container.locator('svg').first();
        const svgBox = await svg.boundingBox();
        expect(svgBox, `SVG #${i} should have a bounding box`).not.toBeNull();
        const svgCenterX = svgBox!.x + svgBox!.width / 2;
        const diff = Math.abs(svgCenterX - contentCenterX);
        expect(
          diff,
          `SVG #${i} center X (${svgCenterX.toFixed(1)}) should be within 1px of content center X (${contentCenterX.toFixed(1)}), diff=${diff.toFixed(1)}`,
        ).toBeLessThanOrEqual(1);
      }
    });
  }
});
