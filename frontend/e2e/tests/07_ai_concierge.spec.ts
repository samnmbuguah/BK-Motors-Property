import { test, expect } from '@playwright/test';

test.describe('Floating AI Concierge Widget', () => {
  test('floating AI concierge widget is available and can open chat drawer', async ({ page }) => {
    await page.goto('/');

    // Verify Floating AI Assistant button is present on the page
    const aiWidgetButton = page.getByRole('button', { name: /Ask (Car|Property) AI/i }).first();
    await expect(aiWidgetButton).toBeVisible({ timeout: 10000 });

    // Click to open AI Assistant drawer
    await aiWidgetButton.click();

    // Verify Chat drawer header is displayed
    await expect(page.locator('text=Powered by LangGraph & NVIDIA NIM')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[placeholder*="Ask about"], textarea[placeholder*="Ask about"]').first()).toBeVisible();
  });
});
