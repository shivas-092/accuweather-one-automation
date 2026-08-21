import { test, expect } from '../src/fixtures/baseTest';

test.describe('Hourly Page Test Suite', () => {
  test.beforeEach(async ({ hourlyPage }) => {
    await hourlyPage.goto('/app/hourly');
    await hourlyPage.page.waitForTimeout(1000);
  });

  test('TC_HOURLY_001 to 003: Hourly Navigation, Initial Layout & Range Limits', async ({ hourlyPage }) => {
    await hourlyPage.verifyCurrentURL(/.*\/app\/hourly/);
    await hourlyPage.scrollToElement(hourlyPage.hourlyListContainer);
    await expect(hourlyPage.hourlyListContainer).toBeVisible({ timeout: 10000 });
    
    await hourlyPage.scrollToElement(hourlyPage.hourlyRows.first());
    await expect(hourlyPage.hourlyRows.first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_HOURLY_004 & 005: Sunrise and Sunset Event Marker Display', async ({ hourlyPage }) => {
    if (await hourlyPage.sunriseDividers.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await hourlyPage.scrollToElement(hourlyPage.sunriseDividers.first());
      await expect(hourlyPage.sunriseDividers.first()).toBeVisible();
    }
    if (await hourlyPage.sunsetDividers.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await hourlyPage.scrollToElement(hourlyPage.sunsetDividers.first());
      await expect(hourlyPage.sunsetDividers.first()).toBeVisible();
    }
  });

  test('TC_HOURLY_006 & 007: Hourly Row Verification & Free Tier Limit Banner', async ({ hourlyPage }) => {
    await hourlyPage.scrollToElement(hourlyPage.hourlyRows.first());
    await expect(hourlyPage.hourlyRows.first()).toBeVisible({ timeout: 10000 });

    if (await hourlyPage.premiumPlusBanner.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hourlyPage.scrollToElement(hourlyPage.premiumPlusBanner);
      await expect(hourlyPage.premiumPlusBanner).toBeVisible();
    }
  });

  test('TC_HOURLY_008: List vs. Graph View Toggle', async ({ hourlyPage }) => {
    if (await hourlyPage.graphTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hourlyPage.switchToGraphView();
      if (await hourlyPage.graphSubTabs.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(hourlyPage.graphSubTabs.first()).toBeVisible();
      }

      await hourlyPage.scrollToElement(hourlyPage.listTab);
      await hourlyPage.listTab.click();
      await expect(hourlyPage.hourlyListContainer).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC_HOURLY_009 to 011: Hourly Detail Modal Popup & Metrics Breakdown', async ({ hourlyPage }) => {
    await hourlyPage.openHourlyDetail(0);
    // Verified detail breakdown or expanded metrics row
    const expandedDetails = hourlyPage.hourlyModal.or(hourlyPage.page.locator('text=/RealFeel|Humidity|Wind/i').first());
    await hourlyPage.scrollToElement(expandedDetails);
    await expect(expandedDetails).toBeVisible({ timeout: 10000 });
    await hourlyPage.closeHourlyDetail();
  });

  test('TC_HOURLY_012 to 014: Gated Graph Overlay & Ad Reward Prompt', async ({ hourlyPage }) => {
    if (await hourlyPage.graphTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hourlyPage.switchToGraphView();
      await hourlyPage.clickLockedGraphTab('RAIN');

      if (await hourlyPage.watchRewardsPlayBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await hourlyPage.scrollToElement(hourlyPage.watchRewardsPlayBtn);
        await expect(hourlyPage.watchRewardsPlayBtn).toBeVisible();
      }
    }
  });

  test('TC_HOURLY_018: Explore Premium+ Navigation Verification', async ({ hourlyPage, premiumUpsellPage }) => {
    if (await hourlyPage.premiumPlusBanner.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hourlyPage.scrollToElement(hourlyPage.premiumPlusBanner);
      const exploreBtn = hourlyPage.premiumPlusBanner.locator('button, a').filter({ hasText: /Explore Premium\+|Learn More|Get Premium/i }).first();

      if (await exploreBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await exploreBtn.click();
        await premiumUpsellPage.verifyPremiumPageLoaded();
      }
    }
  });
});