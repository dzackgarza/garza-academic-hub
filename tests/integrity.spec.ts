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
      const failedResources: string[] = [];

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

      page.on('response', (response) => {
        const status = response.status();
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        // Capture 4xx or 5xx responses for static files or main resources (excluding dynamic API paths)
        if (status >= 400 && !url.includes('/api/')) {
          failedResources.push(`[HTTP ERROR ${status}] ${url}`);
        }

        // Capture MIME type mismatch for javascript files loaded as application/octet-stream
        if (
          (url.endsWith('.js') || url.endsWith('.mjs')) &&
          contentType.includes('application/octet-stream')
        ) {
          consoleErrors.push(
            `[MIME ERROR] JS script ${url} served with MIME type application/octet-stream`,
          );
        }
      });

      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      expect(consoleErrors, `${route.path}: console/page/MIME errors`).toEqual([]);
      expect(failedResources, `${route.path}: failed resource loads`).toEqual([]);

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
