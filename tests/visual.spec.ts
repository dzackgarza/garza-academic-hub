import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';
const testDir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.resolve(testDir, '../.generated/site-manifest.json'), 'utf8'),
) as { routes: Array<{ path: string; title: string; type: string }> };

const routes = manifest.routes;

test.describe('Site Integrity and Hydration Tests', () => {
  routes.forEach((route) => {
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
      const pageWrapper = page.locator('.academic-page-content, .post-content');
      await expect(pageWrapper).toBeVisible();

      // 3. Assert actual page content renders (not just shell)
      await expect(pageWrapper).toContainText(route.title);

      // 4. Assert template-owned site chrome is present before any island behavior.
      await expect(page.locator('.academic-site-nav')).toBeVisible();
      await expect(page.locator('.academic-site-footer')).toContainText(
        'D. Zack Garza',
      );
      await expect(page.locator('.academic-site-nav')).toContainText('Teaching');

      const profileCard = page.locator('.sidebar');
      if ((await profileCard.count()) > 0) {
        await expect(profileCard).toBeVisible();
        const cardText = (await profileCard.textContent()) ?? '';
        expect(
          cardText.trim().length,
          route.path + ': profile card should contain template-rendered content',
        ).toBeGreaterThan(0);
      }

      // 5. Assert every data-component placeholder has been hydrated with real content.
      //    (Checks that the React component tree mounted and rendered — catches missing
      //     registry entries and silently-failing components.)
      const componentPlaceholders = page.locator('[data-component]');
      const count = await componentPlaceholders.count();
      for (let i = 0; i < count; i++) {
        const el = componentPlaceholders.nth(i);
        // The component name (e.g. "GalleryGrid", "AcademicCollection")
        const name = await el.getAttribute('data-component');
        // The inner HTML after React mounts. If the component never mounted,
        // the element still contains the placeholder comment from compile.
        const innerHtml = await el.innerHTML();
        expect(
          innerHtml.trim(),
          `[${route.path}] data-component="${name}" placeholder did not hydrate (inner HTML looks like empty placeholder)`,
        ).not.toMatch(/<!--\s*.*placeholder\s*-->/i);
      }

      // 6. For the home page, specifically assert content-declared slots were compiled into static cards.
      if (route.path === '/') {
        const cards = page.locator('.academic-card');
        const cardCount = await cards.count();
        expect(cardCount).toBeGreaterThan(0);
      }

      // 7. Assert that there is exactly one <h1> element on the page (SEO and visual purity).
      const h1Elements = page.locator('h1');
      const h1Count = await h1Elements.count();
      expect(
        h1Count,
        `[${route.path}] should have exactly one <h1> tag to prevent duplicate headings, but found ${h1Count}`,
      ).toBe(1);
    });
  });
});

test.describe('Nav link navigation', () => {
  const pageNavLinks = manifest.routes
    .filter((r) => r.path !== '/' && r.type === 'page')
    .map((r) => ({ path: r.path, title: r.title }));

  pageNavLinks.forEach(({ path, title }) => {
    test(`clicking "${title}" nav navigates to ${path} and renders page content`, async ({
      page,
    }) => {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Click the nav link by its text (matches title)
      await page.locator('.academic-site-nav a', { hasText: title }).click();

      // Wait for page content to render after navigation
      await page.waitForTimeout(1500);

      // Verify no 404
      const body = await page.locator('body').textContent();
      expect(
        body?.includes('404') || body?.includes('not found'),
        `Nav "${title}" → ${path} led to 404 at ${page.url()}`,
      ).toBe(false);

      // Verify correct page title rendered
      await expect(page.locator('h1')).toContainText(title, { timeout: 5000 });

      // Verify page content rendered (not empty shell)
      const content = page.locator('.academic-page-content, .post-content');
      const contentText = await content.textContent();
      expect(contentText?.trim().length).toBeGreaterThan(0);
    });
  });
});
