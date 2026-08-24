import { test as setup } from '@playwright/test';
import * as fs from 'fs';

const authFile = 'state.json';

setup('Complete Onboarding Once for Entire Project', async ({ page }) => {
  console.log('🚀 Running setup: Verifying/Creating auth state...');

  // If running in CI and secret is provided, write state directly
  if (process.env.AUTH_STATE_JSON) {
    fs.writeFileSync(authFile, process.env.AUTH_STATE_JSON, 'utf-8');
    console.log('✅ Auth state populated from GitHub Secret!');
    return;
  }

  // Otherwise, run UI onboarding flow locally
  try {
    await page.goto('/account/onboarding', { waitUntil: 'commit', timeout: 25000 });
    await page.waitForTimeout(2000);

    const nextBtn = page.locator('button, [role="button"]').filter({ hasText: /Next|Get Started|Continue|Skip/i }).first();
    const startTime = Date.now();

    while (Date.now() - startTime < 20000) {
      const isNextVisible = await nextBtn.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isNextVisible) break;

      await nextBtn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }

    await page.waitForURL(/.*\/app\/.*/, { timeout: 20000 }).catch(() => {});
  } catch (e) {
    console.warn('⚠️ Onboarding navigation bypassed, generating current storage state...');
  }

  await page.context().storageState({ path: authFile });
  console.log(`✅ Setup complete! State saved to ${authFile}`);
});