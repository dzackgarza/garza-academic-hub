import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

test.describe('TOC responsive visibility', () => {
  const blogPosts = [
    '/blog/topics-for-grad-school',
    '/blog/precalculus-tips-and-tricks',
  ];

  blogPosts.forEach((path) => {
    test(`"${path}" shows TOC inline below 1024px`, async ({ page }) => {
      // Narrow viewport: legacy site shows TOC inline above content
      // Current bug: TOC is display:none below 1024px
      await page.setViewportSize({ width: 800, height: 900 });
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const tocAside = page.locator('.post-sidebar');
      await expect(tocAside).toBeAttached();

      const display = await tocAside.evaluate(
        (el) => window.getComputedStyle(el).display,
      );
      console.log(`${path} 800px: .post-sidebar display = ${display}`);

      // The TOC must be visible at all widths — inline below 1024px, sidebar above
      await expect(tocAside).toBeVisible();
    });

    test(`"${path}" shows TOC as sticky sidebar at >=1024px`, async ({ page }) => {
      // Wide viewport: TOC should be visible as sticky sidebar column
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
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
