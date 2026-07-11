import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    setupFiles: ["./test-setup.js"],
    include: ["src/**/*.spec.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.spec.{js,jsx}"]
    }
  }
});
