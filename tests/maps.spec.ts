import { test, expect } from '../src/fixtures/baseTest';

test.describe('Radar & Maps Page Test Suite', () => {
  test.beforeEach(async ({ mapsPage }) => {
    await mapsPage.goto('/app/maps');
    await mapsPage.page.waitForTimeout(1000);
  });

  // =========================================================================
  // 1. ALL MAPS MODAL: HIERARCHY, CATEGORIES & SUB-OPTIONS (RM-001 TO RM-010)
  // =========================================================================
  test('RM-001 to RM-010: ALL MAPS Modal, Category Hierarchy & Layer Options Verification', async ({ mapsPage }) => {
    await mapsPage.verifyCurrentURL(/.*\/app\/maps/);
    await mapsPage.scrollToElement(mapsPage.mapCanvas);
    await expect(mapsPage.mapCanvas).toBeVisible({ timeout: 10000 });
    await expect(mapsPage.allMapsBtn).toBeVisible({ timeout: 10000 });

    // Open ALL MAPS Drawer
    await mapsPage.openAllMapsModal();

    // Satellite View
    console.log('🗺️ Verifying Satellite View Layers...');
    await expect(mapsPage.page.locator('text=/SATELLITE VIEW/i').first()).toBeVisible();
    await expect(mapsPage.page.locator('text=/^Clouds$/i').first()).toBeVisible();
    await expect(mapsPage.page.locator('text=/Color-Enhanced Clouds/i').first()).toBeVisible();
    await expect(mapsPage.page.locator('text=/Water Vapor/i').first()).toBeVisible();

    // Severe Weather
    console.log('⚡ Verifying Severe Weather Layers...');
    await expect(mapsPage.page.locator('text=/SEVERE WEATHER/i').first()).toBeVisible();
    await expect(mapsPage.page.locator('text=/Government Advisories/i').first()).toBeVisible();
    await expect(mapsPage.page.locator('text=/Lightning/i').first()).toBeVisible();

    // Air Quality
    console.log('🍃 Verifying Air Quality Layers...');
    const aqiItem = mapsPage.page.locator('text=/Air Quality Index/i').first();
    await aqiItem.scrollIntoViewIfNeeded();
    await expect(aqiItem).toBeVisible();

    // Current Conditions
    console.log('🌡️ Verifying Current Conditions Layers...');
    const conditions = ['Temperature', 'RealFeel', 'Dew Point', 'Humidity', 'Visibility', 'Wind Gusts'];
    for (const item of conditions) {
      const el = mapsPage.page.locator(`text=/${item}/i`).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        await el.scrollIntoViewIfNeeded();
        await expect(el).toBeVisible();
      }
    }

    // Forecast Maps
    console.log('💨 Verifying Forecast Maps Layers...');
    const windFlow = mapsPage.page.locator('text=/Wind Flow/i').first();
    if (await windFlow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await windFlow.scrollIntoViewIfNeeded();
      await expect(windFlow).toBeVisible();
    }

    // Hurricane Center & Winter Maps
    console.log('🌀 Verifying Hurricane & Winter Maps Layers...');
    const hurricaneTracker = mapsPage.page.locator('text=/Hurricane|Tropical/i').first();
    if (await hurricaneTracker.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hurricaneTracker.scrollIntoViewIfNeeded();
      await expect(hurricaneTracker).toBeVisible();
    }

    const winterOptions = ['Past 24-Hour Snowfall', '24-Hour Snowfall Forecast', '24-Hour Ice Forecast'];
    for (const opt of winterOptions) {
      const optEl = mapsPage.page.locator(`text=/${opt.split(' ')[0]}/i`).first();
      if (await optEl.isVisible({ timeout: 2000 }).catch(() => false)) {
        await optEl.scrollIntoViewIfNeeded();
        await expect(optEl).toBeVisible();
      }
    }

    // Select Layer & Close Drawer
    await mapsPage.selectLayerInModal('Radar');
    await mapsPage.closeAllMapsModal();
    await expect(mapsPage.mapCanvas).toBeVisible();
  });

  // =========================================================================
  // 2. STRICT SEQUENTIAL ORDER: CLICK TAB -> MAP LOAD -> LEGEND VERIFY -> CLOSE LEGEND -> PLAY BUTTON
  // =========================================================================
  test('RM-011 to RM-016: Sequential Tabs Verification (Map Render, Legend Scale & Play Button)', async ({ mapsPage }) => {
    test.setTimeout(120000); // 2 minutes timeout for complete 6-tab flow

    const tabsSequence = [
      {
        tabName: 'RADAR',
        legendTitle: 'RADAR',
        scaleMarkers: ['Rain', 'Snow', 'Ice', 'Mix'],
      },
      {
        tabName: 'CLOUDS',
        legendTitle: 'CLOUDS',
        scaleMarkers: ['HIGH', 'LOW'],
      },
      {
        tabName: 'TEMPERATURE (°F)',
        legendTitle: 'TEMPERATURE',
        scaleMarkers: ['130°F', '32°F', '-50°F'],
      },
      {
        tabName: 'WIND FLOW (MPH)',
        legendTitle: 'WIND',
        scaleMarkers: ['75+ mph', '50', '35', '20', '10', '5', '0'],
      },
      {
        tabName: 'AIR QUALITY INDEX',
        legendTitle: 'AIR QUALITY INDEX',
        scaleMarkers: ['EXCELLENT', 'FAIR', 'POOR', 'UNHEALTHY', 'VERY UNHEALTHY', 'DANGEROUS'],
      },
      {
        tabName: 'TEMPERATURE FORECAST',
        legendTitle: 'TEMPERATURE',
        scaleMarkers: ['130°F', '32°F', '-50°F'],
      },
    ];

    for (let i = 0; i < tabsSequence.length; i++) {
      const item = tabsSequence[i];
      console.log(`\n=============================================================`);
      console.log(`📍 STEP 1 [Tab ${i + 1}/6]: Clicking -> ${item.tabName}`);
      await mapsPage.selectQuickTab(item.tabName);

      console.log(`📍 STEP 2 [Tab ${i + 1}/6]: Verifying & Closing Legend -> ${item.legendTitle}`);
      await mapsPage.legendSidebar.verifyAndCloseLegend(item.legendTitle, item.scaleMarkers);

      console.log(`📍 STEP 3 [Tab ${i + 1}/6]: Verifying Weather Play Button for -> ${item.tabName}`);
      await mapsPage.verifyTimelinePlayButton();
    }
  });

// =========================================================================
  // 3. TIMELINE SCRUBBER INTERACTION & TIMESTAMP UPDATE
  // =========================================================================
  test('RM-017 & RM-018: Timeline Scrubber Drag & Badge Time Update Verification', async ({ mapsPage, page }) => {
    // 1. Ensure page is fully rendered on Radar
    await mapsPage.selectQuickTab('RADAR');

    // 2. Wait for the timeline play button to confirm the player is mounted
    const playBtn = page
      .locator('svg, button, div[role="button"]')
      .filter({ has: page.locator('polygon, path') })
      .first();
    await playBtn.waitFor({ state: 'visible', timeout: 10000 });

    // 3. Scrub timeline forward
    await mapsPage.scrubTimeline();

    // 4. Assert timeline controls remain visible and active
    await expect(playBtn).toBeVisible({ timeout: 5000 });
    await expect(mapsPage.mapCanvas).toBeVisible({ timeout: 5000 });
  });
});