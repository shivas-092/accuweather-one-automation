import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class TodayPage extends BasePage {
  // MinuteCast & Core Weather
  readonly minutecastSection: Locator;
  readonly see4HoursBtn: Locator;
  readonly dialContainer: Locator;
  readonly todaysWeatherHeading: Locator;
  readonly currentTemp: Locator;
  readonly forecastHighlightsHeading: Locator;

  // Air Quality
  readonly aqiHeading: Locator;
  readonly aqiContainer: Locator;

  // Health Risks & Modals
  readonly healthRisksHeading: Locator;
  readonly healthRiskModal: Locator;
  readonly modalDayTab: Locator;
  readonly modalNightTab: Locator;
  readonly modalHistoryTab: Locator;
  readonly modalCloseBtn: Locator;

  // 10-Day Outlook Carousel
  readonly outlookHeading: Locator;
  readonly outlookDots: Locator;

  // Sun & Moon
  readonly sunMoonHeading: Locator;
  readonly sunTab: Locator;
  readonly moonTab: Locator;
  readonly sunMoonContainer: Locator;

  constructor(page: Page) {
    super(page);

    // MinuteCast & Core Weather
    this.minutecastSection = page.locator('text=/MinuteCast|minutecast/i').first();
    this.see4HoursBtn = page
      .locator('button, a, div[role="button"]')
      .filter({ hasText: /4\s*hours?|minutecast|expanded|view/i })
      .first();
    this.dialContainer = page.locator('svg, canvas, [role="img"]').first();
    this.todaysWeatherHeading = page.locator('text=/Today\'s Weather|Current Weather/i').first();
    this.currentTemp = page.locator('text=/[0-9]+°/').first();
    this.forecastHighlightsHeading = page.locator('text=/Forecast Highlights|Looking Ahead|Expect|Highlights|Today/i').first();

    // Air Quality
    this.aqiHeading = page.locator('text=/Air Quality|Air Quality Index|AQI/i').first();
    this.aqiContainer = page.locator('div, section').filter({ hasText: /Air Quality/i }).first();

    // Health Risks
    this.healthRisksHeading = page.locator('text=/Today\'s Health Risks|Health Risks/i').first();
    this.healthRiskModal = page.locator('[role="dialog"], .modal, div[class*="modal"]').first();
    this.modalDayTab = this.healthRiskModal.getByRole('button', { name: /DAY/i });
    this.modalNightTab = this.healthRiskModal.getByRole('button', { name: /NIGHT/i });
    this.modalHistoryTab = this.healthRiskModal.getByRole('button', { name: /HISTORY/i });
    this.modalCloseBtn = this.healthRiskModal.locator('button[aria-label*="close" i], button, svg').first();

    // 10-Day Outlook
    this.outlookHeading = page.locator('text=/10-Day Outlook|Outlook/i').first();
    this.outlookDots = page.locator('[role="tablist"] button, .dot, button[aria-label*="slide" i]');

    // Sun & Moon
    this.sunMoonHeading = page.locator('text=/Sun & Moon|Sun and Moon/i').first();
    this.sunTab = page.getByRole('button', { name: /^SUN$/i }).or(page.locator('button').filter({ hasText: /^SUN$/i })).first();
    this.moonTab = page.getByRole('button', { name: /^MOON$/i }).or(page.locator('button').filter({ hasText: /^MOON$/i })).first();
    this.sunMoonContainer = page.locator('div, section').filter({ hasText: /Sun & Moon/i }).first();
  }

  async openHealthRiskModal(riskName: string) {
    const riskCard = this.page.locator('div, p, button').filter({ hasText: new RegExp(riskName, 'i') }).first();
    await riskCard.scrollIntoViewIfNeeded();
    await riskCard.click();
    await expect(this.healthRiskModal).toBeVisible({ timeout: 10000 });
  }

  async closeHealthRiskModal() {
    await this.modalCloseBtn.click();
    await expect(this.healthRiskModal).toBeHidden({ timeout: 10000 });
  }

  async goToOutlookSlide(slideIndex: number) {
    if (await this.outlookDots.nth(slideIndex).isVisible().catch(() => false)) {
      await this.outlookDots.nth(slideIndex).click();
    }
  }
}