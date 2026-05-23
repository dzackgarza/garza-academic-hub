import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('BlogListing island hydration', () => {
  test('blog listing renders without ReferenceError from missing imports', async ({
    page,
  }) => {
    const errors: string[] = [];

    page.on('pageerror', (exception) => {
      errors.push(`[PAGE ERROR] ${exception.message}`);
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(`[CONSOLE ERROR] ${message.text()}`);
      }
    });

    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // The BlogListing component uses useSearchParams, Link, SectionHeading,
    // FileText, and Clock without importing them. This test verifies that
    // none of these missing imports cause ReferenceErrors at runtime.
    expect(errors).toEqual([]);
  });
});
