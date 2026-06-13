const { test, expect } = require('@playwright/test');

// Helper to generate a unique email for each test
const uniqueEmail = () => `test.${Date.now()}${Math.random().toString(36).slice(2, 5)}@example.com`;

test.describe('Member Management – UI / E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to the Members tab
    await page.getByRole('link', { name: /members/i }).click();
    await expect(page.getByRole('heading', { name: /members/i })).toBeVisible();
  });

  test('TC-G2-E01: should register a new member via the UI form', async ({ page }) => {
    await page.getByRole('button', { name: /add member|new member|register/i }).click();

    await page.getByLabel(/name/i).fill('E2E Test User');
    await page.getByLabel(/email/i).fill(uniqueEmail());
    await page.getByRole('button', { name: /save|submit|register/i }).click();

    await expect(page.getByText('E2E Test User')).toBeVisible();
  });

  test('TC-G2-E02: should show a newly registered member in the members list', async ({ page }) => {
    const email = uniqueEmail();

    await page.getByRole('button', { name: /add member|new member|register/i }).click();
    await page.getByLabel(/name/i).fill('List Check User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('button', { name: /save|submit|register/i }).click();

    await expect(page.getByText('List Check User')).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
  });

  test('TC-G2-E03: should show a validation error when registering with an invalid email', async ({ page }) => {
    await page.getByRole('button', { name: /add member|new member|register/i }).click();

    await page.getByLabel(/name/i).fill('Bad Email User');
    await page.getByLabel(/email/i).fill('not-a-valid-email');
    await page.getByRole('button', { name: /save|submit|register/i }).click();

    // Either a browser-native validation tooltip or an app error message
    const invalidEmail = await page.getByLabel(/email/i).evaluate(
      el => el.validity ? !el.validity.valid : false
    );
    const appError = page.getByText(/valid email|invalid email|email must/i);

    const errorShown = invalidEmail || await appError.isVisible();
    expect(errorShown).toBe(true);
  });

  test('TC-G2-E04: should deactivate a member and show inactive status', async ({ page }) => {
    // First register a fresh member so we have a known one to deactivate
    const email = uniqueEmail();
    await page.getByRole('button', { name: /add member|new member|register/i }).click();
    await page.getByLabel(/name/i).fill('Deactivate Me');
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('button', { name: /save|submit|register/i }).click();
    await expect(page.getByText('Deactivate Me')).toBeVisible();

    // Open the member detail / actions
    await page.getByText('Deactivate Me').click();
    await page.getByRole('button', { name: /deactivate/i }).click();

    await expect(page.getByText(/inactive/i)).toBeVisible();
  });

  test('TC-G2-E05: should delete a member and remove them from the list', async ({ page }) => {
    // Register a fresh member to delete
    const email = uniqueEmail();
    await page.getByRole('button', { name: /add member|new member|register/i }).click();
    await page.getByLabel(/name/i).fill('Delete Me');
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('button', { name: /save|submit|register/i }).click();
    await expect(page.getByText('Delete Me')).toBeVisible();

    // Open member and delete
    await page.getByText('Delete Me').click();
    await page.getByRole('button', { name: /delete/i }).click();

    // Confirm dialog if one appears
    page.on('dialog', dialog => dialog.accept());

    await expect(page.getByText('Delete Me')).not.toBeVisible();
  });

});