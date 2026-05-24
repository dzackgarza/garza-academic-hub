import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/teaching', name: 'teaching' },
  { path: '/activities', name: 'activities' },
  { path: '/blog', name: 'blog' },
  { path: '/writing', name: 'writing' },
  { path: '/gallery', name: 'gallery' },
];

test.describe('Site Integrity and Hydration Tests', () => {
  ROUTES.forEach((route) => {
    test(`Route "${route.path}" should render without console/runtime errors and hydrations should succeed`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];

      // Listen to unhandled exceptions
      page.on('pageerror', (exception) => {
        consoleErrors.push(
          `[PAGE ERROR] ${exception.message}\nStack:\n${exception.stack}`,
        );
      });

      // Listen to console errors
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(`[CONSOLE ERROR] ${message.text()}`);
        }
      });

      // Go to page
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // 1. Assert that no runtime browser errors occurred
      expect(consoleErrors).toEqual([]);

      // 2. Assert that the page shell was successfully injected and contains the compiled article wrapper
      const pageWrapper = page.locator('.academic-page-content');
      await expect(pageWrapper).toBeVisible();

      // 3. Assert actual page content renders (not just shell)
      // Each page has a known unique heading in its compiled markdown
      const contentHeadings = {
        '/': '2024-2025 academic year',
        '/teaching': 'Teaching',
        '/activities': 'Activities',
        '/blog': 'Blog',
        '/writing': 'Writing',
        '/gallery': 'Gallery',
      };
      const expectedHeading =
        contentHeadings[route.path as keyof typeof contentHeadings];
      if (expectedHeading) {
        await expect(pageWrapper).toContainText(expectedHeading);
      }

      // 4. For the home page, specifically assert that the dynamic card grids are fully hydrated and display academic cards
      if (route.path === '/') {
        const cards = page.locator('[data-component] .academic-card');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });
});
