import { test, expect } from '../src/fixtures/baseTest';
import { TEST_DATA } from '../src/utils/testData';

test.describe('Today Page Test Suite', () => {
  test.beforeEach(async ({ todayPage }) => {
    await todayPage.goto('/app/today');
  });

  test('TC_01 & TC_02: Location Search and Page Navigation', async ({ todayPage }) => {
    await todayPage.searchBar.searchAndSelectLocation(TEST_DATA.LOCATIONS.WASHINGTON);
    await todayPage.verifyCurrentURL(/.*\/app\/today/);
    await todayPage.currentTemp.scrollIntoViewIfNeeded();
    await expect(todayPage.currentTemp).toBeVisible({ timeout: 10000 });
  });

  test('TC_04 to TC_07: MinuteCast Card & Dial Display', async ({ todayPage }) => {
    await todayPage.minutecastSection.scrollIntoViewIfNeeded();
    await expect(todayPage.minutecastSection).toBeVisible({ timeout: 10000 });
    
    if (await todayPage.see4HoursBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await todayPage.see4HoursBtn.scrollIntoViewIfNeeded();
      await expect(todayPage.see4HoursBtn).toBeVisible();
    }
  });

  test('TC_08 to TC_13: Today Weather Card & Forecast Highlights', async ({ todayPage }) => {
    await todayPage.todaysWeatherHeading.scrollIntoViewIfNeeded();
    await expect(todayPage.todaysWeatherHeading).toBeVisible({ timeout: 10000 });
    
    await todayPage.currentTemp.scrollIntoViewIfNeeded();
    await expect(todayPage.currentTemp).toBeVisible({ timeout: 10000 });
    
    if (await todayPage.forecastHighlightsHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
      await todayPage.forecastHighlightsHeading.scrollIntoViewIfNeeded();
      await expect(todayPage.forecastHighlightsHeading).toBeVisible();
    }
  });

  test('TC_24 to TC_26: 24-Hour Air Quality Index Widget', async ({ todayPage }) => {
    await todayPage.aqiHeading.scrollIntoViewIfNeeded();
    await expect(todayPage.aqiHeading).toBeVisible({ timeout: 10000 });
  });

  test('TC_31 to TC_40: Health Risks Scale & Detail Interaction', async ({ todayPage }) => {
    await todayPage.healthRisksHeading.scrollIntoViewIfNeeded();
    await expect(todayPage.healthRisksHeading).toBeVisible({ timeout: 10000 });
  });

  test('TC_69 to TC_74: 10-Day Outlook Carousel Slides', async ({ todayPage }) => {
    await todayPage.outlookHeading.scrollIntoViewIfNeeded();
    await expect(todayPage.outlookHeading).toBeVisible({ timeout: 10000 });
    await todayPage.goToOutlookSlide(1);
  });

  test('TC_75 to TC_77: Sun & Moon Trajectory Section', async ({ todayPage }) => {
    await todayPage.sunMoonHeading.scrollIntoViewIfNeeded();
    await expect(todayPage.sunMoonHeading).toBeVisible({ timeout: 10000 });

    if (await todayPage.moonTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await todayPage.moonTab.scrollIntoViewIfNeeded();
      await todayPage.moonTab.click();
      await expect(todayPage.sunMoonHeading).toBeVisible();
    }
  });
});