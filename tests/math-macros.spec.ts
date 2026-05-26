import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

// Posts and macros known to appear in each.
const postSlugs = [
  {
    slug: '/blog/derived-algebraic-geometry-1',
    macros: ['PP', 'ZZ', 'RR', 'CC', 'QQ'],
  },
  { slug: '/blog/benson-farb-surface-bundles', macros: ['ZZ', 'RR', 'CC'] },
  { slug: '/blog/brief-intro-to-category-theory', macros: ['ZZ'] },
  { slug: '/blog/topics-for-grad-school', macros: ['ZZ', 'RR'] },
  { slug: '/blog/undergrad-resources', macros: ['ZZ'] },
];

test.describe('MathJax macro definitions', () => {
  for (const { slug, macros } of postSlugs) {
    for (const macro of macros) {
      const macroTeX = `\\${macro}`;
      test(`\\${macro} renders correctly on ${slug}`, async ({ page }) => {
        await page.goto(`${BASE_URL}${slug}`, {
          waitUntil: 'networkidle',
        });
        // Wait for MathJax to finish typesetting
        await page.waitForFunction(() => (window as any).MathJax !== undefined);
        await page.evaluate(() => (window as any).MathJax.startup.promise);

        // If the macro is undefined, MathJax renders an <mjx-merror>
        // with data-mjx-error containing the bare name (e.g. "PP").
        const errors = await page.evaluate(() => {
          const merrors = document.querySelectorAll('mjx-merror');
          return Array.from(merrors).map((e) => e.getAttribute('data-mjx-error') || '');
        });
        const macroErrors = errors.filter((e) => e.includes(macro));
        expect(
          macroErrors,
          `${slug}: \\${macro} should not appear in any mjx-merror`,
        ).toEqual([]);
      });
    }
  }
});
