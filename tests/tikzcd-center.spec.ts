import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

test.describe('tikzcd SVG centering', () => {
  test('tikzcd SVGs are horizontally centered in the post content', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog/derived-algebraic-geometry-1`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(2000);

    // Find all span.tikzcd elements that contain SVGs
    const containers = page.locator('span.tikzcd');
    const count = await containers.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Get the post content container bounding box
    const postContent = page.locator('.post-content');
    const contentBox = await postContent.boundingBox();
    expect(contentBox).not.toBeNull();
    const contentCenterX = contentBox!.x + contentBox!.width / 2;

    // For each tikzcd SVG, assert its horizontal center matches the
    // content container's center within 1px tolerance.
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
});
