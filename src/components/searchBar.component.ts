import { Page, Locator, expect } from '@playwright/test';

export class SearchBarComponent {
  readonly page: Page;
  readonly searchTrigger: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Clickable header trigger or input
    this.searchTrigger = page.locator('header, nav, [data-testid="search-bar"], .search-container')
      .locator('button, input, [role="button"], div')
      .filter({ hasText: /search|[A-Za-z]+,\s*[A-Za-z]+/i })
      .first();

    this.searchInput = page
      .getByPlaceholder(/search/i)
      .or(page.getByRole('textbox'))
      .or(page.locator('input[type="search"], input[type="text"], input'))
      .first();
  }

  async searchAndSelectLocation(locationName: string) {
    // 1. Activate search input if it's currently a button or header display
    if (await this.searchTrigger.isVisible().catch(() => false)) {
      await this.searchTrigger.click().catch(() => { });
      await this.page.waitForTimeout(500);
    }

    // 2. Focus and enter search term
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.click();
    await this.searchInput.fill('');

    const searchTerm = locationName.split(',')[0].trim();
    await this.searchInput.pressSequentially(searchTerm, { delay: 100 });
    await this.page.waitForTimeout(1500);

    // 3. Select matching suggestion or press Enter
    const targetOption = this.page
      .locator('[role="option"], [role="listitem"], .search-results > *, .search-bar-results > *, p, button')
      .filter({ hasText: new RegExp(searchTerm, 'i') })
      .first();

    if (await targetOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await targetOption.click();
    } else {
      await this.searchInput.press('Enter');
    }

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }
}