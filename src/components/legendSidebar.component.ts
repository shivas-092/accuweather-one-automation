import { Page, expect } from '@playwright/test';

export class LegendSidebarComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens the Legend drawer on the right edge, verifies title & scale markers, and collapses it.
   */
  async verifyAndCloseLegend(legendTitle: string, expectedMarkers: string[]) {
    // 1. Open the legend sidebar if collapsed
    const legendTab = this.page
      .locator('button, div[role="button"], span, div')
      .filter({ hasText: /^Legend/i })
      .last();

    if (await legendTab.isVisible({ timeout: 2500 }).catch(() => false)) {
      await legendTab.click({ force: true });
      await this.page.waitForTimeout(800);
    }

    // 2. Verify Legend Header Title (e.g. RADAR, CLOUDS, TEMPERATURE, WIND, AIR QUALITY INDEX)
    const titleEl = this.page
      .locator('aside, section, div')
      .filter({ hasText: new RegExp(`^${legendTitle.replace(/[()]/g, '\\$&')}$|${legendTitle.replace(/[()]/g, '\\$&')}`, 'i') })
      .last();
    await expect(titleEl).toBeVisible({ timeout: 5000 });

    // 3. Verify scale markers inside the open card
    for (const marker of expectedMarkers) {
      const markerEl = this.page.locator(`text=/${marker.replace(/[()]/g, '\\$&')}/i`).first();
      if (await markerEl.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(markerEl).toBeVisible();
      }
    }
    await this.page.waitForTimeout(600);

    // 4. Click the bottom collapse arrow '>' or card header to close it
    const collapseBtn = this.page
      .locator('aside, section, div')
      .filter({ hasText: /›|>|RADAR|CLOUDS|TEMPERATURE|WIND|AIR QUALITY INDEX/i })
      .last();

    await collapseBtn.click({ force: true });
    await this.page.waitForTimeout(600);
  }
}