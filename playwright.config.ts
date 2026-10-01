import { defineConfig } from '@playwright/test';

const channel = process.env.BROWSER_CHANNEL ?? (process.env.CI ? undefined : 'chrome');

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    channel,
    trace: 'retain-on-failure',
  },
});
