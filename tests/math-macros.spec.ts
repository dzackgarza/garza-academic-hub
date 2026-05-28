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

// Tier-1 macros that appear in blog content (defined as \mathbf, \mathbb, etc.).
// An undefined macro renders as <mjx-merror data-mjx-error="...">.
const macros = ['PP', 'ZZ', 'RR', 'CC', 'NN', 'QQ', 'FF', 'GL'];

test.describe('MathJax macro definitions', () => {
  test.setTimeout(60000);

  for (const route of blogRoutes) {
    test(`no undefined macros on ${route.path}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('article.post-content')).toBeVisible();
      await page.waitForFunction(() => Boolean((window as any).MathJax?.startup?.promise));
      await page.evaluate(() => (window as any).MathJax.startup.promise);

      const errors: string[] = await page.evaluate(() => {
        const merrors = document.querySelectorAll('mjx-merror');
        return Array.from(merrors).map((e) => e.getAttribute('data-mjx-error') || '');
      });

      const macroErrors = errors.filter((e) => macros.some((m) => e.includes(m)));
      expect(macroErrors).toEqual([]);
    });
  }
});
