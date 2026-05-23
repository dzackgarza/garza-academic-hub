import { chromium } from 'playwright';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/usr/bin/chromium'
  });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1800 });
  
  console.log("Navigating to http://localhost:8081/blog/krantz-mathematicians-survival-guide ...");
  await page.goto('http://localhost:8081/blog/krantz-mathematicians-survival-guide', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  console.log("Taking full-page screenshot...");
  const screenshotPath = '/home/dzack/.gemini/antigravity/brain/cee037cd-5ddf-4388-a1b1-084fff45bfd9/krantz_screenshot_8081.png';
  await page.screenshot({ 
    path: screenshotPath, 
    fullPage: true 
  });
  
  console.log(`Screenshot saved successfully to ${screenshotPath}`);
  await browser.close();
})().catch(err => {
  console.error("Error capturing screenshot:", err);
  process.exit(1);
});
