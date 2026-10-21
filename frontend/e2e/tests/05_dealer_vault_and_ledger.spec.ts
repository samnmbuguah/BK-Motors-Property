import { test, expect } from '@playwright/test';

test.describe('Dealer Document Vault & Escrow Ledger', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as verified client
    await page.goto('/');
    const navSignIn = page.getByRole('button', { name: /^Sign In$/i }).first();
    await navSignIn.click();

    await page.getByRole('button', { name: /David Mwangi/i }).click();
    await page.getByRole('button', { name: /Sign In to Account/i }).click();

    await expect(page.locator('text=davidmwangi').first()).toBeVisible({ timeout: 10000 });
  });

  test('accesses dealer document vault and views documents & upload actions', async ({ page }) => {
    await page.goto('/dashboard?tab=vault');

    // Verify Dealer Document Vault rendered
    await expect(page.locator('text=Dealer & Seller Document Vault')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Add New Vehicle / Property Vault')).toBeVisible();

    // Verify filter tabs exist
    await expect(page.getByRole('button', { name: /All Listings/i }).first()).toBeVisible();

    // Verify document verification status chip
    await expect(page.locator('text=Inspected & Verified').first()).toBeVisible();
  });

  test('accesses escrow transaction tracker and displays printable receipt', async ({ page }) => {
    await page.goto('/dashboard?tab=payments');

    // Verify Escrow & Payment Transactions table
    await expect(page.locator('text=Payment & Escrow Transaction Ledger')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=TOTAL TRANSACTION VOLUME')).toBeVisible();

    // Open Official Receipt dialog
    const receiptBtn = page.getByRole('button', { name: /View Official Receipt/i }).first();
    await receiptBtn.click();

    // Verify Receipt Modal opens with Official Seal & Print Button
    await expect(page.locator('text=Official Escrow Receipt').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /Print \/ Save PDF Receipt/i })).toBeVisible();
  });
});
