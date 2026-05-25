const { chromium } = require('playwright');
const path = require('path');

const screenshotDir = 'D:\\code\\MERN\\screenshots';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Step 1: Go to root - check what happens
  console.log('\n=== Navigating to http://localhost:5173 ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('URL:', page.url());
  
  // Get page HTML
  const html = await page.content();
  console.log('\n--- Page HTML (first 3000 chars) ---');
  console.log(html.substring(0, 3000));
  
  // Take screenshot
  await page.screenshot({ path: path.join(screenshotDir, 'debug-01-root.png'), fullPage: true });
  
  // Check all inputs on the page
  const allInputs = await page.locator('input').all();
  console.log(`\nInputs found: ${allInputs.length}`);
  for (const input of allInputs) {
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const id = await input.getAttribute('id');
    const placeholder = await input.getAttribute('placeholder');
    const testid = await input.getAttribute('data-testid');
    console.log(`  input type=${type} name=${name} id=${id} placeholder="${placeholder}" data-testid="${testid}"`);
  }
  
  // Check all buttons
  const allBtns = await page.locator('button').all();
  console.log(`\nButtons found: ${allBtns.length}`);
  for (const btn of allBtns) {
    const text = await btn.textContent();
    const testid = await btn.getAttribute('data-testid');
    const type = await btn.getAttribute('type');
    console.log(`  button text="${text?.trim()}" data-testid="${testid}" type=${type}`);
  }
  
  // === Step 2: Navigate to /register ===
  console.log('\n=== Navigating to /register ===');
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('URL:', page.url());
  
  await page.screenshot({ path: path.join(screenshotDir, 'debug-02-register.png'), fullPage: true });
  
  const regHtml = await page.content();
  console.log('\n--- Register Page HTML (first 3000 chars) ---');
  console.log(regHtml.substring(0, 3000));
  
  const regInputs = await page.locator('input').all();
  console.log(`\nInputs found on register: ${regInputs.length}`);
  for (const input of regInputs) {
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const id = await input.getAttribute('id');
    const placeholder = await input.getAttribute('placeholder');
    const testid = await input.getAttribute('data-testid');
    console.log(`  input type=${type} name=${name} id=${id} placeholder="${placeholder}" data-testid="${testid}"`);
  }
  
  const regBtns = await page.locator('button').all();
  console.log(`\nButtons found on register: ${regBtns.length}`);
  for (const btn of regBtns) {
    const text = await btn.textContent();
    const testid = await btn.getAttribute('data-testid');
    console.log(`  button text="${text?.trim()}" data-testid="${testid}"`);
  }
  
  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
