
import { Page, Locator } from '@playwright/test';

export class BottomNavComponent {
  readonly page: Page;
  readonly homeTab: Locator;
  readonly todayTab: Locator;
  readonly hourlyTab: Locator;
  readonly dailyTab: Locator;
  readonly radarMapsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeTab = page.getByRole('button', { name: 'Home' }).or(page.locator('a, button').filter({ hasText: /^Home$/i }));
    this.todayTab = page.getByRole('button', { name: 'Today' }).or(page.locator('a, button').filter({ hasText: /^Today$/i }));
    this.hourlyTab = page.getByRole('button', { name: 'Hourly' }).or(page.locator('a, button').filter({ hasText: /^Hourly$/i }));
    this.dailyTab = page.getByRole('button', { name: 'Daily' }).or(page.locator('a, button').filter({ hasText: /^Daily$/i }));
    this.radarMapsTab = page.getByRole('button', { name: 'Radar & Maps' }).or(page.locator('a, button').filter({ hasText: /Radar & Maps/i }));
  }

  async navigateToToday() {
    await this.todayTab.click();
    await this.page.waitForURL(/.*\/app\/today/);
  }

  async navigateToHourly() {
    await this.hourlyTab.click();
    await this.page.waitForURL(/.*\/app\/hourly/);
  }

  async navigateToDaily() {
    await this.dailyTab.click();
    await this.page.waitForURL(/.*\/app\/daily/);
  }

  async navigateToRadarMaps() {
    await this.radarMapsTab.click();
    await this.page.waitForURL(/.*\/app\/maps/);
  }
}