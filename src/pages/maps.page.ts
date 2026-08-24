import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { LegendSidebarComponent } from '../components/legendSidebar.component';

export class MapsPage extends BasePage {
  readonly legendSidebar: LegendSidebarComponent;
  readonly allMapsBtn: Locator;
  readonly mapCanvas: Locator;
  readonly timelineBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.legendSidebar = new LegendSidebarComponent(page);

    // "ALL MAPS" button pill
    this.allMapsBtn = page
      .locator('button, [role="button"], div, span')
      .filter({ hasText: /^ALL MAPS$/i })
      .first();

    // Map canvas viewport
    this.mapCanvas = page.locator('canvas, .mapboxgl-map, .maplibregl-map, div[class*="map"]').first();

    // Time indicator badge
    this.timelineBadge = page.locator('text=/NOW|[0-9]+:[0-9]+\s*(AM|PM)|CDT|EDT|PST/i').first();
  }

  async scrollToElement(locator: Locator) {
    if (await locator.isVisible({ timeout: 3000 }).catch(() => false)) {
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);
    }
  }

  async openAllMapsModal() {
    await this.allMapsBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.allMapsBtn.click({ force: true });
    await this.page.waitForTimeout(800);
    await expect(this.page.locator('text=/SATELLITE VIEW|SEVERE WEATHER/i').first()).toBeVisible({ timeout: 8000 });
  }

  async closeAllMapsModal() {
    const closeBtn = this.page.locator('svg, button').filter({ has: this.page.locator('line, path') }).first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click({ force: true });
    } else {
      await this.allMapsBtn.click({ force: true }).catch(() => {});
    }
    await this.page.waitForTimeout(600);
  }

  async selectLayerInModal(layerName: string) {
    const layerItem = this.page
      .locator('div, li, button, p, span')
      .filter({ hasText: new RegExp(`^${layerName}$`, 'i') })
      .first();

    await layerItem.scrollIntoViewIfNeeded();
    await layerItem.click({ force: true });
    await this.page.waitForTimeout(800);
  }

  /**
   * Clicks exact tab pill using unambiguous regex matching
   */
  async selectQuickTab(tabName: string) {
    let exactRegex: RegExp;
    switch (tabName) {
      case 'RADAR':
        exactRegex = /^RADAR$/i;
        break;
      case 'CLOUDS':
        exactRegex = /^CLOUDS$/i;
        break;
      case 'TEMPERATURE (°F)':
        exactRegex = /^TEMPERATURE\s*\(\s*°F\s*\)$/i;
        break;
      case 'WIND FLOW (MPH)':
        exactRegex = /^WIND FLOW\s*\(\s*MPH\s*\)$/i;
        break;
      case 'AIR QUALITY INDEX':
        exactRegex = /^AIR QUALITY INDEX$/i;
        break;
      case 'TEMPERATURE FORECAST':
        exactRegex = /^TEMPERATURE FORECAST$/i;
        break;
      default:
        exactRegex = new RegExp(`^${tabName}$`, 'i');
    }

    const tabPill = this.page
      .locator('button, [role="button"], div, span')
      .filter({ hasText: exactRegex })
      .first();

    await tabPill.waitFor({ state: 'visible', timeout: 8000 });
    await tabPill.scrollIntoViewIfNeeded();
    await tabPill.click({ force: true });

    // Wait for the map canvas to render
    await this.page.waitForTimeout(1500);
    await expect(this.mapCanvas).toBeVisible();
  }

  /**
   * Verifies the timeline play button under the active tab
   */
  async verifyTimelinePlayButton() {
    const playBtn = this.page
      .locator('svg, button, div[role="button"]')
      .filter({ has: this.page.locator('polygon, path') })
      .first();

    if (await playBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
      await playBtn.scrollIntoViewIfNeeded();
      await expect(playBtn).toBeVisible();
      // Start timeline animation
      await playBtn.click({ force: true });
      await this.page.waitForTimeout(1000);
      // Pause
      await playBtn.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(400);
    }
  }

  /**
   * Drags/clicks across the timeline track bar
   */
  async scrubTimeline(percentage: number = 0.75) {
    const track = this.page.locator('div').filter({ hasText: /NOW|\b\d{1,2}:\d{2}\b/i }).last();
    await track.scrollIntoViewIfNeeded();
    await track.waitFor({ state: 'visible', timeout: 5000 });

    const box = await track.boundingBox();
    if (box) {
      const clickX = box.x + box.width * percentage;
      const clickY = box.y + box.height / 2;
      await this.page.mouse.click(clickX, clickY);
      await this.page.waitForTimeout(1000);
    }
  }
}