import { Page, Locator, expect } from '@playwright/test';
import { BottomNavComponent } from '../components/bottomNav.component';
import { SearchBarComponent } from '../components/searchBar.component';

export class BasePage {
  readonly page: Page;
  readonly bottomNav: BottomNavComponent;
  readonly searchBar: SearchBarComponent;
  readonly logo: Locator;
  readonly userIcon: Locator;
  readonly menuIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bottomNav = new BottomNavComponent(page);
    this.searchBar = new SearchBarComponent(page);
    this.logo = page.locator('.accuweather-logo, [data-testid="logo"]').first();
    this.userIcon = page.locator('.user-icon, [data-testid="user-profile"]').first();
    this.menuIcon = page.locator('.menu-icon, [data-testid="menu-button"]').first();
  }

  async goto(path: string = '/app/today') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyCurrentURL(pattern: RegExp | string) {
    await expect(this.page).toHaveURL(pattern);
  }

  async waitForPageReady() {
    await this.page.waitForLoadState('networkidle');
  }
}