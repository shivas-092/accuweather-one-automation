import { test as setup } from '@playwright/test';
import * as path from 'path';

const authFile = path.resolve(__dirname, '../state.json');

setup('Complete Onboarding Once for Entire Project', async ({ page }) => {
  console.log('🚀 Running setup: Completing onboarding once for all suites...');

  await page.goto('/account/onboarding', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const startTime = Date.now();
  const MAX_SETUP_TIME = 40000;

  while (Date.now() - startTime < MAX_SETUP_TIME) {
    const currentUrl = page.url();

    // Reached main app dashboard
    if (currentUrl.includes('/app/')) {
      console.log(`🎉 Landed on dashboard: ${currentUrl}`);
      break;
    }

    // ------------------------------------------------------------------
    // STEP 1: "Do Weather Your Way" (/account/onboarding)
    // ------------------------------------------------------------------
    if (
      currentUrl.includes('/account/onboarding') ||
      (await page.locator('text="Do Weather Your Way"').isVisible().catch(() => false))
    ) {
      // Ensure Dial is selected
      const dialBtn = page.locator('text="Dial"').first();
      if (await dialBtn.isVisible().catch(() => false)) {
        await dialBtn.click().catch(() => {});
      }

      // Click the bottom action button (Next / Continue / Save / Let's Go)
      const nextBtn = page
        .locator('button, a, div[role="button"]')
        .filter({ hasText: /Next|Continue|Save|Done|Let's Go/i })
        .last();

      if (await nextBtn.isVisible().catch(() => false)) {
        await nextBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1500);
        continue;
      }
    }

    // ------------------------------------------------------------------
    // STEP 2: "Set Primary Location" (/account/primary-location)
    // ------------------------------------------------------------------
    if (
      currentUrl.includes('/account/primary-location') ||
      (await page.locator('text="Set Primary Location"').isVisible().catch(() => false))
    ) {
      const searchBox = page
        .getByPlaceholder(/search/i)
        .or(page.getByRole('textbox'))
        .or(page.locator('input'))
        .first();

      if (await searchBox.isVisible().catch(() => false)) {
        await searchBox.click();
        await searchBox.fill('');
        await searchBox.pressSequentially('Dallas', { delay: 100 });
        await page.waitForTimeout(1500);

        // Click the first matching result suggestion
        const suggestion = page
          .locator('[role="option"], [role="listitem"], .search-results p, p, div')
          .filter({ hasText: /Dallas/i })
          .first();

        if (await suggestion.isVisible({ timeout: 4000 }).catch(() => false)) {
          await suggestion.click();
        } else {
          await searchBox.press('Enter');
        }
        await page.waitForTimeout(1500);
        continue;
      }
    }

    // ------------------------------------------------------------------
    // STEP 3: "Sign-In or Create Your Account" (/account/create-account)
    // ------------------------------------------------------------------
    if (
      currentUrl.includes('/account/create-account') ||
      (await page.locator('text="Sign-In or Create Your Account"').isVisible().catch(() => false)) ||
      (await page.locator('text="Maybe Later"').isVisible().catch(() => false))
    ) {
      const maybeLater = page
        .locator('text="Maybe Later"')
        .or(page.locator('button, a, span, p').filter({ hasText: /^Maybe Later$/i }))
        .first();

      if (await maybeLater.isVisible({ timeout: 5000 }).catch(() => false)) {
        await maybeLater.scrollIntoViewIfNeeded().catch(() => {});
        await maybeLater.click({ force: true }).catch(() => {});
        await page.waitForTimeout(2000);
        continue;
      }
    }

    await page.waitForTimeout(500);
  }

  // Ensure page has landed on the main app
  await page.waitForURL(/.*\/app\/.*/, { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Save session storage state
  await page.context().storageState({ path: authFile });
  console.log(`✅ Setup complete! State saved to ${authFile}`);
});