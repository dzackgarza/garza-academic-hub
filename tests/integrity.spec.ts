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

test.describe('page integrity — all routes', () => {
  routes.forEach((route) => {
    test(`no console/page errors and all components hydrate on ${route.path}`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];

      page.on('pageerror', (exception) => {
        consoleErrors.push(
          `[PAGE ERROR] ${exception.message}\nStack:\n${exception.stack}`,
        );
      });

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(`[CONSOLE ERROR] ${message.text()}`);
        }
      });

      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      expect(consoleErrors, `${route.path}: console/page errors`).toEqual([]);

      // Every data-component placeholder must hydrate (no leftover <!-- ... placeholder --> HTML).
      const componentPlaceholders = page.locator('[data-component]');
      const count = await componentPlaceholders.count();
      for (let i = 0; i < count; i++) {
        const el = componentPlaceholders.nth(i);
        const name = await el.getAttribute('data-component');
        const innerHtml = await el.innerHTML();
        expect(
          innerHtml.trim(),
          `[${route.path}] data-component="${name}" did not hydrate`,
        ).not.toMatch(/<!--\s*.*placeholder\s*-->/i);
      }
    });
  });
});
