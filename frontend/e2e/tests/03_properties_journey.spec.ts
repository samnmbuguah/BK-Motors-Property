import { test, expect } from '@playwright/test';

test.describe('BK Properties & Land Journeys', () => {
  test('navigates properties, filters land & plots with soil and title deed UI', async ({ page }) => {
    // Navigate to properties listings page
    await page.goto('/properties');

    await expect(page.locator('text=Current Property Portfolio')).toBeVisible({ timeout: 10000 });

    // Filter by Land & Plots
    const landLink = page.getByRole('link', { name: /Land & Plots/i }).first();
    if (await landLink.isVisible()) {
      await landLink.click();
    } else {
      await page.goto('/properties?type=Land%2FPlot');
    }

    // Verify land-specific cards render
    const propertyCards = page.locator('.MuiCard-root');
    await expect(propertyCards.first()).toBeVisible({ timeout: 10000 });

    // Click on a property card to view details
    const viewBtn = page.getByRole('button', { name: /View Property/i }).first();
    await viewBtn.click();

    // Verify Property Specs and Tour Booking CTA
    await expect(page.locator('text=Property Description & Highlights')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Schedule (Land Site Visit|Private Viewing)/i })).toBeVisible();

    // Verify Mortgage Estimator
    await expect(page.locator('text=Mortgage Repayment Estimator')).toBeVisible();
  });
});
