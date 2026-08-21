import { test as baseTest, expect } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { TodayPage } from '../pages/today.page';
import { HourlyPage } from '../pages/hourly.page';
import { DailyPage } from '../pages/daily.page';
import { MapsPage } from '../pages/maps.page';
import { PremiumUpsellPage } from '../pages/premiumUpsell.page';

// 1. Define custom fixture types
export type AccuWeatherFixtures = {
  basePage: BasePage;
  todayPage: TodayPage;
  hourlyPage: HourlyPage;
  dailyPage: DailyPage;
  mapsPage: MapsPage;
  premiumUpsellPage: PremiumUpsellPage;
};

// 2. Extend base test with page objects
export const test = baseTest.extend<AccuWeatherFixtures>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  todayPage: async ({ page }, use) => {
    await use(new TodayPage(page));
  },
  hourlyPage: async ({ page }, use) => {
    await use(new HourlyPage(page));
  },
  dailyPage: async ({ page }, use) => {
    await use(new DailyPage(page));
  },
  mapsPage: async ({ page }, use) => {
    await use(new MapsPage(page));
  },
  premiumUpsellPage: async ({ page }, use) => {
    await use(new PremiumUpsellPage(page));
  },
});

export { expect };
