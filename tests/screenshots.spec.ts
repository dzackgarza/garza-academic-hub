import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.TEST_URL || 'http://localhost/website';

interface ManifestRoute {
  path: string;
  type: string;
}

function getRoutes(): { path: string; name: string }[] {
  const manifestPath = path.resolve(__dirname, '..', '.generated', 'site-manifest.json');
  const raw = readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw) as { routes: ManifestRoute[] };
  return manifest.routes
    .filter((r) => r.type === 'page')
    .map((r) => ({
      path: r.path,
      name: r.path === '/' ? 'home' : r.path.replace(/^\//, ''),
    }));
}

const ROUTES = getRoutes();

test.describe('Visual Regression Tests', () => {
  ROUTES.forEach((route) => {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  });
});
