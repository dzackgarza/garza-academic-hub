const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8082';
const screenshotsDir = path.join(__dirname, '../scratch/screenshots_refactor');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/teaching', name: 'teaching' },
  { path: '/activities', name: 'activities' },
  { path: '/blog', name: 'blog' },
  { path: '/writing', name: 'writing' },
  { path: '/gallery', name: 'gallery' },
  { path: '/blog/undergrad-resources', name: 'undergrad-resources' },
  { path: '/blog/krantz-mathematicians-survival-guide', name: 'krantz' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  for (const route of ROUTES) {
    console.log(`Screenshotting ${route.name}...`);
    await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(screenshotsDir, `${route.name}.png`), fullPage: true });
  }

  await browser.close();
  console.log('All screenshots captured.');
})();
