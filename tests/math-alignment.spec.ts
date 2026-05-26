import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

test.describe('display math alignment', () => {
  test('does not render MathJax "Misplaced &" errors in display math', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog/derived-algebraic-geometry-1`, {
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
});
