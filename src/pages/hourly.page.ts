import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HourlyPage extends BasePage {
  readonly listTab: Locator;
  readonly graphTab: Locator;
  readonly hourlyListContainer: Locator;
  readonly hourlyRows: Locator;
  readonly sunriseDividers: Locator;
  readonly sunsetDividers: Locator;
  readonly premiumPlusBanner: Locator;

  // Detail Modal / Expanded Drawer
  readonly hourlyModal: Locator;
  readonly modalCloseBtn: Locator;

  // Graph View Elements
  readonly graphSubTabs: Locator;
  readonly watchForRewardsOverlay: Locator;
  readonly watchRewardsPlayBtn: Locator;

  constructor(page: Page) {
    super(page);

    // List & Graph Tabs (Segmented control or buttons)
    this.listTab = page.locator('button, [role="tab"], div').filter({ hasText: /^LIST$/i }).first();
    this.graphTab = page.locator('button, [role="tab"], div').filter({ hasText: /^GRAPH$/i }).first();

    // Hourly Forecast rows and container
    this.hourlyListContainer = page.locator('main, [role="main"], div').filter({ hasText: /Hourly|Today|Tonight/i }).first();
    this.hourlyRows = page.locator('div, [role="button"], button').filter({ hasText: /\b(1[0-2]|[1-9])\s*(AM|PM)\b/i });

    // Sunrise & Sunset Event Markers
    this.sunriseDividers = page.locator('div, p, span').filter({ hasText: /SUNRISE/i });
    this.sunsetDividers = page.locator('div, p, span').filter({ hasText: /SUNSET/i });

    // Premium+ Banner
    this.premiumPlusBanner = page.locator('div, section, aside').filter({ hasText: /Explore Premium\+|Unlock Hourly|Premium\+/i }).first();

    // Modal or Expanded Details Container
    this.hourlyModal = page.locator('[role="dialog"], .modal, div[class*="modal"], div[class*="drawer"], div[class*="expanded"]').first();
    this.modalCloseBtn = page.locator('button[aria-label*="close" i], button, svg').filter({ hasText: /close|✕|×/i }).first();

    // Graph Subtabs & Ad Prompt
    this.graphSubTabs = page.locator('button, [role="tab"], div').filter({ hasText: /TEMP|REALFEEL|RAIN|WIND|GUSTS/i });
    this.watchForRewardsOverlay = page.locator('div, section').filter({ hasText: /Watch.*Reward|Unlock with Ad|Premium|Ad/i }).first();
    this.watchRewardsPlayBtn = page.getByRole('button', { name: /Watch|Play|Unlock/i }).or(page.locator('button, a').filter({ hasText: /Watch|Play/i })).first();
  }

  /**
   * Smoothly scrolls an element into view to provide a clear visual execution trace
   */
  async scrollToElement(locator: Locator) {
    if (await locator.isVisible({ timeout: 4000 }).catch(() => false)) {
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(600);
    }
  }

  async openHourlyDetail(index: number = 0) {
    const targetRow = this.hourlyRows.nth(index);
    await this.scrollToElement(targetRow);
    await targetRow.click();
    await this.page.waitForTimeout(1000);
  }

  async closeHourlyDetail() {
    if (await this.modalCloseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.modalCloseBtn.click();
      await this.page.waitForTimeout(500);
    } else {
      // Re-click the row to toggle close if it expanded inline
      await this.hourlyRows.first().click().catch(() => {});
    }
  }

  async switchToGraphView() {
    if (await this.graphTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.scrollToElement(this.graphTab);
      await this.graphTab.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async clickLockedGraphTab(tabName: string) {
    const tab = this.graphSubTabs.filter({ hasText: new RegExp(tabName, 'i') }).first();
    if (await tab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.scrollToElement(tab);
      await tab.click();
      await this.page.waitForTimeout(1000);
    }
  }
}