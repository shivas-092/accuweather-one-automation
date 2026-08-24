import { test as setup } from '@playwright/test';
import * as path from 'path';

const authFile = path.resolve(__dirname, '../state.json');

setup('Complete Onboarding Once for Entire Project', async ({ page }) => {
  console.log('🚀 Running setup: Completing onboarding once for all suites...');

  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      console.log(`➡️ Main frame navigated: ${frame.url()}`);
    }
  });

  page.on('framedetached', (frame) => {
    console.log(`⚠️ Frame detached: ${frame.url()}`);
  });

  page.on('requestfailed', (request) => {
    console.log(
      `❌ Request failed: ${request.url()} | ${request.failure()?.errorText}`
    );
  });

  page.on('pageerror', (error) => {
    console.log(`❌ Page error: ${error.message}`);
  });

  console.log('🌐 Navigating to onboarding...');

  const response = await page.goto('/account/onboarding', {
    waitUntil: 'commit',
    timeout: 30000,
  });

  console.log('✅ Initial navigation committed');
  console.log(`📍 Current URL: ${page.url()}`);
  console.log(`📡 Response status: ${response?.status() ?? 'N/A'}`);

  await page
    .waitForLoadState('domcontentloaded', {
      timeout: 15000,
    })
    .catch(() => {
      console.log(
        '⚠️ DOMContentLoaded was not reached within 15 seconds. Continuing...'
      );
    });

  console.log(`📍 URL after initial load: ${page.url()}`);

  await page.waitForTimeout(2000);

  const startTime = Date.now();
  const MAX_SETUP_TIME = 40000;

  while (Date.now() - startTime < MAX_SETUP_TIME) {
    const currentUrl = page.url();

    console.log(`🔎 Current URL: ${currentUrl}`);

    if (currentUrl.includes('/app/')) {
      console.log(`🎉 Landed on dashboard: ${currentUrl}`);
      break;
    }

    if (
      currentUrl.includes('/account/onboarding') ||
      (await page
        .locator('text="Do Weather Your Way"')
        .isVisible()
        .catch(() => false))
    ) {
      console.log('➡️ Processing onboarding step...');

      const dialBtn = page.locator('text="Dial"').first();

      if (await dialBtn.isVisible().catch(() => false)) {
        console.log('🎛️ Selecting Dial...');
        await dialBtn.click().catch(() => {});
      }

      const nextBtn = page
        .locator('button, a, div[role="button"]')
        .filter({
          hasText: /Next|Continue|Save|Done|Let's Go/i,
        })
        .last();

      if (await nextBtn.isVisible().catch(() => false)) {
        console.log('➡️ Clicking onboarding action button...');

        await nextBtn.click({ force: true }).catch(() => {});

        await page.waitForTimeout(1500);

        continue;
      }
    }

    if (
      currentUrl.includes('/account/primary-location') ||
      (await page
        .locator('text="Set Primary Location"')
        .isVisible()
        .catch(() => false))
    ) {
      console.log('📍 Processing primary location...');

      const searchBox = page
        .getByPlaceholder(/search/i)
        .or(page.getByRole('textbox'))
        .or(page.locator('input'))
        .first();

      if (await searchBox.isVisible().catch(() => false)) {
        await searchBox.click();
        await searchBox.fill('');

        await searchBox.pressSequentially('Dallas', {
          delay: 100,
        });

        await page.waitForTimeout(1500);

        const suggestion = page
          .locator(
            '[role="option"], [role="listitem"], .search-results p, p, div'
          )
          .filter({
            hasText: /Dallas/i,
          })
          .first();

        if (
          await suggestion
            .isVisible({ timeout: 4000 })
            .catch(() => false)
        ) {
          console.log('📍 Selecting Dallas suggestion...');
          await suggestion.click();
        } else {
          console.log('↩️ Suggestion not found. Pressing Enter...');
          await searchBox.press('Enter');
        }

        await page.waitForTimeout(1500);

        continue;
      }
    }

    if (
      currentUrl.includes('/account/create-account') ||
      (await page
        .locator('text="Sign-In or Create Your Account"')
        .isVisible()
        .catch(() => false)) ||
      (await page
        .locator('text="Maybe Later"')
        .isVisible()
        .catch(() => false))
    ) {
      console.log('➡️ Processing account creation screen...');

      const maybeLater = page
        .locator('text="Maybe Later"')
        .or(
          page
            .locator('button, a, span, p')
            .filter({
              hasText: /^Maybe Later$/i,
            })
        )
        .first();

      if (
        await maybeLater
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        console.log('⏭️ Clicking Maybe Later...');

        await maybeLater
          .scrollIntoViewIfNeeded()
          .catch(() => {});

        await maybeLater
          .click({ force: true })
          .catch(() => {});

        await page.waitForTimeout(2000);

        continue;
      }
    }

    await page.waitForTimeout(500);
  }

  console.log(`🏁 Final URL before validation: ${page.url()}`);

  await page.waitForURL(/.*\/app\/.*/, {
    timeout: 15000,
  });

  await page.waitForTimeout(2000);

  console.log(`🎉 Setup finished on: ${page.url()}`);

  await page.context().storageState({
    path: authFile,
  });

  console.log(`✅ Setup complete! State saved to ${authFile}`);
});