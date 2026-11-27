import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  testDir: __dirname,
  testMatch: /.*\.spec\.mjs$/,
  outputDir: path.join(__dirname, '.cache', 'test-results'),
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.MOBILE_BASE_URL || 'http://127.0.0.1:5175',
    viewport: { width: 360, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
})
