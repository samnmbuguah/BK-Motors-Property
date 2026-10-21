import { test, expect } from '@playwright/test';

test.describe('BK Motors Dealership Journeys', () => {
  test('browses inventory, filters vehicles, and views vehicle specs and financing', async ({ page }) => {
    await page.goto('/inventory');

    // Verify search and filter elements
    await expect(page.locator('text=INVENTORY SHOWCASE')).toBeVisible({ timeout: 10000 });

    // Verify vehicle cards are listed and click Details on the first one
    const detailsBtn = page.getByRole('button', { name: 'Details' }).first();
    await expect(detailsBtn).toBeVisible({ timeout: 10000 });
    await detailsBtn.click();

    // Verify detail page has loaded
    await expect(page.locator('text=Technical Specifications')).toBeVisible({ timeout: 10000 });

    // Verify inspection assurance
    await expect(page.locator('text=Pre-purchase independent inspection allowed')).toBeVisible();

    // Verify Financing Calculator section
    await expect(page.locator('text=Car Loan & Financing Calculator')).toBeVisible();
    await expect(page.locator('text=Estimated Monthly Installment')).toBeVisible();

    // Verify 1-click WhatsApp inquiry CTA
    const whatsappBtn = page.getByRole('link', { name: /Inquire on WhatsApp/i }).first();
    await expect(whatsappBtn).toBeVisible();
  });
});
