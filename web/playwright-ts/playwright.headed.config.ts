import { defineConfig } from '@playwright/test';

/** Config para demo visual: ventana maximizada y acciones lentas. */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  timeout: 300_000,
  use: {
    headless: false,
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      args: ['--start-maximized', '--window-size=1920,1080'],
      slowMo: 1_200,
    },
    trace: 'on',
    actionTimeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
