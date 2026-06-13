const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  // IMPORTANT: keep Playwright's working output dir OUT of test-results/.
  // Playwright wipes its outputDir at the start of every run; if it points at
  // test-results/ it deletes the Jest API report (junit.xml) written earlier.
  outputDir: './test-artifacts',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: process.env.SUT_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
});