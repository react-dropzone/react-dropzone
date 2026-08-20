import {defineConfig} from "@playwright/test";

// Smoke-tests the docs site in real Chromium so a hydration crash (blank page)
// fails CI instead of silently shipping — a plain HTTP probe can't see it
// because the SSR'd HTML still returns 200.
//
// Two modes:
//   - PR gate / local: build the docs (pretest:docs:e2e) and serve site/ via
//     `vocs preview` on a fixed port.
//   - Scheduled prod monitor: set DOCS_BASE_URL to hit the live site directly;
//     no build/preview needed.
const PORT = 4319;
const baseURL = process.env.DOCS_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    headless: true
  },
  webServer: process.env.DOCS_BASE_URL
    ? undefined
    : {
        command: `PORT=${PORT} npm run docs:preview`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 120000
      }
});
