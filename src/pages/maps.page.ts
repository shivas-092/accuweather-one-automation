import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { LegendSidebarComponent } from '../components/legendSidebar.component';

export class MapsPage extends BasePage {
  readonly legendSidebar: LegendSidebarComponent;
  readonly allMapsBtn: Locator;
  readonly mapCanvas: Locator;

  // Timeline Controls
  readonly timelinePlayBtn: Locator;
  readonly timelineTrack: Locator;
  readonly timelineBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.legendSidebar = new LegendSidebarComponent(page);

    // "ALL MAPS" pill button
    this.allMapsBtn = page
      .locator('button, [role="button"], div, span')
      .filter({ hasText: /^ALL MAPS$/i })
      .first();

    // Map viewport canvas
    this.mapCanvas = page.locator('canvas, .mapboxgl-map, .maplibregl-map, div[class*="map"]').first();

    // Timeline player elements
    this.timelineTrack = page
      .locator('div[class*="timeline"], div[class*="slider"], div[class*="progress"]')
      .or(page.locator('div').filter({ has: page.locator('text=/NOW/i') }))
      .last();
    this.timelinePlayBtn = page
      .locator('svg, button, div[role="button"]')
      .filter({ has: page.locator('polygon, path') })
      .first();
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
      .filter({ hasText: new RegExp(`^${layerName}$|${layerName}`, 'i') })
      .first();

    await layerItem.scrollIntoViewIfNeeded();
    await layerItem.click({ force: true });
    await this.page.waitForTimeout(800);
  }

  /**
   * Clicks the exact tab in the top bar using unambiguous exact matching
   */
  async selectQuickTab(tabName: string) {
    let tabLocator: Locator;

    if (tabName === 'RADAR') {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: /^RADAR$/i }).first();
    } else if (tabName === 'CLOUDS') {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: /^CLOUDS$|COLOR-ENHANCED CLOUDS/i }).first();
    } else if (tabName.includes('TEMPERATURE (°F)') || tabName === 'TEMPERATURE') {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: /^TEMPERATURE\s*\(\s*°F\s*\)$/i }).first();
    } else if (tabName.includes('WIND FLOW')) {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: /^WIND FLOW\s*\(\s*MPH\s*\)$/i }).first();
    } else if (tabName.includes('AIR QUALITY')) {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: /^AIR QUALITY INDEX$/i }).first();
    } else if (tabName.includes('TEMPERATURE FORECAST')) {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: /^TEMPERATURE FORECAST$/i }).first();
    } else {
      tabLocator = this.page.locator('button, [role="button"], div, span').filter({ hasText: new RegExp(`^${tabName}$`, 'i') }).first();
    }

    await tabLocator.waitFor({ state: 'visible', timeout: 8000 });
    await tabLocator.scrollIntoViewIfNeeded();
    await tabLocator.click({ force: true });

    // Wait for the map canvas to render
    await this.page.waitForTimeout(1500);
    await expect(this.mapCanvas).toBeVisible();
  }

  /**
   * Verifies the timeline play button under the active tab
   */
  async verifyTimelinePlayButton() {
    const playBtn = this.page.locator('svg, button, div[role="button"]').filter({ has: this.page.locator('polygon, path') }).first();

    if (await playBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
      await playBtn.scrollIntoViewIfNeeded();
      await expect(playBtn).toBeVisible();
      // Click play
      await playBtn.click({ force: true });
      await this.page.waitForTimeout(1000);
      // Pause
      await playBtn.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(400);
    } else {
      console.log('ℹ️ Static layer: Timeline play button is not applicable.');
    }
  }
}