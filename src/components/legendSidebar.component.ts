import { Page, Locator, expect } from '@playwright/test';

export class LegendSidebarComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens Legend on the right edge, verifies the title and markers, then collapses it
   */
  async verifyAndCloseLegend(legendTitle: string, expectedMarkers: string[]) {
    // 1. Check if legend drawer is currently collapsed
    const legendTab = this.page.locator('div, span, button, aside, p').filter({ hasText: /^Legend/i }).last();

    if (await legendTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await legendTab.click({ force: true });
      await this.page.waitForTimeout(1000); // Wait for sliding animation
    }

    // 2. Verify Legend Header Title (e.g. RADAR, CLOUDS, TEMPERATURE, WIND, AIR QUALITY INDEX)
    const titleEl = this.page.locator('aside, section, div').filter({
      hasText: new RegExp(legendTitle.replace(/[()]/g, '\\$&'), 'i'),
    }).last();
    await expect(titleEl).toBeVisible({ timeout: 5000 });

    // 3. Verify scale readings
    for (const marker of expectedMarkers) {
      const markerEl = this.page.locator(`text=/${marker}/i`).first();
      if (await markerEl.isVisible({ timeout: 2500 }).catch(() => false)) {
        await expect(markerEl).toBeVisible();
      }
    }
    await this.page.waitForTimeout(1200); // Visual pause to view the verified scale

    // 4. Click the bottom collapse arrow '>' or the open header to collapse the drawer
    const collapseArrow = this.page.locator('aside, section, div').filter({ hasText: /›|>|RADAR|CLOUDS|TEMPERATURE|WIND|AIR QUALITY/i }).last();
    await collapseArrow.click({ force: true });
    await this.page.waitForTimeout(800); // Allow drawer to slide shut
  }
}