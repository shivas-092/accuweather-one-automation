import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DailyPage extends BasePage {
  readonly subCategoryTabs: Locator;
  readonly dailyChartContainer: Locator;
  readonly fifteenDaysBtn: Locator;
  readonly thirtyDaysBtn: Locator;
  readonly chartColumns: Locator;
  readonly premiumBanner: Locator;

  constructor(page: Page) {
    super(page);

    // Subcategory horizontal tabs
    this.subCategoryTabs = page.locator('button, [role="tab"], div').filter({
      hasText: /TEMPERATURE|COMMON COLD|FLU|POLLEN|MOLD|ASTHMA|COPD|MIGRAINES|ARTHRITIS|SINUS|PESTS|DEHYDRATION|SKIN/i,
    });

    // Main forecast card / chart container (resilient to any selected tab)
    this.dailyChartContainer = page
      .locator('main, [role="main"], div')
      .filter({ hasText: /15 DAYS|30 DAYS/i })
      .first();

    // 15 Days & 30 Days view toggles
    this.fifteenDaysBtn = page.locator('button, [role="tab"], div').filter({ hasText: /^15 DAYS$/i }).first();
    this.thirtyDaysBtn = page.locator('button, [role="tab"], div').filter({ hasText: /^30 DAYS$/i }).first();

    // Chart day columns
    this.chartColumns = page.locator('div').filter({ hasText: /\b(1[0-9]|2[0-9]|3[01]|[1-9])\b/ });

    // Premium banner
    this.premiumBanner = page.locator('text=/Go ad-free with Premium\+|Explore Premium\+/i').first();
  }

  /**
   * Smoothly scrolls an element into view for clear headed execution
   */
  async scrollToElement(locator: Locator) {
    if (await locator.isVisible({ timeout: 3000 }).catch(() => false)) {
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(400);
    }
  }

  /**
   * Horizontally scrolls to and clicks each specific sub-category tab
   */
  async selectSubCategory(categoryName: string) {
    const tab = this.page
      .locator('button, [role="tab"], span, p, div')
      .filter({ hasText: new RegExp(`^${categoryName.replace('&', '\\&')}$`, 'i') })
      .first();

    await tab.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await tab.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async toggle30DaysView() {
    if (await this.thirtyDaysBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.scrollToElement(this.thirtyDaysBtn);
      await this.thirtyDaysBtn.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async toggle15DaysView() {
    if (await this.fifteenDaysBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.scrollToElement(this.fifteenDaysBtn);
      await this.fifteenDaysBtn.click();
      await this.page.waitForTimeout(1000);
    }
  }
}