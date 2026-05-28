import { test } from '@playwright/test';
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
  const manifestPath = path.resolve(
    __dirname,
    '..',
    '.generated',
    'site-manifest.json',
  );
  const raw = readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw) as { routes: ManifestRoute[] };
  return manifest.routes.map((r) => ({
    path: r.path,
    name: r.path === '/' ? 'home' : r.path.replace(/^\//, '').replace(/\//g, '-'),
  }));
}

const ROUTES = getRoutes();

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'laptop-half', width: 720, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('Multi-Viewport Spot-Check Screenshots Generator', () => {
  ROUTES.forEach((route) => {
    VIEWPORTS.forEach((viewport) => {
      test(`Spot-check: ${route.name} @ ${viewport.name}`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to the route
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' });
        
        // Wait 1.5 seconds for MathJax and layout to fully settle
        await page.waitForTimeout(1500);

        // Save screenshot to test-results/spot-checks/
        const filename = `${route.name}-${viewport.name}.png`;
        const filepath = path.join(__dirname, '..', 'test-results', 'spot-checks', filename);
        
        await page.screenshot({
          path: filepath,
          fullPage: true,
        });
      });
    });
  });
});
