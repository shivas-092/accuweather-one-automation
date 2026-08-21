import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class PremiumUpsellPage extends BasePage {
  readonly pageHeader: Locator;
  readonly benefitsList: Locator;
  readonly freeTrialButton: Locator;
  readonly maybeLaterLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h1, h2, .title').filter({ hasText: /Unlock Exclusive Features/i });
    this.benefitsList = page.locator('.benefits-list, .feature-list, ul, div').filter({ hasText: /No Ads/i });
    this.freeTrialButton = page.getByRole('button', { name: /7 Day free Trial|Start Free Trial|Explore Premium\+/i });
    this.maybeLaterLink = page.locator('a, button, span').filter({ hasText: /Maybe Later/i });
  }

  async verifyPremiumPageLoaded() {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.freeTrialButton).toBeVisible();
  }

  async verifyFeaturesList() {
    const features = [
      'No Ads',
      'AccuWeather Alerts',
      'Longer Range Forecasts',
      'More Detailed Lightning',
      'Today Page Customization',
      'Personalized Health Risks',
    ];
    for (const feature of features) {
      await expect(this.page.locator(`text=${feature}`).first()).toBeVisible();
    }
  }

  async dismissUpsell() {
    if (await this.maybeLaterLink.isVisible()) {
      await this.maybeLaterLink.click();
    }
  }
}
