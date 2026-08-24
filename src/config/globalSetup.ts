import { test as setup, expect } from '@playwright/test';

const authFile = 'state.json';

setup('Complete Onboarding Once for Entire Project', async ({ page }) => {
  console.log('🚀 Running setup: Completing onboarding once for all suites...');

  // Retry navigation in case of network edge reset
  let navigated = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto('/account/onboarding', {
        waitUntil: 'commit',
        timeout: 20000,
      });
      navigated = true;
      break;
    } catch (err) {
      console.warn(`⚠️ Navigation attempt ${attempt} failed, retrying...`);
      await page.waitForTimeout(2000);
    }
  }

  if (!navigated) {
    // Fallback directly to base page
    await page.goto('/app/today', { waitUntil: 'commit', timeout: 30000 });
  }

  await page.waitForTimeout(2000);

  // Complete onboarding sequence if onboarding buttons are present
  const nextBtn = page.locator('button, [role="button"]').filter({ hasText: /Next|Get Started|Continue|Skip/i }).first();
  const startTime = Date.now();

  while (Date.now() - startTime < 30000) {
    const isNextVisible = await nextBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isNextVisible) break;

    await nextBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Ensure landing on dashboard
  await page.waitForURL(/.*\/app\/.*/, { timeout: 25000 }).catch(() => {});

  // Save authenticated state
  await page.context().storageState({ path: authFile });
  console.log(`✅ Setup complete! State saved to ${authFile}`);
});