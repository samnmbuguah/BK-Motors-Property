import { test, expect } from '@playwright/test';

test.describe('Authentication & Protected Gateways', () => {
  test('unauthenticated visitor encounters auth gate on consignment / listing page', async ({ page, baseURL }) => {
    const isMotors = !baseURL?.includes('propert');
    const targetPath = isMotors ? '/sell' : '/list';

    // Navigate directly to sell / list page
    await page.goto(targetPath);

    if (isMotors) {
      await expect(page.locator('text=Sign In Required to Consign or Sell')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=verified logbook transfers')).toBeVisible();
    } else {
      await expect(page.locator('text=Sign In Required to List a Property')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=verified land title standards')).toBeVisible();
    }

    // Verify Sign In button is present
    const signInBtn = page.getByRole('button', { name: /Sign In/i }).first();
    await expect(signInBtn).toBeVisible();
  });

  test('user can log in with seeded client credentials and access portal', async ({ page, baseURL }) => {
    const isMotors = !baseURL?.includes('propert');
    await page.goto('/');

    // Click Sign In in the top navbar
    const navSignIn = page.getByRole('button', { name: /^Sign In$/i }).first();
    await navSignIn.click();

    // Fill credentials for verified client using 1-Click Demo and submit
    await page.getByRole('button', { name: /David Mwangi/i }).click();
    await page.getByRole('button', { name: /Sign In to Account/i }).click();

    // Verify authenticated user is displayed in navbar
    await expect(page.locator('text=davidmwangi').first()).toBeVisible({ timeout: 10000 });

    // Navigate to protected page - the auth gate should now be unlocked
    await page.goto(isMotors ? '/sell' : '/list');
    if (isMotors) {
      await expect(page.locator('text=Vehicle & Appraisal Details')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Sign In Required to Consign or Sell')).not.toBeVisible();
    } else {
      await expect(page.locator('text=Property & Owner Information')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Sign In Required to List a Property')).not.toBeVisible();
    }
  });
});
