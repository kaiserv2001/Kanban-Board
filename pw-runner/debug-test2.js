const { chromium } = require('playwright');
const path = require('path');

const screenshotDir = 'D:\\code\\MERN\\screenshots';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForReact(page) {
  // Wait for React to mount some content in #root or main app container
  await page.waitForSelector('body > *:not(script):not(style)', { timeout: 10000 }).catch(() => {});
  await sleep(2000); // Extra time for React
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console messages for debugging
  const consoleMsgs = [];
  page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleMsgs.push(`[pageerror] ${err.message}`));

  // Step 1: Go to root - check what happens
  console.log('\n=== Navigating to http://localhost:5173 ===');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  // Wait for JS to execute and React to render
  await page.waitForFunction(() => {
    const root = document.getElementById('root');
    return root && root.children.length > 0;
  }, { timeout: 10000 }).catch(() => console.log('WARNING: root not populated'));
  
  await sleep(2000);
  
  console.log('URL:', page.url());
  
  // Get full body content
  const bodyContent = await page.evaluate(() => document.body.innerHTML);
  console.log('\n--- Body HTML ---');
  console.log(bodyContent.substring(0, 5000));
  
  await page.screenshot({ path: path.join(screenshotDir, 'debug2-01-root.png'), fullPage: true });
  
  // Enumerate all inputs
  const inputs = await page.locator('input').all();
  console.log(`\nInputs: ${inputs.length}`);
  for (const inp of inputs) {
    const attrs = await inp.evaluate(el => ({
      type: el.type, name: el.name, id: el.id,
      placeholder: el.placeholder, 
      testid: el.getAttribute('data-testid'),
      className: el.className
    }));
    console.log('  ', JSON.stringify(attrs));
  }
  
  const btns = await page.locator('button').all();
  console.log(`\nButtons: ${btns.length}`);
  for (const btn of btns) {
    const attrs = await btn.evaluate(el => ({
      text: el.textContent?.trim(),
      type: el.type,
      testid: el.getAttribute('data-testid')
    }));
    console.log('  ', JSON.stringify(attrs));
  }
  
  console.log('\nConsole messages:');
  consoleMsgs.forEach(m => console.log(' ', m));
  
  // === Register page ===
  console.log('\n=== Navigating to /register ===');
  await page.goto('http://localhost:5173/register', { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  await page.waitForFunction(() => {
    const root = document.getElementById('root');
    return root && root.children.length > 0;
  }, { timeout: 10000 }).catch(() => {});
  
  await sleep(2000);
  
  console.log('URL:', page.url());
  
  const regBody = await page.evaluate(() => document.body.innerHTML);
  console.log('\n--- Register Body HTML ---');
  console.log(regBody.substring(0, 5000));
  
  await page.screenshot({ path: path.join(screenshotDir, 'debug2-02-register.png'), fullPage: true });
  
  const regInputs = await page.locator('input').all();
  console.log(`\nRegister Inputs: ${regInputs.length}`);
  for (const inp of regInputs) {
    const attrs = await inp.evaluate(el => ({
      type: el.type, name: el.name, id: el.id,
      placeholder: el.placeholder,
      testid: el.getAttribute('data-testid'),
      className: el.className
    }));
    console.log('  ', JSON.stringify(attrs));
  }
  
  const regBtns = await page.locator('button').all();
  console.log(`\nRegister Buttons: ${regBtns.length}`);
  for (const btn of regBtns) {
    const attrs = await btn.evaluate(el => ({
      text: el.textContent?.trim(),
      testid: el.getAttribute('data-testid')
    }));
    console.log('  ', JSON.stringify(attrs));
  }
  
  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err.stack);
  process.exit(1);
});
