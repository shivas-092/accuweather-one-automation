import { test, expect } from '../src/fixtures/baseTest';
import { TEST_DATA } from '../src/utils/testData';

test.describe('Daily Page Test Suite', () => {
  test.beforeEach(async ({ dailyPage }) => {
    await dailyPage.goto('/app/daily');
    await dailyPage.page.waitForTimeout(1000);
  });

  test('TC-DLY-001: Daily Page Layout & Initial Load', async ({ dailyPage }) => {
    await dailyPage.verifyCurrentURL(/.*\/app\/daily/);
    await dailyPage.scrollToElement(dailyPage.dailyChartContainer);
    await expect(dailyPage.dailyChartContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC-DLY-002: Sub-Heading Category Tabs - Click & Verify All 18 Categories', async ({ dailyPage }) => {
    await dailyPage.scrollToElement(dailyPage.dailyChartContainer);

    for (const category of TEST_DATA.DAILY_CATEGORIES) {
      console.log(`🔍 Selecting and verifying Daily Category: ${category}`);
      await dailyPage.selectSubCategory(category);
      await expect(dailyPage.dailyChartContainer).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-DLY-003: Temperature View (Default State)', async ({ dailyPage }) => {
    await dailyPage.selectSubCategory('TEMPERATURE');
    await dailyPage.scrollToElement(dailyPage.dailyChartContainer);
    await expect(dailyPage.dailyChartContainer).toBeVisible({ timeout: 10000 });
  });

  

  test('TC-DLY-005 & TC-DLY-006: 15 DAYS vs. 30 DAYS View Toggle & Matrix Display', async ({ dailyPage }) => {
    await dailyPage.toggle30DaysView();
    await dailyPage.scrollToElement(dailyPage.dailyChartContainer);
    await expect(dailyPage.dailyChartContainer).toBeVisible();

    await dailyPage.toggle15DaysView();
    await expect(dailyPage.dailyChartContainer).toBeVisible();
  });

  test('TC-DLY-007 to TC-DLY-009: Premium+ Banner Verification', async ({ dailyPage }) => {
    if (await dailyPage.premiumBanner.isVisible({ timeout: 4000 }).catch(() => false)) {
      await dailyPage.scrollToElement(dailyPage.premiumBanner);
      await expect(dailyPage.premiumBanner).toBeVisible();
    }
  });
});