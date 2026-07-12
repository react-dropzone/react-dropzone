import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    setupFiles: ["./test-setup.js"],
    include: ["src/**/*.spec.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.spec.{ts,tsx}"]
    }
  }
});
