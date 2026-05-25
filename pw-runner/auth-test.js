const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Use Windows path for screenshots since chromium is Windows
const screenshotDir = 'D:\\code\\MERN\\screenshots';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const results = [];
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // =========================================================
    // Step 1: Open the app - should redirect to /login
    // =========================================================
    console.log('\n=== STEP 1: Open App ===');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(1000);
    const step1Url = page.url();
    await page.screenshot({ path: path.join(screenshotDir, '01-initial-load.png'), fullPage: true });
    
    const step1Title = await page.title();
    const loginForm = await page.locator('[data-testid="login-email-input"]').count();
    
    console.log(`URL: ${step1Url}`);
    console.log(`Title: ${step1Title}`);
    console.log(`Login form visible: ${loginForm > 0}`);
    
    results.push({
      step: 1,
      name: 'Open App',
      url: step1Url,
      pass: step1Url.includes('/login'),
      notes: `URL=${step1Url}, loginFormVisible=${loginForm > 0}`
    });

    // =========================================================
    // Step 2: Register new user
    // =========================================================
    console.log('\n=== STEP 2: Register ===');
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(500);
    await page.screenshot({ path: path.join(screenshotDir, '02-register-page.png'), fullPage: true });
    
    const step2Url = page.url();
    console.log(`Register URL: ${step2Url}`);
    
    // Fill registration form
    const nameInput = page.locator('[data-testid="register-name-input"]');
    const emailInput = page.locator('[data-testid="register-email-input"]');
    const passwordInput = page.locator('[data-testid="register-password-input"]');
    
    // Check if inputs exist, fallback to type selectors
    const nameCount = await nameInput.count();
    const emailCount = await emailInput.count();
    const passCount = await passwordInput.count();
    console.log(`Name input found: ${nameCount}, Email: ${emailCount}, Password: ${passCount}`);
    
    if (nameCount > 0) {
      await nameInput.fill('Sprint1 Tester');
    } else {
      // Try by placeholder or label
      await page.locator('input[name="name"], input[placeholder*="name" i], input[placeholder*="Name"]').first().fill('Sprint1 Tester');
    }
    
    if (emailCount > 0) {
      await emailInput.fill('sprint1@jobhunt.dev');
    } else {
      await page.locator('input[type="email"], input[name="email"]').first().fill('sprint1@jobhunt.dev');
    }
    
    if (passCount > 0) {
      await passwordInput.fill('Test1234!');
    } else {
      await page.locator('input[type="password"], input[name="password"]').first().fill('Test1234!');
    }
    
    await page.screenshot({ path: path.join(screenshotDir, '02b-register-filled.png'), fullPage: true });
    
    // Submit
    const submitBtn = page.locator('[data-testid="register-submit-btn"]');
    const submitCount = await submitBtn.count();
    console.log(`Submit button found: ${submitCount}`);
    
    if (submitCount > 0) {
      await submitBtn.click();
    } else {
      await page.locator('button[type="submit"]').first().click();
    }
    
    // Wait for redirect
    await page.waitForURL(url => !url.toString().includes('/register'), { timeout: 10000 }).catch(() => {});
    await sleep(1500);
    
    const step2AfterUrl = page.url();
    await page.screenshot({ path: path.join(screenshotDir, '02c-after-register.png'), fullPage: true });
    
    // Check navbar for username
    const navUsername = page.locator('[data-testid="nav-username"]');
    const navUsernameCount = await navUsername.count();
    let navUsernameText = '';
    if (navUsernameCount > 0) {
      navUsernameText = await navUsername.textContent();
    }
    
    console.log(`After register URL: ${step2AfterUrl}`);
    console.log(`Nav username: ${navUsernameText}`);
    
    results.push({
      step: 2,
      name: 'Register',
      url: step2AfterUrl,
      pass: !step2AfterUrl.includes('/register') && (step2AfterUrl.includes('/') || step2AfterUrl.includes('dashboard')),
      notes: `URL=${step2AfterUrl}, navUsername="${navUsernameText}"`
    });

    // =========================================================
    // Step 3: Verify Dashboard
    // =========================================================
    console.log('\n=== STEP 3: Dashboard ===');
    await sleep(500);
    const step3Url = page.url();
    await page.screenshot({ path: path.join(screenshotDir, '03-dashboard.png'), fullPage: true });
    
    const navUsernameEl = page.locator('[data-testid="nav-username"]');
    const navCount3 = await navUsernameEl.count();
    let navText3 = '';
    if (navCount3 > 0) navText3 = await navUsernameEl.textContent();
    
    const errorMessages = await page.locator('[class*="error"], [class*="alert"], [role="alert"]').count();
    
    console.log(`Dashboard URL: ${step3Url}`);
    console.log(`Nav username text: "${navText3}"`);
    console.log(`Error messages visible: ${errorMessages}`);
    
    results.push({
      step: 3,
      name: 'Dashboard Verify',
      url: step3Url,
      pass: (step3Url.endsWith('/') || step3Url.includes('dashboard')) && navText3.includes('Sprint1'),
      notes: `URL=${step3Url}, navUsername="${navText3}", errors=${errorMessages}`
    });

    // =========================================================
    // Step 4: Logout
    // =========================================================
    console.log('\n=== STEP 4: Logout ===');
    const logoutBtn = page.locator('[data-testid="nav-logout-btn"]');
    const logoutCount = await logoutBtn.count();
    console.log(`Logout button found: ${logoutCount}`);
    
    if (logoutCount > 0) {
      await logoutBtn.click();
    } else {
      // Try common patterns
      await page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first().click();
    }
    
    await page.waitForURL(url => url.toString().includes('/login'), { timeout: 10000 }).catch(() => {});
    await sleep(1000);
    
    const step4Url = page.url();
    await page.screenshot({ path: path.join(screenshotDir, '04-after-logout.png'), fullPage: true });
    
    console.log(`After logout URL: ${step4Url}`);
    
    results.push({
      step: 4,
      name: 'Logout',
      url: step4Url,
      pass: step4Url.includes('/login'),
      notes: `URL=${step4Url}`
    });

    // =========================================================
    // Step 5: Login with registered credentials
    // =========================================================
    console.log('\n=== STEP 5: Login ===');
    
    const loginEmail = page.locator('[data-testid="login-email-input"]');
    const loginPass = page.locator('[data-testid="login-password-input"]');
    
    const loginEmailCount = await loginEmail.count();
    const loginPassCount = await loginPass.count();
    console.log(`Login email input found: ${loginEmailCount}, password: ${loginPassCount}`);
    
    if (loginEmailCount > 0) {
      await loginEmail.fill('sprint1@jobhunt.dev');
    } else {
      await page.locator('input[type="email"], input[name="email"]').first().fill('sprint1@jobhunt.dev');
    }
    
    if (loginPassCount > 0) {
      await loginPass.fill('Test1234!');
    } else {
      await page.locator('input[type="password"], input[name="password"]').first().fill('Test1234!');
    }
    
    await page.screenshot({ path: path.join(screenshotDir, '05-login-filled.png'), fullPage: true });
    
    const loginSubmitBtn = page.locator('[data-testid="login-submit-btn"]');
    const loginSubmitCount = await loginSubmitBtn.count();
    console.log(`Login submit button found: ${loginSubmitCount}`);
    
    if (loginSubmitCount > 0) {
      await loginSubmitBtn.click();
    } else {
      await page.locator('button[type="submit"]').first().click();
    }
    
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 }).catch(() => {});
    await sleep(1500);
    
    const step5Url = page.url();
    await page.screenshot({ path: path.join(screenshotDir, '05b-after-login.png'), fullPage: true });
    
    const navEl5 = page.locator('[data-testid="nav-username"]');
    const navCount5 = await navEl5.count();
    let navText5 = '';
    if (navCount5 > 0) navText5 = await navEl5.textContent();
    
    console.log(`After login URL: ${step5Url}`);
    console.log(`Nav username: "${navText5}"`);
    
    results.push({
      step: 5,
      name: 'Login',
      url: step5Url,
      pass: !step5Url.includes('/login') && navText5.includes('Sprint1'),
      notes: `URL=${step5Url}, navUsername="${navText5}"`
    });

    // =========================================================
    // Step 6: Verify Persistence (navigate again)
    // =========================================================
    console.log('\n=== STEP 6: Persistence ===');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(1500);
    
    const step6Url = page.url();
    await page.screenshot({ path: path.join(screenshotDir, '06-persistence.png'), fullPage: true });
    
    const navEl6 = page.locator('[data-testid="nav-username"]');
    const navCount6 = await navEl6.count();
    let navText6 = '';
    if (navCount6 > 0) navText6 = await navEl6.textContent();
    
    const stillLoggedIn = !step6Url.includes('/login');
    console.log(`Persistence URL: ${step6Url}`);
    console.log(`Still logged in: ${stillLoggedIn}`);
    console.log(`Nav username: "${navText6}"`);
    
    results.push({
      step: 6,
      name: 'Persistence',
      url: step6Url,
      pass: stillLoggedIn,
      notes: `URL=${step6Url}, navUsername="${navText6}"`
    });

  } catch (err) {
    console.error('ERROR:', err.message);
    await page.screenshot({ path: path.join(screenshotDir, 'error.png'), fullPage: true }).catch(() => {});
    results.push({ step: 'error', pass: false, notes: err.message });
  }

  await browser.close();
  
  // Print summary
  console.log('\n\n=== SUMMARY ===');
  let allPass = true;
  for (const r of results) {
    const status = r.pass ? 'PASS' : 'FAIL';
    if (!r.pass) allPass = false;
    console.log(`Step ${r.step} (${r.name}): ${status} — ${r.notes}`);
  }
  console.log(`\nConsole errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.log(' -', e));
  }
  console.log(`\nOverall: ${allPass ? 'PASS' : 'FAIL'}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
