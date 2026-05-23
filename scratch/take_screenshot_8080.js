import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 1600 }
  });
  const page = await context.newPage();
  
  console.log("Navigating to http://localhost:8080/blog/undergrad-resources ...");
  await page.goto('http://localhost:8080/blog/undergrad-resources', { waitUntil: 'networkidle' });
  
  const screenshotPath = '/home/dzack/.gemini/antigravity/brain/cee037cd-5ddf-4388-a1b1-084fff45bfd9/undergrad_resources_8080.png';
  console.log("Taking full-page screenshot...");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log(`Screenshot saved successfully to ${screenshotPath}`);
  await browser.close();
})();
