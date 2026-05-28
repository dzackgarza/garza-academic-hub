import { chromium } from 'playwright';

(async () => {
  console.log("Launching headless browser for TOC link assertion...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'http://localhost:8080/blog/undergrad-resources';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  
  // Wait for MathJax and layout to settle
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Locating all TOC link anchors...");
  const tocAnchors = await page.locator('.toc-card a').all();
  console.log(`Found ${tocAnchors.length} TOC links.`);
  
  if (tocAnchors.length === 0) {
    throw new Error("No TOC links found inside .toc-card!");
  }
  
  let failedLinks = 0;
  for (const anchor of tocAnchors) {
    const href = await anchor.getAttribute('href');
    const text = await anchor.textContent();
    
    if (!href || !href.startsWith('#')) {
      console.error(`❌ Invalid href for link "${text}": ${href}`);
      failedLinks++;
      continue;
    }
    
    const targetId = href.substring(1);
    // Escape special characters in the ID for CSS selector
    const escapedId = targetId.replace(/([#;?%&,.+*~\':"!^$[\]()=>|/\\@])/g, '\\$1');
    const targetExists = await page.locator(`#${escapedId}`).count() > 0;
    
    if (targetExists) {
      console.log(`✅ Link text: "${text.trim()}" successfully points to element with id="${targetId}"`);
    } else {
      console.error(`❌ Broken link! text: "${text.trim()}" points to href="${href}" but no element with id="${targetId}" exists in the document!`);
      failedLinks++;
    }
  }
  
  await browser.close();
  
  if (failedLinks > 0) {
    console.error(`\nAssertion failed! ${failedLinks} broken or invalid TOC links found.`);
    process.exit(1);
  } else {
    console.log("\nSuccess! All TOC links are completely valid and point to existing heading elements on the page.");
    process.exit(0);
  }
})().catch(err => {
  console.error("Critical error during TOC link assertion:", err);
  process.exit(1);
});
