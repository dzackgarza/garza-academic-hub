import { spawn } from 'child_process';
import { chromium } from 'playwright';
import path from 'path';

const PROJECT_ROOT = path.join(__dirname, '..');
const SCREENSHOT_PATH = '/home/dzack/.gemini/antigravity/brain/cee037cd-5ddf-4388-a1b1-084fff45bfd9/undergrad_resources.png';

async function run() {
  console.log("Starting Vite dev server...");
  const devServer = spawn('bun', ['run', 'dev', '--port', '8080'], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, PORT: '8080' }
  });

  // Log server output to check for startup or errors
  devServer.stdout.on('data', (data) => {
    console.log(`[Vite stdout]: ${data.toString().trim()}`);
  });

  devServer.stderr.on('data', (data) => {
    console.error(`[Vite stderr]: ${data.toString().trim()}`);
  });

  // Wait 3 seconds for server to start up
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("Launching browser via Playwright...");
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/chromium'
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });

  const url = 'http://localhost:8080/blog/undergrad-resources';
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    // Wait an extra second for any final MathJax layout or rendering settling
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Capturing full-page screenshot to ${SCREENSHOT_PATH}...`);
    await page.screenshot({
      path: SCREENSHOT_PATH,
      fullPage: true
    });
    console.log("Screenshot successfully saved!");
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
  } finally {
    console.log("Closing browser...");
    await browser.close();
    console.log("Shutting down Vite dev server...");
    devServer.kill('SIGINT');
  }
}

run().catch(err => {
  console.error("Runner failed:", err);
  process.exit(1);
});
