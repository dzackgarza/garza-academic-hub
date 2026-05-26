import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

// All published blog posts — every route must survive compilation
// and serve without MathJax errors.
const postSlugs = [
  '/blog/derived-algebraic-geometry-1',
  '/blog/precalculus-tips-and-tricks',
  '/blog/brief-intro-to-category-theory',
  '/blog/benson-farb-surface-bundles',
  '/blog/introduction-to-infinity-categories',
  '/blog/undergrad-resources',
  '/blog/undergrad-advice',
  '/blog/research-workflow',
  '/blog/topics-for-grad-school',
  '/blog/grad-recommendations',
  '/blog/moments-and-center-of-mass',
  '/blog/haskell-dev-environment',
  '/blog/krantz-mathematicians-survival-guide',
  '/blog/latex-handwriting-worksheets',
];

test.describe('display math alignment', () => {
  for (const slug of postSlugs) {
    test(`no MathJax errors on ${slug}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${slug}`, {
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
