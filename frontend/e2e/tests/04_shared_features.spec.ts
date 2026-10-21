import { test, expect } from '@playwright/test';

test.describe('Shared Platform Features', () => {
  test('toggles currency between KES and USD across listings', async ({ page, baseURL }) => {
    const isMotors = !baseURL?.includes('propert');
    await page.goto(isMotors ? '/inventory' : '/properties');

    // Check default currency display is KES
    await expect(page.locator('text=KES').first()).toBeVisible({ timeout: 10000 });

    // Click USD toggle button
    const usdButton = page.getByRole('button', { name: /USD/i }).first();
    await usdButton.click();

    // Verify USD currency symbol ($) is displayed
    await expect(page.locator('text=$').first()).toBeVisible({ timeout: 5000 });

    // Switch back to KES
    const kesButton = page.getByRole('button', { name: /KES/i }).first();
    await kesButton.click();
    await expect(page.locator('text=KES').first()).toBeVisible({ timeout: 5000 });
  });

  test('adds items to favorites shortlist and opens shortlist drawer', async ({ page, baseURL }) => {
    const isMotors = !baseURL?.includes('propert');
    await page.goto(isMotors ? '/inventory' : '/properties');

    // Click favorite heart button on the first card
    const favButton = page.getByRole('button', { name: /Add to favorites/i }).first();
    await favButton.click();

    // Open shortlist drawer via navbar button
    const shortlistBtn = page.getByRole('button', { name: /View Saved (Shortlist|Real Estate)/i }).first();
    await shortlistBtn.click();

    // Verify Shortlist Drawer opened
    await expect(page.locator('text=My Saved').first()).toBeVisible({ timeout: 5000 });
  });
});
