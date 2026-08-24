import { test as setup } from '@playwright/test';
import * as path from 'path';

const authFile = path.resolve(__dirname, '../state.json');

setup('Complete Onboarding Once for Entire Project', async ({ page }) => {
  console.log('🚀 Running setup: Completing onboarding once for all suites...');

  page.on('requestfailed', (request) => {
    console.log(
      `❌ Request failed: ${request.url()} | ${request.failure()?.errorText}`
    );
  });

  page.on('response', (response) => {
    if (response.url().includes('accuweather.com')) {
      console.log(`📡 ${response.status()} ${response.url()}`);
    }
  });

  console.log('🌐 Navigating to AccuWeather...');

  await page.goto('https://www.accuweather.com/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  await page.waitForTimeout(3000);

  console.log(`📍 Initial URL: ${page.url()}`);

  if (page.url().includes('/app/')) {
    console.log('🎉 Existing session landed directly in the application.');
    await page.context().storageState({ path: authFile });
    console.log(`✅ State saved to ${authFile}`);
    return;
  }

  const onboardingUrls = [
    'https://one.accuweather.com/account/onboarding',
    'https://www.accuweather.com/account/onboarding',
  ];

  let onboardingLoaded = false;

  for (const onboardingUrl of onboardingUrls) {
    try {
      console.log(`🌐 Trying onboarding URL: ${onboardingUrl}`);

      await page.goto(onboardingUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });

      await page.waitForTimeout(2000);

      console.log(`📍 Current URL: ${page.url()}`);

      onboardingLoaded = true;
      break;
    } catch (error) {
      console.log(`⚠️ Navigation failed: ${onboardingUrl}`);
      console.log(`⚠️ ${error}`);
    }
  }

  if (!onboardingLoaded) {
    throw new Error(
      '❌ Unable to reach the AccuWeather onboarding page from the CI runner.'
    );
  }

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
      const dialBtn = page.locator('text="Dial"').first();

      if (await dialBtn.isVisible().catch(() => false)) {
        await dialBtn.click().catch(() => {});
      }

      const nextBtn = page
        .locator('button, a, div[role="button"]')
        .filter({
          hasText: /Next|Continue|Save|Done|Let's Go/i,
        })
        .last();

      if (await nextBtn.isVisible().catch(() => false)) {
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
          await suggestion.click();
        } else {
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

  console.log(`🏁 Final URL: ${page.url()}`);

  await page.waitForURL(/.*\/app\/.*/, {
    timeout: 15000,
  });

  await page.waitForTimeout(2000);

  await page.context().storageState({
    path: authFile,
  });

  console.log(`✅ Setup complete! State saved to ${authFile}`);
});