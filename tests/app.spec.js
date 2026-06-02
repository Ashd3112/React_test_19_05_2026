import { test, expect } from '@playwright/test';

test.describe('BankDash Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the base URL configured in playwright.config.js
    await page.goto('/');
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/React/i);
  });

  test('should display the main BankDash branding', async ({ page }) => {
    const brandElement = page.locator('header .landing-logo');
    await expect(brandElement).toBeVisible();
    await expect(brandElement).toContainText('BankDash');
  });

  test('should have working login and signup links', async ({ page }) => {
    const loginLink = page.locator('header').getByRole('link', { name: /sign in/i });
    const signupLink = page.locator('header').getByRole('link', { name: /open free account/i });

    await expect(loginLink).toBeVisible();
    await expect(signupLink).toBeVisible();

    // Verify navigating to Login page
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
