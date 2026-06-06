// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  // ── Test Discovery ─────────────────────────────────────────────────────────
  testDir: "./e2e",
  testMatch: "**/*.spec.js",

  // ── Parallelism ────────────────────────────────────────────────────────────
  // Run test files in parallel for speed; tests within a file run serially
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,

  // ── Retry ──────────────────────────────────────────────────────────────────
  retries: process.env.CI ? 2 : 0,

  // ── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  // ── Global Settings ────────────────────────────────────────────────────────
  use: {
    // Base URL of the running Next.js dev server
    baseURL: "http://localhost:3000",

    // Capture screenshot on every test failure for debugging
    screenshot: "only-on-failure",

    // Record a video on failure for frame-by-frame analysis
    video: "on-first-retry",

    // Full page trace on failure (includes network, console logs, DOM snapshots)
    trace: "on-first-retry",

    // Strict mode: throws if selector matches > 1 element (prevents flaky tests)
    strict: true,

    // Reasonable action timeout — slower CI machines need headroom
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // ── Browser Matrix ─────────────────────────────────────────────────────────
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] }, // Tests responsive layout
    },
  ],

  // ── Dev Server ─────────────────────────────────────────────────────────────
  // Playwright auto-starts the dev server before E2E tests and tears it down after
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // Next.js cold start can be slow
    stdout: "pipe",
    stderr: "pipe",
  },

  outputDir: "playwright-results",
});
