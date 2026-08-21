import { Page, expect } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async handleOnboardingIfPresent(defaultCity: string = 'Dallas, TX'): Promise<void> {
    const maxRetries = 30;
    let stepCount = 0;

    while (stepCount < maxRetries) {
      const url = this.page.url();

      // If we are already on the app pages, onboarding is complete
      if (url.includes('/app/')) {
        break;
      }

      // Step 1: "Do Weather Your Way"
      if (url.includes('/account/onboarding') || await this.page.locator('text="Do Weather Your Way"').isVisible().catch(() => false)) {
        const continueBtn = this.page.locator('button, a').filter({ hasText: /Continue|Done|Save|Next|Get Started|Let's Go/i }).first();
        if (await continueBtn.isVisible().catch(() => false)) {
          await continueBtn.click();
          await this.page.waitForTimeout(1000);
        }
      }

      // Step 2: "Set Primary Location"
      if (url.includes('/account/primary-location') || await this.page.locator('text="Set Primary Location"').isVisible().catch(() => false)) {
        const input = this.page.locator('input[placeholder*="Search"], input[type="text"], input').first();
        if (await input.isVisible().catch(() => false)) {
          await input.click();
          await input.fill('');
          await input.pressSequentially('Dallas', { delay: 150 });
          await this.page.waitForTimeout(1500);

          // Click the first matching dropdown item or press Enter
          const option = this.page.locator('[role="option"], [role="listitem"], .search-results p, p').filter({ hasText: /Dallas/i }).first();
          if (await option.isVisible({ timeout: 4000 }).catch(() => false)) {
            await option.click();
          } else {
            await input.press('Enter');
          }
          await this.page.waitForTimeout(1500);
        }
      }

      // Step 3: "Sign-In or Create Your Account"
      if (url.includes('/account/create-account') || await this.page.locator('text="Maybe Later"').isVisible().catch(() => false)) {
        const maybeLater = this.page.locator('button, a, span, p').filter({ hasText: /^Maybe Later$/i }).first();
        if (await maybeLater.isVisible().catch(() => false)) {
          await maybeLater.click();
          await this.page.waitForTimeout(2000);
        }
      }

      stepCount++;
      await this.page.waitForTimeout(500);
    }
  }
}