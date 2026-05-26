import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

test.describe('MathJax macro definitions', () => {
  test('renders \PP macro correctly (not as raw "PP")', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/derived-algebraic-geometry-1`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(10000);

    // \PP appears in inline math in the note: e.g. $\PP^n$.
    // \PP is defined in the canonical tier1 macros as \mathbf{P}.
    // If defined, MathJax renders it as bold P, not raw "PP".
    // If undefined, MathJax renders an <mjx-merror> containing "PP".
    // Check every mjx-merror to ensure none is about \PP.
    const errors = await page.evaluate(() => {
      const merrors = document.querySelectorAll('mjx-merror');
      return Array.from(merrors).map((e) => e.getAttribute('data-mjx-error') || '');
    });
    const ppErrors = errors.filter((e) => e.includes('PP'));
    expect(ppErrors).toEqual([]);
  });
});
