import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const routes = [
  { name: 'home', path: '/' },
  { name: 'blog', path: '/blog' },
  { name: 'teaching', path: '/teaching' },
  { name: 'activities', path: '/activities' },
  { name: 'writing', path: '/writing' },
  { name: 'gallery', path: '/gallery' },
  { name: 'undergrad_resources_8080', path: '/blog/undergrad-resources' },
  { name: 'krantz_screenshot_8080', path: '/blog/krantz-mathematicians-survival-guide' }
];

const outputDir = '/home/dzack/.gemini/antigravity/brain/cee037cd-5ddf-4388-a1b1-084fff45bfd9';

(async () => {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });

  for (const route of routes) {
    const url = `http://localhost:8080${route.path}`;
    console.log(`\nNavigating to ${url}...`);
    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });
      
      const status = response ? response.status() : 'No response';
      console.log(`Status: ${status}`);
      
      // Wait an extra second to allow MathJax rendering and dynamic styles to settle
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const screenshotPath = path.join(outputDir, `${route.name}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      console.log(`Successfully captured and saved to ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed to capture screenshot for ${route.path}:`, err.message);
    }
  }

  console.log("\nAll screenshot tasks complete.");
  await browser.close();
})().catch(err => {
  console.error("Critical error in screenshot pipeline:", err);
  process.exit(1);
});
