const { test, expect } = require('@playwright/test');

const uniqueEmail = () => `test.${Date.now()}${Math.random().toString(36).slice(2, 5)}@example.com`;

test.describe('Member Management – UI / E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('nav button[data-tab="members"]').click();
    await expect(page.getByRole('heading', { name: /all members/i })).toBeVisible();
  });

  test('TC-G2-E01: should register a new member via the UI form', async ({ page }) => {
    await page.getByPlaceholder('Full Name').fill('E2E Test User');
    await page.getByPlaceholder('Email').fill(uniqueEmail());
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText(/Registered "E2E Test User"/)).toBeVisible();
  });

  test('TC-G2-E02: should show a newly registered member in the members list', async ({ page }) => {
    const email = uniqueEmail();

    await page.getByPlaceholder('Full Name').fill('List Check User');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByRole('cell', { name: 'List Check User' })).toBeVisible();
  });

  test('TC-G2-E03: should show a validation error when registering with an invalid email', async ({ page }) => {
    await page.getByPlaceholder('Full Name').fill('Bad Email User');
    await page.getByPlaceholder('Email').fill('not-a-valid-email');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText(/email must be a valid email address/i)).toBeVisible();
  });

  test('TC-G2-E04: should deactivate a member and show inactive status', async ({ page }) => {
    const email = uniqueEmail();
    await page.getByPlaceholder('Full Name').fill('Deactivate Me');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registered "Deactivate Me"/)).toBeVisible();

    // Click the member row to open detail page
    await page.getByRole('cell', { name: 'Deactivate Me' }).click();
    await page.getByRole('button', { name: 'Deactivate' }).click();

    await expect(page.getByText('Member deactivated.')).toBeVisible();
  });

  test('TC-G2-E05: should delete a member and remove them from the list', async ({ page }) => {
    const email = uniqueEmail();
    await page.getByPlaceholder('Full Name').fill('Delete Me');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registered "Delete Me"/)).toBeVisible();

    // Click the member row to open detail page
    await page.getByRole('cell', { name: 'Delete Me' }).click();

    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).click();

    // Should be back on the members list, deleted member no longer visible
    await expect(page.getByRole('heading', { name: /all members/i })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Delete Me' })).not.toBeVisible();
  });

});