import { Page, Locator, expect } from '@playwright/test';

/**
 * Drags a slider thumb along its bounding box by percentage (0 to 1)
 */
export async function dragSliderByPercentage(
  page: Page,
  sliderTrack: Locator,
  percentage: number
): Promise<void> {
  const box = await sliderTrack.boundingBox();
  if (!box) throw new Error('Slider element not visible on page');

  const startX = box.x + 5;
  const startY = box.y + box.height / 2;
  const targetX = box.x + box.width * Math.min(Math.max(percentage, 0), 1);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(targetX, startY, { steps: 10 });
  await page.mouse.up();
}

/**
 * Waits for a locator to be visible and scrolls it into view
 */
export async function scrollToElement(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible();
}
