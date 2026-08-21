import { chromium, FullConfig } from '@playwright/test';
import { ENV } from './environment';
import * as path from 'path';

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({
    headless: false, // Keep visible so you can watch the onboarding complete
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    permissions: ['geolocation'],
    geolocation: { latitude: 32.7767, longitude: -96.797 },
  });

  const page = await context.newPage();
  console.log('🚀 Running global setup: Completing onboarding sequence...');

  try {
    await page.goto(`${ENV.BASE_URL}/account/onboarding`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    // ----------------------------------------------------
    // STEP 1: "Do Weather Your Way"
    // ----------------------------------------------------
    const continueBtn = page.locator('button, a, div[role="button"]').filter({ hasText: /Continue|Done|Save|Next|Let's Go/i }).first();
    if (await continueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
    }

    // ----------------------------------------------------
    // STEP 2: "Set Primary Location"
    // ----------------------------------------------------
    // Wait for the input box or Use Current Location link
    const searchBox = page.getByPlaceholder(/Search for City, Address or ZIP code/i)
      .or(page.locator('input[type="text"], input[type="search"], input'))
      .first();

    await searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await searchBox.click();
    await searchBox.fill('');
    await searchBox.pressSequentially('Dallas', { delay: 120 });
    await page.waitForTimeout(2000);

    // Click the first city suggestion
    const firstOption = page.locator('p, li, [role="option"], div')
      .filter({ hasText: /Dallas/i })
      .first();

    if (await firstOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstOption.click();
    } else {
      await searchBox.press('Enter');
    }
    await page.waitForTimeout(2500);

    // ----------------------------------------------------
    // STEP 3: "Sign-In or Create Your Account" -> Click "Maybe Later"
    // ----------------------------------------------------
    const maybeLaterLink = page.locator('text="Maybe Later"').or(
      page.locator('p, span, button, a').filter({ hasText: /^Maybe Later$/i })
    ).first();

    await maybeLaterLink.waitFor({ state: 'visible', timeout: 10000 });
    await maybeLaterLink.click();

    // ----------------------------------------------------
    // STEP 4: Confirm we arrived on the main app
    // ----------------------------------------------------
    await page.waitForURL(/.*\/app\/.*/, { timeout: 15000 });
    await page.waitForTimeout(3000);

    // Save session storage
    const statePath = path.resolve(__dirname, '../../state.json');
    await context.storageState({ path: statePath });
    console.log(`✅ Onboarding complete! State saved to ${statePath}`);
  } catch (error) {
    console.error('⚠️ Global setup error:', error);
    // If interrupted, still capture storage state
    const statePath = path.resolve(__dirname, '../../state.json');
    await context.storageState({ path: statePath });
  } finally {
    await browser.close();
  }
}