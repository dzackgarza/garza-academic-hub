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

test.describe('display math alignment', () => {
  for (const route of blogRoutes) {
    test(`no MathJax errors on ${route.path}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: 'networkidle',
      });
      // Wait for MathJax to finish typesetting
      await page.waitForFunction(() => (window as any).MathJax !== undefined);
      await page.evaluate(() => (window as any).MathJax.startup.promise);

      const errors = await page.evaluate(() => {
        const result: string[] = [];

        // mjx-merror elements
        const merrors = document.querySelectorAll('mjx-merror');
        if (merrors.length > 0) {
          result.push(`found ${merrors.length} mjx-merror element(s)`);
        }

        // data-mjx-error attributes
        const errorAttrs = document.querySelectorAll('[data-mjx-error]');
        if (errorAttrs.length > 0) {
          result.push(
            `found ${errorAttrs.length} element(s) with data-mjx-error attribute`,
          );
        }

        // visible "Misplaced &" anywhere on the page
        const bodyText = document.body.textContent || '';
        if (bodyText.includes('Misplaced &')) {
          result.push('visible "Misplaced &" text found on the page');
        }

        return result;
      });

      expect(errors).toStrictEqual([]);
    });
  }
});
